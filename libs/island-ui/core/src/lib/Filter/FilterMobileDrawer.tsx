import React, { PropsWithChildren, useState } from 'react'
import { ModalBase } from '../ModalBase/ModalBase'
import * as styles from './Filter.css'
import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import cn from 'classnames'

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

  labelShowResult: string

  labelClearAll: string

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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const onTouchMove = (e: React.TouchEvent<HTMLElement>) =>
    setTouchEnd(e.targetTouches[0].clientY)

  const onTouchEnd = (closeModal: () => void) => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isDownSwipe = distance < -minSwipeDistance
    if (isDownSwipe) {
      closeModal()
    }
  }

  return (
    <ModalBase
      disclosure={disclosure}
      baseId={baseId}
      modalLabel={ariaLabel}
      initialVisibility={initialVisibility}
      className={cn(styles.drawer, styles.position)}
      onVisibilityChange={(visibility) => {
        setIsClosed(!visibility)
      }}
      isVisible={!isClosed}
      hideOnClickOutside
    >
      {({ closeModal }: { closeModal: () => void }) => {
        return (
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
              onTouchStart={(e) => onTouchStart(e)}
              onTouchMove={(e) => onTouchMove(e)}
              onTouchEnd={() => onTouchEnd(closeModal)}
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
                justifyContent={title ? 'spaceBetween' : 'flexEnd'}
                flexShrink={0}
              >
                {title && (
                  <Box>
                    <Text variant="h4" as="p">
                      {title}
                    </Text>
                  </Box>
                )}
                <Button
                  icon="reload"
                  size="small"
                  variant="text"
                  onClick={onFilterClear}
                >
                  {labelClearAll}
                </Button>
              </Box>
              <Box flexGrow={1} overflow="auto">
                {children}
              </Box>
              {labelShowResult && (
                <Box padding={3} width="full" flexShrink={0}>
                  <Button fluid onClick={closeModal}>
                    {labelShowResult}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )
      }}
    </ModalBase>
  )
}

export default FilterMobileDrawer
