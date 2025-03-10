import React, { PropsWithChildren, useState } from 'react'
import { ModalBase } from '../ModalBase/ModalBase'
import * as styles from './Filter.css'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { useSwipeable } from 'react-swipeable'
import { useLocale } from '@island.is/localization'

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

  title?: string

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
  title,
  children,
}: PropsWithChildren<FilterMobileDrawerProps>) => {
  const [isClosed, setIsClosed] = useState(true)

  const { lang } = useLocale()

  const handlers = useSwipeable({
    onSwiping: (swipe) => {
      if (swipe.dir === 'Down') setIsClosed(true)
    },
    preventScrollOnSwipe: true,
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
          <div {...handlers}>
            <Box
              background="white"
              paddingTop={2}
              paddingX={0}
              height="full"
              className={styles.mobileDrawerContainer}
            >
              <Box
                background="dark200"
                className={styles.drawerLine}
                margin={3}
                onClick={closeModal}
              />
              <Box
                display="flex"
                flexDirection="column"
                height="full"
                position="relative"
                className={styles.mobileInnerContainer}
              >
                <Box
                  display="flex"
                  paddingX={3}
                  paddingY={2}
                  justifyContent={'spaceBetween'}
                  flexShrink={0}
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
                    {labelClearAll ?? lang === 'is'
                      ? 'Hreinsa allt'
                      : 'Clear all'}
                  </Button>
                </Box>
                <Box flexGrow={1} overflow="auto">
                  {children}
                </Box>

                <Box paddingY={2} paddingX={3} width="full" flexShrink={0}>
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
