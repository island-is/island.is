import { createContext, FC, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import type { AlertBannerProps } from '@island.is/island-ui/core'

export const FormAlertBannerSlotContext = createContext<HTMLElement | null>(
  null,
)

interface Props extends Omit<AlertBannerProps, 'dismissable' | 'onDismiss'> {
  visible: boolean
  showAgainKey?: string
}

export const FormAlertBanner: FC<Props> = ({
  visible,
  showAgainKey = '',
  ...bannerProps
}) => {
  const [dismissedKey, setDismissedKey] = useState<string | null>(null)
  const [dismissals, setDismissals] = useState(0)

  const slot = useContext(FormAlertBannerSlotContext)

  if (dismissedKey !== null && (!visible || dismissedKey !== showAgainKey)) {
    setDismissedKey(null)
  }

  if (!slot) {
    return null
  }

  return createPortal(
    <Box
      display={visible && dismissedKey === null ? 'block' : 'none'}
      role="alert"
    >
      <AlertBanner
        key={dismissals}
        {...bannerProps}
        dismissable
        onDismiss={() => {
          setDismissedKey(showAgainKey)
          setDismissals((count) => count + 1)
        }}
      />
    </Box>,
    slot,
  )
}
