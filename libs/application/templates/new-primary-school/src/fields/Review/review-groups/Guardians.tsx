import { YES } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getLanguageByCode } from '@island.is/shared/utils'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Guardians = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { guardians } = getApplicationAnswers(application.answers)

  return (
    <>
      {guardians.map((guardian, index) => (
        <ReviewGroup
          isEditable={editable}
          editAction={() => goToScreen?.('guardians')}
          key={index}
        >
          <Stack space={2}>
            <GridRow>
              <GridColumn span="12/12">
                <Text variant="h3" as="h3">
                  {formatMessage(newPrimarySchoolMessages.overview.guardians)}{' '}
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
                  value={guardian.fullName}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.nationalId,
                  )}
                  value={formatKennitala(guardian.nationalId)}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.shared.address)}
                  value={guardian.address.streetAddress}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.municipality,
                  )}
                  value={`${guardian.address.postalCode}, ${guardian.address.city}`}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.shared.email)}
                  value={guardian.email}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.phoneNumber,
                  )}
                  value={formatNumber(guardian.phoneNumber, 'International')}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.childrenNGuardians
                      .requiresInterpreter,
                  )}
                  value={formatMessage(
                    guardian.requiresInterpreter.includes(YES)
                      ? newPrimarySchoolMessages.shared.yes
                      : newPrimarySchoolMessages.shared.no,
                  )}
                />
              </GridColumn>
              {guardian.requiresInterpreter.includes(YES) && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.shared.language,
                    )}
                    value={
                      getLanguageByCode(guardian.preferredLanguage ?? '')?.name
                    }
                  />
                </GridColumn>
              )}
            </GridRow>
          </Stack>
        </ReviewGroup>
      ))}
    </>
  )
}
