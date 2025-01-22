import { coreErrorMessages } from '@island.is/application/core'
import { YES } from '@island.is/application/types'
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

export const AllergiesAndIntolerances = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const {
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestMedicationAssistance,
  } = getApplicationAnswers(application.answers)

  const {
    options: foodAllergiesOrIntolerancesOptions,
    loading: foodAllergiesOrIntolerancesLoading,
    error: foodAllergiesOrIntolerancesError,
  } = useFriggOptions(OptionsType.INTOLERANCE) // TODO: Update when Júní has updated key-options

  const {
    options: otherAllergiesOptions,
    loading: otherAllergiesLoading,
    error: otherAllergiesError,
  } = useFriggOptions(OptionsType.ALLERGY) // TODO: Update when Júní has updated key-options

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('allergiesAndIntolerances')}
    >
      <Stack space={2}>
        {(hasFoodAllergiesOrIntolerances.includes(YES) ||
          hasOtherAllergies.includes(YES)) &&
        (foodAllergiesOrIntolerancesLoading || otherAllergiesLoading) ? (
          <SkeletonLoader height={40} width="80%" borderRadius="large" />
        ) : (
          <>
            {hasFoodAllergiesOrIntolerances.includes(YES) && (
              <GridRow>
                <GridColumn span="10/12">
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.overview
                        .foodAllergiesOrIntolerances,
                    )}
                    value={foodAllergiesOrIntolerances
                      .map((foodAllergyOrIntolerance) =>
                        getSelectedOptionLabel(
                          foodAllergiesOrIntolerancesOptions,
                          foodAllergyOrIntolerance,
                        ),
                      )
                      .join(', ')}
                    error={
                      foodAllergiesOrIntolerancesError
                        ? formatMessage(coreErrorMessages.failedDataProvider)
                        : undefined
                    }
                  />
                </GridColumn>
              </GridRow>
            )}
            {hasOtherAllergies.includes(YES) && (
              <GridRow>
                <GridColumn span="10/12">
                  <DataValue
                    label={formatMessage(
                      newPrimarySchoolMessages.overview.otherAllergies,
                    )}
                    value={otherAllergies
                      .map((otherAllergy) =>
                        getSelectedOptionLabel(
                          otherAllergiesOptions,
                          otherAllergy,
                        ),
                      )
                      .join(', ')}
                    error={
                      otherAllergiesError
                        ? formatMessage(coreErrorMessages.failedDataProvider)
                        : undefined
                    }
                  />
                </GridColumn>
              </GridRow>
            )}
            {(hasFoodAllergiesOrIntolerances.includes(YES) ||
              hasOtherAllergies.includes(YES)) && (
              <GridRow>
                <GridColumn span="12/12">
                  <RadioValue
                    label={formatMessage(
                      newPrimarySchoolMessages.overview.usesEpiPen,
                    )}
                    value={usesEpiPen}
                  />
                </GridColumn>
              </GridRow>
            )}
            <GridRow>
              <GridColumn span="10/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .hasConfirmedMedicalDiagnoses,
                  )}
                  value={hasConfirmedMedicalDiagnoses}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12">
                <RadioValue
                  label={formatMessage(
                    newPrimarySchoolMessages.differentNeeds
                      .requestMedicationAssistance,
                  )}
                  value={requestMedicationAssistance}
                />
              </GridColumn>
            </GridRow>
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
