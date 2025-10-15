import React, { PropsWithChildren, useState } from 'react'
import { ModalBase } from '../ModalBase/ModalBase'
import * as styles from './Filter.css'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { useSwipeable } from 'react-swipeable'
import { useLocale } from '@island.is/localization'
import { Box } from '../Box/Box'

interface FilterMobileDrawerProps {
  /** Explain what this drawer is for */
  ariaLabel: string
  /** Unique ID for accessibility purposes */
  baseId: string
  /** Element that opens the drawer. Receives a11y + event props from ModalBase. */
  disclosure: React.ReactElement
  /** Show immediately without clicking the disclosure button */
  initialVisibility?: boolean
  labelShowResult?: string
  labelClearAll?: string
  onFilterClear: () => void
}

export const FilterMobileDrawer = ({
  ariaLabel,
  baseId,
  disclosure,
  initialVisibility,
  labelShowResult,
  labelClearAll,
  onFilterClear,
  children,
}: PropsWithChildren<FilterMobileDrawerProps>) => {
  const [isClosed, setIsClosed] = useState(!(initialVisibility ?? false))
  const { lang } = useLocale()

  // Only the “grabber” area listens for swipe-down to close.
  const handlers = useSwipeable({
    onSwipedDown: () => setIsClosed(true),
    delta: 16, // a small threshold so tiny drags don't close
    trackMouse: true,
  })

  const isVisible = !isClosed

  return (
    <ModalBase
      preventBodyScroll
      disclosure={disclosure}
      baseId={baseId}
      modalLabel={ariaLabel}
      initialVisibility={initialVisibility}
      onVisibilityChange={(visibility) => setIsClosed(!visibility)}
      isVisible={isVisible}
      hideOnClickOutside
      removeOnClose={false}
      backdropDark
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box
          position="fixed"
          background="white"
          display="flex"
          flexDirection="column"
          className={styles.sheet}
          data-enter={isVisible ? '' : undefined}
        >
          {/* Grabber / drag handle */}
          <Box
            width="full"
            padding={2}
            onClick={closeModal}
            {...handlers}
            aria-hidden="true"
          >
            <span className={styles.grabberLine} />
          </Box>

          {/* Header (fixed within the sheet, no scroll) */}
          <Box
            className={styles.header}
            display="flex"
            alignItems="center"
            flexShrink={0}
            justifyContent="spaceBetween"
            paddingX={3}
            paddingY={2}
            position="sticky"
            top={0}
            background="white"
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

          {/* Scrollable content area */}
          <div className={styles.content} role="region" aria-label={ariaLabel}>
            {children}
          </div>

          {/* Sticky footer inside the sheet */}
          <Box
            className={styles.footer}
            position="sticky"
            bottom={0}
            left={0}
            right={0}
            background="white"
            paddingX={3}
            paddingY={2}
            flexShrink={0}
          >
            <Button fluid onClick={closeModal}>
              {labelShowResult ??
                (lang === 'is' ? 'Sýna niðurstöður' : 'Show results')}
            </Button>
          </Box>
        </Box>
      )}
    </ModalBase>
  )
}

export default FilterMobileDrawer
