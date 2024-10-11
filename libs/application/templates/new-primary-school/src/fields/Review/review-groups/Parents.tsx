import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Parents = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { parents } = getApplicationAnswers(application.answers)

  return (
    <>
      {Object.values(parents).map((parent, index) => (
        <ReviewGroup
          isEditable={editable}
          editAction={() => goToScreen?.('parents')}
          key={index}
        >
          <Stack space={2}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
                <Text variant="h3" as="h3">
                  {formatMessage(newPrimarySchoolMessages.overview.parents)}{' '}
                  {index + 1}
                </Text>
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.fullName,
                  )}
                  value={parent.fullName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.nationalId,
                  )}
                  value={formatKennitala(parent.nationalId)}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.shared.address)}
                  value={parent.address.streetAddress}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.municipality,
                  )}
                  value={`${parent.address.postalCode}, ${parent.address.city}`}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.shared.email)}
                  value={parent.email}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.phoneNumber,
                  )}
                  value={formatNumber(parent.phoneNumber, 'International')}
                />
              </GridColumn>
            </GridRow>
          </Stack>
        </ReviewGroup>
      ))}
    </>
  )
}
