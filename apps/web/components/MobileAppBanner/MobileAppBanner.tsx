import React, { useEffect, useState } from 'react'

import { Box, Text, Button, Logo, Icon, Link } from '@island.is/island-ui/core'
import * as style from './MobileAppBanner.css'
import Cookies from 'js-cookie'
import { useNamespace } from '@island.is/web/hooks'

interface MobileAppBannerProps {
  namespace: Record<string, string | string[]>
}

export const MobileAppBanner = ({ namespace }: MobileAppBannerProps) => {
  const COOKIE_NAME = 'island-mobile-app-banner'

  const n = useNamespace(namespace)

  const appleLink = n('mobileAppLinkApple')
  const androidLink = n('mobileAppLinkAndroid')

  const [hidden, setHidden] = useState<boolean>(
    !!Cookies.get(COOKIE_NAME) || !appleLink || !androidLink,
  )
  const [isApple, setIsApple] = useState<boolean>(false)

  const getMobilePlatform = (): string => {
    if (typeof navigator === 'undefined') {
      return ''
    }
    const userAgent = navigator.userAgent || navigator.vendor
    return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
      ? 'apple'
      : 'android'
  }

  useEffect(() => {
    setIsApple(getMobilePlatform() === 'apple')
  }, [])

  return hidden ? null : (
    <Box
      background="blue400"
      display="flex"
      className={style.container}
      alignItems={'center'}
      data-test-id={'mobile-app-banner'}
    >
      <button
        className={style.closeBtn}
        onClick={() => {
          Cookies.set(COOKIE_NAME, 'hide', {
            expires: 365,
          })
          setHidden(true)
        }}
      >
        <Icon icon="close" color="white" type="outline" />
      </button>
      <Box
        display="flex"
        padding={1}
        background="white"
        marginLeft={2}
        marginRight={2}
        borderRadius="large"
      >
        <Logo iconOnly={true} height={24} width={24} />
      </Box>
      <Box flexGrow={1}>
        <Text color="white" variant="h5">
          {n('mobileAppTitle', 'Ísland.is appið')}
        </Text>
        <Text color="white" variant="small">
          {n('mobileAppSubtitle', 'Með ríkið í vasanum')}
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        flexGrow={1}
        className={style.buttonWrapper}
      >
        <Link href={isApple ? appleLink : androidLink} newTab skipTab>
          <Button variant="ghost" icon="open" iconType="outline">
            {n('mobileAppDownload', 'Sækja')}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
