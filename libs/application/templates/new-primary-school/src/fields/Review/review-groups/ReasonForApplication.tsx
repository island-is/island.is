import { coreErrorMessages } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import {
  OptionsType,
  ReasonForApplicationOptions,
} from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectedOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const ReasonForApplication = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    reasonForApplication,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
  } = getApplicationAnswers(application.answers)

  const {
    options: relationFriggOptions,
    loading,
    error,
  } = useFriggOptions(OptionsType.REASON)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('reasonForApplication')}
      isLast
    >
      {loading ? (
        <SkeletonLoader height={40} width="80%" borderRadius="large" />
      ) : (
        <Stack space={2}>
          <GridRow>
            <GridColumn span="12/12">
              <DataValue
                label={formatMessage(
                  newPrimarySchoolMessages.primarySchool
                    .reasonForApplicationSubSectionTitle,
                )}
                value={
                  getSelectedOptionLabel(
                    relationFriggOptions,
                    reasonForApplication,
                  ) || ''
                }
                error={
                  error
                    ? formatMessage(coreErrorMessages.failedDataProvider)
                    : undefined
                }
              />
            </GridColumn>
          </GridRow>
          {reasonForApplication ===
            ReasonForApplicationOptions.MOVING_MUNICIPALITY && (
            <GridRow rowGap={2}>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(newPrimarySchoolMessages.shared.address)}
                  value={reasonForApplicationStreetAddress}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
                <DataValue
                  label={formatMessage(
                    newPrimarySchoolMessages.shared.postalCode,
                  )}
                  value={reasonForApplicationPostalCode}
                />
              </GridColumn>
            </GridRow>
          )}
        </Stack>
      )}
    </ReviewGroup>
  )
}
