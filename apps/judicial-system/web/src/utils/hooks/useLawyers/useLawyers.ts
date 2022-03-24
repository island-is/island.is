import { useState, useEffect } from 'react'
import useSWR from 'swr'

import { toast } from '@island.is/island-ui/core'
import type { Lawyer } from '@island.is/judicial-system-web/src/types'

const useLawyers = (): Lawyer[] => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { data, error } = useSWR<Lawyer[]>(
    mounted ? '/api/lawyers' : null,
    (url: string) => fetch(url).then((res) => res.json()),
  )

  if (error) {
    toast.error('Failed to get lawyers')
    return []
  }

  return data || []
}

export default useLawyers
