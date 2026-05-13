import { useEffect, useRef, useState, type FC } from 'react'
import type { ApplicationTypes } from '@island.is/application/types'
import { getApplicationUIFields } from '@island.is/application/template-loader'

type CustomFieldMap = Record<string, FC<any>>

export function useTemplateCustomFields(typeId: string | undefined) {
  const [fields, setFields] = useState<CustomFieldMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const loadedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!typeId || loadedRef.current === typeId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    getApplicationUIFields(typeId as ApplicationTypes)
      .then((uiFields) => {
        if (cancelled) return
        console.log(
          '[useTemplateCustomFields] Loaded fields for',
          typeId,
          Object.keys(uiFields),
        )
        setFields(uiFields as CustomFieldMap)
        loadedRef.current = typeId
      })
      .catch((err) => {
        if (cancelled) return
        console.warn(
          `[useTemplateCustomFields] Failed to load fields for ${typeId}`,
          err,
        )
        setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [typeId])

  return { customFields: fields, loading, error }
}
