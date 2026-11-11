import { createContext, FC, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import type { AlertBannerProps } from '@island.is/island-ui/core'

export const FormAlertBannerSlotContext = createContext<HTMLElement | null>(
  null,
)

interface Props extends Omit<AlertBannerProps, 'dismissable' | 'onDismiss'> {
  visible: boolean
  showAgainKeys?: string[]
}

export const FormAlertBanner: FC<Props> = ({
  visible,
  showAgainKeys = [],
  ...bannerProps
}) => {
  const [dismissedKeys, setDismissedKeys] = useState<string[] | null>(null)

  const slot = useContext(FormAlertBannerSlotContext)

  if (dismissedKeys !== null) {
    const stillShown = dismissedKeys.filter((key) =>
      showAgainKeys.includes(key),
    )
    if (!visible || stillShown.length !== dismissedKeys.length) {
      setDismissedKeys(visible && stillShown.length > 0 ? stillShown : null)
    }
  }

  const dismissed =
    dismissedKeys !== null &&
    showAgainKeys.every((key) => dismissedKeys.includes(key))

  if (!slot) {
    return null
  }

  return createPortal(
    <Box display={visible && !dismissed ? 'block' : 'none'} role="alert">
      <AlertBanner
        key={String(dismissed)}
        {...bannerProps}
        dismissable
        onDismiss={() => setDismissedKeys(showAgainKeys)}
      />
    </Box>,
    slot,
  )
}
