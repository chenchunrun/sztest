import { useState, useCallback } from 'react';

interface StorageEnvelope<T> {
  value: T;
  expiresAt?: number;
}

interface UseLocalStorageOptions {
  ttlMs?: number;
}

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;

    const parsed = JSON.parse(item) as T | StorageEnvelope<T>;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'value' in parsed &&
      (!('expiresAt' in parsed) || typeof parsed.expiresAt === 'number' || parsed.expiresAt === undefined)
    ) {
      const envelope = parsed as StorageEnvelope<T>;
      if (typeof envelope.expiresAt === 'number' && envelope.expiresAt <= Date.now()) {
        window.localStorage.removeItem(key);
        return fallback;
      }
      return envelope.value;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const ttlMs = options?.ttlMs;
  const [storedValue, setStoredValue] = useState<T>(() => {
    return readStoredValue(key, initialValue);
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        const payload: StorageEnvelope<T> = {
          value: valueToStore,
          expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
        };
        window.localStorage.setItem(key, JSON.stringify(payload));
      } catch {
        // ignore quota exceeded
      }
      return valueToStore;
    });
  }, [key, ttlMs]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue];
}

// 独立的工具函数，用于非组件场景
export const storage = {
  get<T>(key: string, fallback: T): T {
    return readStoredValue(key, fallback);
  },
  set<T>(key: string, value: T, options?: UseLocalStorageOptions): void {
    try {
      const payload: StorageEnvelope<T> = {
        value,
        expiresAt: options?.ttlMs ? Date.now() + options.ttlMs : undefined,
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // ignore
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
