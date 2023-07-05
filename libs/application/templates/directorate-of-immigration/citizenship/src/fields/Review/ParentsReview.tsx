import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'

export const ParentsReview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as Citizenship

  return (
    <Box paddingBottom={4} paddingTop={4}>
      <DescriptionText
        text={review.labels.parents}
        textProps={{
          as: 'h4',
          fontWeight: 'semiBold',
          marginBottom: 0,
        }}
      />
      <GridRow>
        {answers?.parentInformation?.parents &&
          answers?.parentInformation?.parents?.length > 0 &&
          answers?.parentInformation?.parents?.map((parent) => {
            if (parent.wasRemoved === 'false') {
              return (
                <GridColumn span="1/2">
                  <Text>{parent.name}</Text>
                </GridColumn>
              )
            } else return
          })}
      </GridRow>
    </Box>
  )
}
