import React from 'react'
import { MessageDescriptor } from 'react-intl'

import {
  Box,
  BoxProps,
  Button,
  GridColumn,
  GridRow,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export interface IntroHeaderProps {
  title: MessageDescriptor | string
  intro?: MessageDescriptor | string
  img?: string
  hideImgPrint?: boolean
  marginBottom?: BoxProps['marginBottom']
  children?: React.ReactNode
  onClick?: () => void
  buttonText?: MessageDescriptor | string
  buttonType?: 'button' | 'text'
}

export const IntroHeader = ({
  title,
  intro,
  img,
  hideImgPrint = false,
  marginBottom = 6,
  children,
  onClick,
  buttonText,
  buttonType = 'button',
}: IntroHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow marginBottom={marginBottom}>
      <GridColumn span={['8/8', '5/8']}>
        <Text variant="h3" as="h1">
          {formatMessage(title)}
        </Text>
        {intro && (
          <Text variant="default" paddingTop={2}>
            {formatMessage(intro)}
          </Text>
        )}
        {onClick && buttonText && (
          <Box paddingTop={2}>
            <Button
              variant={buttonType === 'button' ? 'utility' : 'text'}
              icon="download"
              iconType="outline"
              onClick={onClick}
            >
              {formatMessage(buttonText)}
            </Button>
          </Box>
        )}
      </GridColumn>
      {img && (
        <GridColumn span={['8/8', '3/8']}>
          <Hidden print={hideImgPrint} below="lg">
            <Box textAlign="center" padding={[6, 0]}>
              <img src={img} alt="" />
            </Box>
          </Hidden>
        </GridColumn>
      )}
      {children}
    </GridRow>
  )
}
