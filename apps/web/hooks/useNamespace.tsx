import { NamespaceType } from '../context'

export function useNamespace(namespace: NamespaceType = {}) {
  return (key: string, fallback?: any) => {
    return namespace?.[key] ?? (fallback || key)
  }
}
