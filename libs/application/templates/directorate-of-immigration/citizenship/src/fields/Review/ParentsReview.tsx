import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const ParentsReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
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
            answers?.parentInformation?.parents?.map((parent) => {
              if (parent.wasRemoved === 'false') {
                return (
                  <GridColumn span="1/2">
                    <Text>
                      {parent.givenName} {parent.familyName}
                    </Text>
                  </GridColumn>
                )
              } else return null
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
