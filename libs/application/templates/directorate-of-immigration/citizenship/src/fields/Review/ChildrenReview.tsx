import { ApplicantChildCustodyInformation } from '@island.is/application/types'
import { personal, review, selectChildren } from '../../lib/messages'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import DescriptionText from '../../components/DescriptionText'
import { useLocale } from '@island.is/localization'

interface ChildrenReviewProps {
  selectedChildren: Array<ApplicantChildCustodyInformation> | undefined
}

export const ChildrenReview = ({ selectedChildren }: ChildrenReviewProps) => {
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
      {selectedChildren &&
        selectedChildren.map((child) => {
          return (
            <GridRow>
              <GridColumn span="1/2">
                <Text>{child.fullName}</Text>
                <Text>
                  {`${selectChildren.checkboxes.subLabel}: ${child.otherParent?.fullName}`}
                </Text>
              </GridColumn>
              <GridColumn span="1/2">
                <Text>
                  {`${formatMessage(
                    personal.labels.userInformation.citizenship,
                  )}: ${child.citizenship?.name}`}
                </Text>
              </GridColumn>
            </GridRow>
          )
        })}
    </Box>
  )
}
