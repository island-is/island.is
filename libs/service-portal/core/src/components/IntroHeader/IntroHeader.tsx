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
import { ModuleAlertBannerSection } from '../AlertMessage/ModuleAlertMessageSection'

interface Props {
  title: MessageDescriptor | string
  intro?: MessageDescriptor | string
  img?: string
  hideImgPrint?: boolean
  marginBottom?: BoxProps['marginBottom']
}

export const IntroHeader = ({
  title,
  intro,
  img,
  hideImgPrint = false,
  marginBottom = 6,
}: Props) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow marginBottom={marginBottom}>
      <GridColumn span={['8/8', '5/8']} order={1}>
        <Text variant="h3" as="h1">
          {formatMessage(title)}
        </Text>
        {intro && (
          <Text variant="default" paddingTop={2}>
            {formatMessage(intro)}
          </Text>
        )}
      </GridColumn>
      {img && (
        <GridColumn span={['8/8', '3/8']} order={2}>
          <Hidden print={hideImgPrint} below="lg">
            <Box textAlign="center" padding={[6, 0]}>
              <img src={img} alt="" />
            </Box>
          </Hidden>
        </GridColumn>
      )}
      <GridColumn span={['12/12', '12/12', '6/8']} order={3} paddingTop={4}>
        <ModuleAlertBannerSection />
      </GridColumn>
    </GridRow>
  )
}

export default IntroHeader
