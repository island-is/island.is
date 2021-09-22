import React from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import {
  GridColumn,
  GridRow,
  Text,
  Box,
  Hidden,
} from '@island.is/island-ui/core'

interface Props {
  title: MessageDescriptor | string
  intro?: MessageDescriptor
  img?: string
  hideImgPrint?: boolean
}

export const IntroHeader = ({
  title,
  intro,
  img,
  hideImgPrint = false,
}: Props) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow marginBottom={7}>
      <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
        <Text variant="h1" as="h1" marginBottom={3}>
          {formatMessage(title)}
        </Text>
        {intro && <Text variant="intro">{formatMessage(intro)}</Text>}
      </GridColumn>
      {img && (
        <GridColumn
          span={['8/8', '2/8']}
          offset={['0', '0', '1/8']}
          order={[1, 2]}
        >
          <Hidden print={hideImgPrint}>
            <Box textAlign={['center', 'right']} padding={[6, 0]}>
              <img src={img} alt="" />
            </Box>
          </Hidden>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default IntroHeader
