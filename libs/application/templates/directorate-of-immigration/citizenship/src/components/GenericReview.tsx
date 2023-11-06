import SummaryBlock from './SummaryBlock'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import DescriptionText from './DescriptionText'
import { Routes } from '../lib/constants'
import { MessageDescriptor } from 'react-intl'

interface GenericReviewProps {
  leftColumnItems: Array<string>
  rightColumnItems: Array<string>
  leftDescription: MessageDescriptor
  goToScreen?: (id: string) => void
  route: Routes
}

export const GenericReview = ({
  leftColumnItems,
  rightColumnItems,
  leftDescription,
  goToScreen,
  route,
}: GenericReviewProps) => {
  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <DescriptionText
          text={leftDescription}
          textProps={{
            as: 'h4',
            fontWeight: 'semiBold',
            marginBottom: 0,
          }}
        />
        <GridRow>
          <GridColumn span="1/2">
            {leftColumnItems.map((item) => {
              return <Text>{item}</Text>
            })}
          </GridColumn>
          <GridColumn span="1/2">
            {rightColumnItems.map((item) => {
              return <Text>{item}</Text>
            })}
          </GridColumn>
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
