import { coreErrorMessages, YES } from '@island.is/application/core'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import {
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useFriggOptions } from '../../../hooks/useFriggOptions'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getSelectedOptionLabel,
} from '../../../lib/newPrimarySchoolUtils'
import { ReviewGroupProps } from './props'

export const FreeSchoolMeal = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { acceptFreeSchoolLunch, hasSpecialNeeds, specialNeedsType } =
    getApplicationAnswers(application.answers)

  const {
    options: specialNeedsTypeOptions,
    loading,
    error,
  } = useFriggOptions(OptionsType.SCHOOL_MEAL)

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('freeSchoolMeal')}
    >
      <Stack space={2}>
        {acceptFreeSchoolLunch === YES && hasSpecialNeeds === YES && loading ? (
          <SkeletonLoader height={40} width="80%" borderRadius="large" />
        ) : (
          <>
            <GridRow>
              <GridColumn span="10/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .acceptFreeSchoolLunch,
                  )}
                  value={acceptFreeSchoolLunch}
                />
              </GridColumn>
            </GridRow>
            {acceptFreeSchoolLunch === YES && (
              <GridRow>
                <GridColumn span="12/12">
                  <RadioValue
                    label={formatMessage(
                      newPrimarySchoolMessages.differentNeeds.hasSpecialNeeds,
                    )}
                    value={hasSpecialNeeds}
                  />
                </GridColumn>
              </GridRow>
            )}
            {acceptFreeSchoolLunch === YES && hasSpecialNeeds === YES && (
              <GridRow>
                <GridColumn span="12/12">
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.differentNeeds.specialNeedsType,
                    )}
                    value={getSelectedOptionLabel(
                      specialNeedsTypeOptions,
                      specialNeedsType,
                    )}
                    error={
                      error
                        ? formatMessage(coreErrorMessages.failedDataProvider)
                        : undefined
                    }
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
