const ns = {
  fields: {},
}

export function useNamespace(namespace = ns) {
  let n = namespace

  if (namespace?.fields && typeof namespace.fields === 'string') {
    n = JSON.parse(namespace.fields)
  }

  return (key: string, fallback?: string) => {
    return n?.fields?.[key] ?? (fallback || key)
  }
}

export default useNamespace
