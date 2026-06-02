import { useEffect, useState } from 'react'
import { createBffUrlGenerator } from '@island.is/react-spa/bff'

interface PdfBlobState {
  blob: Blob | null
  dataUrl: string | null
  loading: boolean
  error: Error | null
}

const idle: PdfBlobState = {
  blob: null,
  dataUrl: null,
  loading: false,
  error: null,
}

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

export const usePdfBlob = (url: string | null | undefined) => {
  const [state, setState] = useState<PdfBlobState>(idle)

  useEffect(() => {
    if (!url) {
      setState(idle)
      return
    }

    const controller = new AbortController()
    let cancelled = false

    setState({ blob: null, dataUrl: null, loading: true, error: null })

    const bffUrl = createBffUrlGenerator()('/api', { url })

    fetch(bffUrl, {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => {
        if (res.status === 404) return null
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        if (!blob) {
          if (!cancelled) setState(idle)
          return
        }
        return blobToDataUrl(blob).then((dataUrl) => ({ blob, dataUrl }))
      })
      .then((result) => {
        if (!cancelled && result) {
          setState({
            blob: result.blob,
            dataUrl: result.dataUrl,
            loading: false,
            error: null,
          })
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        if (!cancelled) {
          setState({
            blob: null,
            dataUrl: null,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          })
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [url])

  return state
}
