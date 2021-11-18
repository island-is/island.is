import React from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { GridColumn, GridRow, Text, Box } from '@island.is/island-ui/core'

interface Props {
  title: MessageDescriptor | string
  intro?: MessageDescriptor
  img?: string
}

export const IntroHeader = ({ title, intro, img }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <GridRow marginBottom={7}>
      <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
        <Text variant="h3" as="h1" marginBottom={3}>
          {formatMessage(title)}
        </Text>
        {intro && <Text variant="default">{formatMessage(intro)}</Text>}
      </GridColumn>
      {img && (
        <GridColumn
          span={['8/8', '2/8']}
          offset={['0', '0', '1/8']}
          order={[1, 2]}
        >
          <Box textAlign={['center', 'right']} padding={[6, 0]}>
            <img src={img} alt="" />
          </Box>
        </GridColumn>
      )}
    </GridRow>
  )
}

export default IntroHeader
