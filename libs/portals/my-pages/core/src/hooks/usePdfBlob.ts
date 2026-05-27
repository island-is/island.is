import { useEffect, useState } from 'react'
import { createBffUrlGenerator } from '@island.is/react-spa/bff'

interface PdfBlobState {
  data: string | null
  loading: boolean
  error: Error | null
}

const idle: PdfBlobState = { data: null, loading: false, error: null }

export const usePdfBlob = (url: string | null | undefined) => {
  const [state, setState] = useState<PdfBlobState>(idle)

  useEffect(() => {
    if (!url) {
      setState(idle)
      return
    }

    const controller = new AbortController()
    let objectUrl: string | null = null

    setState({ data: null, loading: true, error: null })

    const bffUrl = createBffUrlGenerator()('/api', { url })

    fetch(bffUrl, {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        setState({ data: objectUrl, loading: false, error: null })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        })
      })

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url])

  return state
}
