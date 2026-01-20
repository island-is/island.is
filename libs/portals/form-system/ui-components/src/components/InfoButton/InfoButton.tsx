import { useQuery } from '@apollo/client'
import { SupportQna } from '@island.is/api/schema'
import { GET_QNA } from '@island.is/form-system/graphql'
import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import * as styles from './InfoButton.css'
import { CloseButton } from './components/CloseButton'
import { Notifications } from './components/Notification'

export const InfoButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [supportQNAs, setSupportQNAs] = useState<SupportQna[]>([])
  const { lang } = useLocale()
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const flyoutRef = useRef<HTMLDivElement | null>(null)

  const { width, height } = useWindowSize()

  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const { formatMessage } = useLocale()

  const isMobile = width < theme.breakpoints.md

  const flyoutWidth = 360
  const viewportPadding = 12

  const updatePosition = () => {
    const buttonEl = buttonRef.current
    if (!buttonEl) return

    const rect = buttonEl.getBoundingClientRect()

    const top = Math.max(rect.top, viewportPadding)

    const desiredLeft = rect.right - flyoutWidth
    const left = Math.max(
      viewportPadding,
      Math.min(desiredLeft, window.innerWidth - flyoutWidth - viewportPadding),
    )

    setPos({ top, left })
  }

  useQuery(GET_QNA, {
    variables: {
      input: {
        lang: lang,
        slug: 'umsoknarsmidur',
      },
    },
    onCompleted(data) {
      if (data?.getSupportQNAsInCategory) {
        setSupportQNAs(data.getSupportQNAsInCategory)
      }
    },
  })

  useLayoutEffect(() => {
    if (!isVisible) return
    updatePosition()
    requestAnimationFrame(() => updatePosition())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, width, height])

  useEffect(() => {
    if (!isVisible) return

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node

      const flyoutEl = flyoutRef.current
      const buttonEl = buttonRef.current

      if (flyoutEl?.contains(target)) return
      if (buttonEl?.contains(target)) return

      setIsVisible(false)
    }

    document.addEventListener('mousedown', onMouseDown, true)

    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
    }
  }, [isVisible])

  const flyoutMaxHeight = pos
    ? Math.max(240, height - pos.top - viewportPadding)
    : undefined

  const content = (
    <Box
      background="white"
      borderRadius="large"
      display="flex"
      flexDirection="column"
      height={isMobile ? 'full' : undefined}
      className={cn(styles.container)}
      style={{
        maxHeight:
          !isMobile && flyoutMaxHeight ? `${flyoutMaxHeight}px` : undefined,
      }}
    >
      <Box className={cn(styles.wrapper)}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginTop={2}
          marginRight={2}
          padding={2}
          className={cn(styles.stickyHeader)}
        >
          <Box
            borderRadius="full"
            background="blue100"
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={cn(styles.overviewIcon)}
            marginRight="p2"
          >
            <Icon
              icon="notifications"
              type="outline"
              color="blue400"
              size="small"
            />
          </Box>
          <Text variant="h4">{formatMessage(m.notifications)}</Text>
        </Box>

        <Box paddingX={2} paddingBottom={2}>
          <Notifications
            notifications={supportQNAs.map((qna) => {
              return {
                title: qna.title,
                description: qna.subCategory?.description || '',
              }
            })}
          />
        </Box>
      </Box>

      <Hidden below="md">
        <Box position="absolute" top={0} right={0}>
          <CloseButton onClick={() => setIsVisible(false)} aria-label="Close" />
        </Box>
      </Hidden>
    </Box>
  )

  return (
    <>
      <Button
        ref={buttonRef}
        variant="utility"
        size="small"
        onClick={() => {
          setIsVisible((v) => !v)
          updatePosition()
        }}
      >
        <Icon icon="notifications" type="outline" color="blue400" />
      </Button>

      <ModalBase
        baseId="info-button-modal"
        isVisible={isVisible}
        hideOnClickOutside={false}
        hideOnEsc={true}
        modalLabel="Tilkynningar"
        removeOnClose={true}
        preventBodyScroll={false}
        onVisibilityChange={(visibility: boolean) => {
          if (visibility !== isVisible) setIsVisible(visibility)
        }}
        className={styles.flyoutDialog}
      >
        <GridContainer>
          <Box
            ref={flyoutRef}
            style={
              pos
                ? {
                    position: 'fixed',
                    top: `${pos.top}px`,
                    left: `${pos.left}px`,
                    width: isMobile ? '100%' : `${flyoutWidth}px`,
                    zIndex: 9999,
                  }
                : undefined
            }
          >
            {content}
          </Box>
        </GridContainer>
      </ModalBase>
    </>
  )
}
