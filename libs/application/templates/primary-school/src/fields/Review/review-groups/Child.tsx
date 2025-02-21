import { coreErrorMessages, YES } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import { OptionsType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getGenderMessage,
  getSelectedOptionLabel,
} from '../../../lib/primarySchoolUtils'
import { ReviewGroupProps } from './props'

export const Child = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { childInfo } = getApplicationAnswers(application.answers)

  const {
    options: pronounOptions,
    loading,
    error,
  } = useFriggOptions(OptionsType.PRONOUN)

  const genderMessage = getGenderMessage(application)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('childInfo')}
    >
      <Stack space={2}>
        <GridRow>
          <GridColumn span="12/12">
            <Text variant="h3" as="h3">
              {formatMessage(primarySchoolMessages.overview.child)}
            </Text>
          </GridColumn>
        </GridRow>
        {childInfo.pronouns?.length > 0 && loading ? (
          <SkeletonLoader height={40} width="100%" borderRadius="large" />
        ) : (
          <>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(primarySchoolMessages.shared.fullName)}
                  value={childInfo.name}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(primarySchoolMessages.shared.nationalId)}
                  value={formatKennitala(childInfo.nationalId)}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(primarySchoolMessages.shared.address)}
                  value={childInfo.address.streetAddress}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    primarySchoolMessages.shared.municipality,
                  )}
                  value={`${childInfo.address.postalCode}, ${childInfo.address.city}`}
                />
              </GridColumn>
            </GridRow>
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(primarySchoolMessages.shared.gender)}
                  value={formatMessage(genderMessage)}
                />
              </GridColumn>
              {childInfo.usePronounAndPreferredName?.includes(YES) &&
                childInfo.preferredName?.trim().length > 0 && (
                  <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                    <DataValue
                      label={formatMessage(
                        primarySchoolMessages.childrenNGuardians
                          .childInfoPreferredName,
                      )}
                      value={childInfo.preferredName}
                    />
                  </GridColumn>
                )}
              {childInfo.usePronounAndPreferredName?.includes(YES) &&
                childInfo.pronouns?.length > 0 && (
                  <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                    <DataValue
                      label={formatMessage(
                        primarySchoolMessages.childrenNGuardians
                          .childInfoPronouns,
                      )}
                      value={childInfo.pronouns
                        .map((pronoun) =>
                          getSelectedOptionLabel(pronounOptions, pronoun),
                        )
                        .join(', ')}
                      error={
                        error
                          ? formatMessage(coreErrorMessages.failedDataProvider)
                          : undefined
                      }
                    />
                  </GridColumn>
                )}
              {childInfo.differentPlaceOfResidence === YES && (
                <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                  <DataValue
                    label={formatMessage(
                      primarySchoolMessages.childrenNGuardians
                        .childInfoPlaceOfResidence,
                    )}
                    value={`${childInfo.placeOfResidence?.streetAddress}, ${childInfo.placeOfResidence?.postalCode}`}
                  />
                </GridColumn>
              )}
            </GridRow>
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
