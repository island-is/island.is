import React from 'react'
import { MessageDescriptor } from 'react-intl'

import {
  Box,
  BoxProps,
  GridColumn,
  GridRow,
  Hidden,
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
  buttonGroup?: React.ReactNode
  isSubheading?: boolean
}

export const IntroHeader = ({
  title,
  intro,
  img,
  buttonGroup,
  hideImgPrint = false,
  marginBottom = 6,
  children,
  isSubheading = false,
}: IntroHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow marginBottom={marginBottom}>
      <GridColumn span={['8/8', '5/8']}>
        <Text variant={isSubheading ? 'h5' : 'h3'} as="h1">
          {formatMessage(title)}
        </Text>
        {intro && (
          <Text variant="default" paddingTop={2}>
            {formatMessage(intro)}
          </Text>
        )}
        {buttonGroup && buttonGroup}
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
