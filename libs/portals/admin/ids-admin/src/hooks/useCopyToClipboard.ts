import { RefObject, useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../lib/messages'

export const useCopyToClipboard = () => {
  const { formatMessage } = useLocale()

  const copyToClipboard = useCallback(
    (ref: RefObject<HTMLInputElement>) => {
      if (!ref.current) return

      navigator.clipboard.writeText(ref.current.value).then(() => {
        toast.success(formatMessage(m.copySuccess))
      })
    },
    [formatMessage],
  )

  return { copyToClipboard }
}
