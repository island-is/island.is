import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  RepeaterProps,
  FieldBaseProps,
  getErrorViaPath,
} from '@island.is/application/core'
import {
  Box,
  Button,
  Inline,
  Tooltip,
  ContentBlock,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import { Timeline } from '../components/Timeline/Timeline'
import {
  formatPeriods,
  getAvailableRightsInDays,
  getExpectedDateOfBirth,
  getApplicationAnswers,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { States } from '../../constants'
import { minPeriodDays } from '../../config'
import { useDaysAlreadyUsed } from '../../hooks/useDaysAlreadyUsed'

type FieldProps = FieldBaseProps & {
  field?: {
    props?: {
      showDescription: boolean
    }
  }
}
type ScreenProps = RepeaterProps & FieldProps

const PeriodsRepeater: FC<ScreenProps> = ({
  removeRepeaterItem,
  application,
  expandRepeater,
  field,
  repeater,
  error,
  setRepeaterItems,
  setBeforeSubmitCallback,
  setFieldLoadingState,
}) => {
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const showDescription = field?.props?.showDescription ?? true
  const dob = getExpectedDateOfBirth(application)
  const { formatMessage, locale } = useLocale()
  const rights = getAvailableRightsInDays(application)
  const daysAlreadyUsed = useDaysAlreadyUsed(application)
  const { rawPeriods, periods } = getApplicationAnswers(application.answers)

  useEffect(() => {
    if (rawPeriods.length === 0) {
      expandRepeater()
    }

    setBeforeSubmitCallback?.(async () => {
      try {
        if (periods.length === 0) {
          return [false, 'Þú þarft að velja tímabil']
        }

        // Run anwer validator on the periods selected by the user
        const { errors } = await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: { validatedPeriods: periods },
            },
            locale,
          },
        })

        if (errors) {
          setFieldLoadingState?.(false)
          return [false, 'Ekki tókst að halda áfram']
        }

        // Overwrite any pending periods with those that are valid
        const { errors: updateRepeaterErrors } = await setRepeaterItems(periods)

        if (updateRepeaterErrors) {
          setFieldLoadingState?.(false)
          return [false, 'Gat ekki uppfært svör']
        }

        setFieldLoadingState?.(false)
        return [true, null]
      } catch (e) {
        setFieldLoadingState?.(false)
        return [false, (e as Error)?.message || 'Villa kom upp']
      }
    })
  }, [
    application,
    expandRepeater,
    locale,
    periods,
    rawPeriods,
    setBeforeSubmitCallback,
    setFieldLoadingState,
    setRepeaterItems,
    updateApplication,
  ])

  if (!dob) {
    return null
  }

  const dobDate = new Date(dob)
  const editable =
    application.state === States.DRAFT ||
    application.state === States.EDIT_OR_ADD_PERIODS

  const hasAddedPeriods = periods?.length > 0
  const remainingDays = rights - daysAlreadyUsed
  const canAddAnotherPeriod = remainingDays >= minPeriodDays

  return (
    <Box>
      {showDescription && (
        <FieldDescription
          description={
            hasAddedPeriods
              ? formatMessage(parentalLeaveFormMessages.leavePlan.description)
              : 'Nú er komið að því að velja tímabil'
          }
        />
      )}

      <Box marginTop={showDescription ? 3 : undefined} marginBottom={3}>
        <Timeline
          initDate={dobDate}
          title={formatMessage(
            parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
          )}
          titleSmall={formatMessage(
            parentalLeaveFormMessages.shared.dateOfBirthTitle,
          )}
          periods={formatPeriods(application, formatMessage)}
          onDeletePeriod={removeRepeaterItem}
          editable={editable}
        />
        {!hasAddedPeriods && (
          <FieldDescription description="Ekkert tímabil valið" />
        )}
      </Box>

      {editable && (
        <Box alignItems="center">
          <Inline space={1} alignY="center">
            <Button
              size="small"
              icon="add"
              disabled={!canAddAnotherPeriod}
              onClick={expandRepeater}
            >
              {hasAddedPeriods
                ? formatMessage(parentalLeaveFormMessages.leavePlan.addAnother)
                : 'Bæta við fyrsta tímabilinu'}
            </Button>

            {daysAlreadyUsed >= rights && (
              <Tooltip
                placement="bottom"
                text={formatMessage(parentalLeaveFormMessages.leavePlan.limit)}
              />
            )}
            {remainingDays > 0 && !canAddAnotherPeriod && (
              <Tooltip
                placement="bottom"
                text="Hérna vantar útskýringu á því hvers vegna er ekki hægt að bæta við tímabili þó það séu eftir dagar"
              />
            )}
          </Inline>
        </Box>
      )}
      {hasAddedPeriods && canAddAnotherPeriod && (
        <FieldDescription
          description={`${daysAlreadyUsed} dagar af ${rights} dögum notaðir`}
        />
      )}
      {!!error && (
        <Box marginTop={3}>
          <ContentBlock>
            <AlertMessage type="error" title={error} />
          </ContentBlock>
        </Box>
      )}
    </Box>
  )
}

export default PeriodsRepeater
