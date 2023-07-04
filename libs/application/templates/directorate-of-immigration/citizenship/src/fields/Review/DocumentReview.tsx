import {
  ApplicantChildCustodyInformation,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { FC } from 'react'
import DescriptionText from '../../components/DescriptionText'
import { review } from '../../lib/messages'
import { Citizenship } from '../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../utils/childrenInfo'

export const DocumentReview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as Citizenship

  const selectedChildren = getSelectedCustodyChildren(
    application.externalData,
    application.answers,
  )

  return (
    <Box paddingBottom={4} paddingTop={4}>
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
                  format={{ name: child.fullName }}
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
  )
}
