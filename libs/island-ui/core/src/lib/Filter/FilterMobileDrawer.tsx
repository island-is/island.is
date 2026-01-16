import * as React from 'react'
import { Dialog, DialogDisclosure, useDialogStore } from '@ariakit/react'
import * as styles from './Filter.css'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { useLocale } from '@island.is/localization'
import { useSwipeable } from 'react-swipeable'

type Props = {
  ariaLabel: string
  disclosure: React.ReactElement
  initialVisibility?: boolean
  labelShowResult?: string
  labelClearAll?: string
  onFilterClear: () => void
  topGap?: number
  children: React.ReactNode
}

export const FilterDrawerAriakit = ({
  ariaLabel,
  disclosure,
  initialVisibility,
  labelShowResult,
  labelClearAll,
  onFilterClear,
  topGap = 100,
  children,
}: Props) => {
  const { lang } = useLocale()
  const store = useDialogStore({
    defaultOpen: !!initialVisibility,
    animated: true,
  })
  const open = store.getState().open
  // Only the “grabber” area listens for swipe-down to close.
  const handlers = useSwipeable({
    onSwipedDown: () => store.setOpen(false),
    delta: 16, // a small threshold so tiny drags don't close
    trackMouse: true,
    preventScrollOnSwipe: false,
    touchEventOptions: { passive: true },
  })
  const trigger = (
    <DialogDisclosure
      store={store}
      render={(props) =>
        React.cloneElement(disclosure, {
          ...props,
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          onClick: (e: React.MouseEvent) => {
            disclosure.props?.onClick?.(e)
            props.onClick?.(e)
          },
        })
      }
    />
  )

  const close = () => store.hide()

  return (
    <>
      {trigger}

      <Dialog
        store={store}
        aria-label={ariaLabel}
        backdrop={<div className={styles.backdrop} />}
        className={styles.sheet}
      >
        {/* grabber */}
        <Box
          width="full"
          padding={2}
          className={styles.grabber}
          aria-hidden="true"
          onClick={close}
          {...handlers}
        >
          <span className={styles.grabberLine} />
        </Box>

        {/* sticky header */}
        <Box
          className={styles.header}
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingX={3}
          paddingY={2}
        >
          <Text variant="h4" as="h3">
            {lang === 'is' ? 'Sía eftir' : 'Filter by'}
          </Text>
          <Button
            icon="reload"
            size="small"
            variant="text"
            onClick={onFilterClear}
          >
            {labelClearAll ?? (lang === 'is' ? 'Hreinsa allt' : 'Clear all')}
          </Button>
        </Box>

        {/* scrollable area */}
        <div className={styles.content} role="region" aria-label={ariaLabel}>
          {children}
        </div>

        {/* sticky footer */}
        <Box className={styles.footer} paddingX={3} paddingY={2}>
          <Button fluid onClick={close}>
            {labelShowResult ??
              (lang === 'is' ? 'Sýna niðurstöður' : 'Show results')}
          </Button>
        </Box>
      </Dialog>
    </>
  )
}
