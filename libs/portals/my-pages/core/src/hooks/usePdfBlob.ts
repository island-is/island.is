import { useEffect, useState } from 'react'
import { createBffUrlGenerator } from '@island.is/react-spa/bff'

export const usePdfBlob = (url: string | null | undefined) => {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!url) {
      setData(null)
      setError(null)
      return
    }

    const controller = new AbortController()
    let objectUrl: string | null = null

    setLoading(true)
    setError(null)
    setData(null)

    const bffUrl = createBffUrlGenerator()('/api', { url })

    fetch(bffUrl, { method: 'POST', credentials: 'include', signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        setData(objectUrl)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => setLoading(false))

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url])

  return { data, loading, error }
}
