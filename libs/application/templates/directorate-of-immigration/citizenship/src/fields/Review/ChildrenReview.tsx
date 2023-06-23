import {
  ApplicantChildCustodyInformation,
  FieldBaseProps,
} from '@island.is/application/types'
import { FC } from 'react'
import { personal, review, selectChildren } from '../../lib/messages'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import DescriptionText from '../../components/DescriptionText'
import { Citizenship } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'

export const ChildrenReview: FC<FieldBaseProps> = ({ application }) => {
  const answers = application.answers as Citizenship
  const { formatMessage } = useLocale()
  return (
    <Box paddingBottom={4} paddingTop={4}>
      <DescriptionText
        text={review.labels.children}
        textProps={{
          as: 'h4',
          fontWeight: 'semiBold',
          marginBottom: 0,
        }}
      />
      {answers?.selectedChildren &&
        answers?.selectedChildren?.length > 0 &&
        answers?.selectedChildren?.map((child) => {
          const childWithInfo = (getValueViaPath(
            application.externalData,
            'childrenCustodyInformation.data',
            [],
          ) as ApplicantChildCustodyInformation[]).find(
            (x) => x.nationalId === child,
          )
          return (
            <GridRow>
              <GridColumn span="1/2">
                <Text>{childWithInfo?.fullName}</Text>
                <Text>
                  {`${selectChildren.checkboxes.subLabel}: ${childWithInfo?.otherParent?.fullName}`}
                </Text>
              </GridColumn>
              <GridColumn span="1/2">
                <Text>
                  {`${formatMessage(
                    personal.labels.userInformation.citizenship,
                  )}: ${childWithInfo?.citizenship?.name}`}
                </Text>
              </GridColumn>
            </GridRow>
          )
        })}
    </Box>
  )
}
