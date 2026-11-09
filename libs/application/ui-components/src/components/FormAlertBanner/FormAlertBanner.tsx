import { createContext, FC, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import type { AlertBannerProps } from '@island.is/island-ui/core'

export const FormAlertBannerSlotContext = createContext<HTMLElement | null>(
  null,
)

interface Props extends Omit<AlertBannerProps, 'dismissable' | 'onDismiss'> {
  visible: boolean
}

export const FormAlertBanner: FC<Props> = ({ visible, ...bannerProps }) => {
  const [dismissed, setDismissed] = useState(false)
  const [bannerKey, setBannerKey] = useState(0)

  const slot = useContext(FormAlertBannerSlotContext)

  useEffect(() => {
    if (dismissed && !visible) {
      setDismissed(false)
      setBannerKey((key) => key + 1)
    }
  }, [dismissed, visible])

  if (!slot) {
    return null
  }

  return createPortal(
    <Box display={visible && !dismissed ? 'block' : 'none'}>
      <AlertBanner
        key={bannerKey}
        {...bannerProps}
        dismissable
        onDismiss={() => setDismissed(true)}
      />
    </Box>,
    slot,
  )
}
