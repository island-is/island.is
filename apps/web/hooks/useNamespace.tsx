export function useNamespace(namespace = {}) {
  return (key: string, fallback?: any) => {
    return namespace?.[key] ?? (fallback || key)
  }
}
