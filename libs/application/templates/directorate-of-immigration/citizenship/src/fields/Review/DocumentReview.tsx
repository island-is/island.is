import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../utils/childrenInfo'
import { Routes } from '../../lib/constants'
import SummaryBlock from '../../components/SummaryBlock'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  route: Routes
}

export const DocumentReview: FC<Props> = ({
  application,
  goToScreen,
  route,
}) => {
  const answers = application.answers as Citizenship

  const selectedChildren = getSelectedCustodyChildren(
    application.externalData,
    application.answers,
  )

  return (
    <SummaryBlock editAction={() => goToScreen?.(route)}>
      <Box paddingBottom={4}>
        <GridRow>
          <GridColumn span="1/2">
            <DescriptionText
              text={review.labels.documents}
              format={{ name: answers?.userInformation?.name }}
              textProps={{
                as: 'h4',
                fontWeight: 'semiBold',
                marginBottom: 0,
              }}
            />
          </GridColumn>
          {selectedChildren &&
            selectedChildren.length > 0 &&
            selectedChildren.map((child) => {
              return (
                <GridColumn span="1/2">
                  <DescriptionText
                    text={review.labels.documents}
                    format={{ name: `${child.givenName} ${child.familyName}` }}
                    textProps={{
                      as: 'h4',
                      fontWeight: 'semiBold',
                      marginBottom: 0,
                    }}
                  />
                </GridColumn>
              )
            })}
        </GridRow>
      </Box>
    </SummaryBlock>
  )
}
