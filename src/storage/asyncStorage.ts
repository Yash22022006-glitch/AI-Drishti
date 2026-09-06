/**
 * React Native AsyncStorage interface implementation for web/PWA runtime.
 * Mirrored after @react-native-async-storage/async-storage.
 * Persists data asynchronously to browser localStorage with in-memory caching
 * and cross-tab/runtime event notifications.
 */

type Callback = (error?: Error | null, result?: any) => void;
type StorageListener = (key: string, newValue: string | null) => void;

const STORAGE_PREFIX = '@AI_DRISHTI:';

class AsyncStorageMock {
  private memoryCache: Map<string, string> = new Map();
  private listeners: Set<StorageListener> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (fullKey && fullKey.startsWith(STORAGE_PREFIX)) {
          const rawKey = fullKey.slice(STORAGE_PREFIX.length);
          const val = localStorage.getItem(fullKey);
          if (val !== null) {
            this.memoryCache.set(rawKey, val);
          }
        }
      }
      this.initialized = true;
    } catch (e) {
      console.warn('[AsyncStorage] Failed to preload from localStorage:', e);
    }
  }

  private getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  public addListener(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(key: string, value: string | null) {
    this.listeners.forEach((listener) => {
      try {
        listener(key, value);
      } catch (err) {
        console.error('[AsyncStorage] Listener error:', err);
      }
    });
  }

  public async getItem(key: string, callback?: Callback): Promise<string | null> {
    await this.simulateLatency();
    try {
      let value = this.memoryCache.get(key) ?? null;
      if (value === null && typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.getKey(key));
        if (stored !== null) {
          this.memoryCache.set(key, stored);
          value = stored;
        }
      }
      if (callback) callback(null, value);
      return value;
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async setItem(key: string, value: string, callback?: Callback): Promise<void> {
    await this.simulateLatency();
    try {
      this.memoryCache.set(key, value);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.getKey(key), value);
      }
      this.notifyListeners(key, value);
      if (callback) callback(null);
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async removeItem(key: string, callback?: Callback): Promise<void> {
    await this.simulateLatency();
    try {
      this.memoryCache.delete(key);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.getKey(key));
      }
      this.notifyListeners(key, null);
      if (callback) callback(null);
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async mergeItem(key: string, value: string, callback?: Callback): Promise<void> {
    await this.simulateLatency();
    try {
      const current = await this.getItem(key);
      let merged = value;
      if (current) {
        try {
          const currentObj = JSON.parse(current);
          const newObj = JSON.parse(value);
          if (typeof currentObj === 'object' && typeof newObj === 'object') {
            merged = JSON.stringify({ ...currentObj, ...newObj });
          }
        } catch {
          // If not valid json, overwrite
          merged = value;
        }
      }
      await this.setItem(key, merged);
      if (callback) callback(null);
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async clear(callback?: Callback): Promise<void> {
    await this.simulateLatency();
    try {
      this.memoryCache.clear();
      if (typeof window !== 'undefined') {
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            toRemove.push(k);
          }
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
      }
      this.notifyListeners('*', null);
      if (callback) callback(null);
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async getAllKeys(callback?: Callback): Promise<readonly string[]> {
    await this.simulateLatency();
    try {
      const keys = Array.from(this.memoryCache.keys());
      if (callback) callback(null, keys);
      return keys;
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async multiGet(keys: readonly string[], callback?: Callback): Promise<readonly [string, string | null][]> {
    await this.simulateLatency();
    try {
      const result: [string, string | null][] = [];
      for (const k of keys) {
        const v = await this.getItem(k);
        result.push([k, v]);
      }
      if (callback) callback(null, result);
      return result;
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async multiSet(keyValuePairs: readonly [string, string][], callback?: Callback): Promise<void> {
    await this.simulateLatency();
    try {
      for (const [k, v] of keyValuePairs) {
        await this.setItem(k, v);
      }
      if (callback) callback(null);
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  public async multiRemove(keys: readonly string[], callback?: Callback): Promise<void> {
    await this.simulateLatency();
    try {
      for (const k of keys) {
        await this.removeItem(k);
      }
      if (callback) callback(null);
    } catch (error: any) {
      if (callback) callback(error);
      throw error;
    }
  }

  // Small async tick to simulate React Native native bridge async behavior
  private simulateLatency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 15));
  }
}

export const AsyncStorage = new AsyncStorageMock();
export default AsyncStorage;
