import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ModalBase } from '../ModalBase/ModalBase'
import * as styles from './Filter.css'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { useSwipeable } from 'react-swipeable'
import { useLocale } from '@island.is/localization'
import { usePreventBodyScroll } from './usePreventBodyScroll'

interface FilterMobileDrawerProps {
  /**
   * Explain what this drawer is for
   */
  ariaLabel: string
  /**
   * Unique ID for accessibility purposes
   */
  baseId: string
  /**
   * Element that opens the drawer.
   * It will be forwarded neccessery props for a11y and event handling.
   */
  disclosure: React.ReactElement
  /**
   * Show immediately without clicking the disclosure button
   */
  initialVisibility?: boolean | undefined

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
  const [isClosed, setIsClosed] = useState(true)
  usePreventBodyScroll(!isClosed)
  const { lang } = useLocale()

  const handlers = useSwipeable({
    onSwipedDown: () => {
      setIsClosed(true)
    },
  })

  return (
    <ModalBase
      preventBodyScroll
      disclosure={disclosure}
      baseId={baseId}
      modalLabel={ariaLabel}
      initialVisibility={initialVisibility}
      className={styles.drawer}
      onVisibilityChange={(visibility) => {
        setIsClosed(!visibility)
      }}
      isVisible={!isClosed}
      hideOnClickOutside
    >
      {({ closeModal }: { closeModal: () => void }) => {
        return (
          <div className={styles.mobileDrawerContainer}>
            <Box background="white" paddingX={0} borderRadius="lg">
              <Box width="full" padding={2} onClick={closeModal} {...handlers}>
                <Box className={styles.drawerLine} margin={3} />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                position="relative"
                className={styles.mobileInnerContainer}
              >
                <Box
                  display="flex"
                  paddingX={3}
                  paddingY={2}
                  justifyContent={'spaceBetween'}
                  flexShrink={0}
                  className={styles.topBar}
                >
                  <Box>
                    <Text variant="h4" as="h3">
                      {lang === 'is' ? 'Sía eftir' : 'Filter by'}
                    </Text>
                  </Box>

                  <Button
                    icon="reload"
                    size="small"
                    variant="text"
                    onClick={onFilterClear}
                  >
                    {labelClearAll ??
                      (lang === 'is' ? 'Hreinsa allt' : 'Clear all')}
                  </Button>
                </Box>
                <Box flexGrow={1} className={styles.overflow}>
                  {children}
                </Box>

                <Box
                  paddingY={2}
                  paddingX={3}
                  width="full"
                  flexShrink={0}
                  position="sticky"
                  bottom={0}
                  background="white"
                  className={styles.showResultsButton}
                >
                  <Button fluid onClick={closeModal}>
                    {labelShowResult ??
                      (lang === 'is' ? 'Sýna niðurstöður' : 'Show results')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        )
      }}
    </ModalBase>
  )
}

export default FilterMobileDrawer
