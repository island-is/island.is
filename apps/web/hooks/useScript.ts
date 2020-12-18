import { useEffect } from 'react'

export const useScript = (url: string, async: boolean, id: string) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.src = url
    script.async = async
    if (id) {
      script.id = id
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url, async, id])
}
