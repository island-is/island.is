import { RepeaterProps } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  ContentBlock,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import {
  oldAgePensionFormMessage,
  validatorErrorMessages,
} from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { EmployersTable } from '../components/EmployersTable'
import { getApplicationAnswers } from '../../utils/oldAgePensionUtils'
import { Employer } from '../../utils/types'
import { States } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { ApplicationType } from '../../utils/constants'
import {
  markEmployersOverviewAutoExpanded,
  shouldAutoExpandEmployersOverview,
} from './utils'

const EmployersOverview: FC<RepeaterProps> = ({
  error,
  application,
  expandRepeater,
  setRepeaterItems,
  setBeforeSubmitCallback,
}) => {
  const { employers, rawEmployers, applicationType } = getApplicationAnswers(
    application.answers,
  )

  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const onUpdateApplication = async (reducedEmployers: Employer[]) => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: { employers: reducedEmployers },
        },
        locale,
      },
    })
  }

  useEffect(() => {
    if (
      shouldAutoExpandEmployersOverview(application.id, rawEmployers, employers)
    ) {
      markEmployersOverviewAutoExpanded(application.id)
      expandRepeater()
      return
    }

    // expandRepeater appends an empty {} to the employers array. If the user
    // backs out of the addEmployers form without entering anything, that empty
    // entry stays in state and fails dataSchema validation, silently blocking
    // submission on earlier screens (e.g. employmentStatusSubSection).
    const nonEmptyEmployers = rawEmployers.filter(
      (e) =>
        !!e?.email ||
        !!e?.phoneNumber ||
        !!e?.ratioType ||
        !!e?.ratioYearly ||
        !!e?.ratioMonthlyAvg,
    )
    if (nonEmptyEmployers.length !== rawEmployers.length) {
      setRepeaterItems(nonEmptyEmployers)
    }
  }, [application.id, expandRepeater, employers, rawEmployers, setRepeaterItems])

  setBeforeSubmitCallback?.(async () => {
    if (
      applicationType === ApplicationType.HALF_OLD_AGE_PENSION &&
      employers.length === 0
    ) {
      return [
        false,
        formatMessage(validatorErrorMessages.employerRequiredForHalfPension),
      ]
    }

    return [true, null]
  })

  const onDeleteEmployer = async (email: string) => {
    const reducedEmployers = employers?.filter((e) => e.email !== email)
    if (!reducedEmployers) {
      return
    }

    onUpdateApplication(reducedEmployers)
    await setRepeaterItems(reducedEmployers)
  }

  return (
    <Box>
      <Text variant="default">
        {formatMessage(oldAgePensionFormMessage.employer.employerDescription)}
      </Text>
      <Box paddingTop={5} paddingBottom={5}>
        <EmployersTable
          employers={employers}
          editable={application.state === States.DRAFT}
          onDeleteEmployer={onDeleteEmployer}
        />
      </Box>
      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" onClick={expandRepeater}>
            {formatMessage(oldAgePensionFormMessage.employer.addEmployer)}
          </Button>
        </Inline>
      </Box>
      {typeof error === 'string' && !!error && (
        <Box marginTop={3}>
          <ContentBlock>
            <AlertMessage type="error" title={error} />
          </ContentBlock>
        </Box>
      )}
    </Box>
  )
}

export default EmployersOverview
