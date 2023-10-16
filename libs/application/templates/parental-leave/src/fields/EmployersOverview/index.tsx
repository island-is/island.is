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
import { parentalLeaveFormMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useDeepCompareEffect } from 'react-use'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { EmployersTable } from '../components/EmployersTable'
import { States, YES } from '../../constants'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'

const EmployersOverview: FC<React.PropsWithChildren<RepeaterProps>> = ({
  error,
  application,
  expandRepeater,
  setRepeaterItems,
  setBeforeSubmitCallback,
}) => {
  const answers = getApplicationAnswers(application.answers)
  let employers = answers.employers

  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  useEffect(() => {
    const newAnswers = getApplicationAnswers(application.answers)
    employers = newAnswers.employers

    if (employers.length === 0) {
      expandRepeater()
    }
  }, [
    application,
    expandRepeater,
    formatMessage,
    locale,
    employers,
    setBeforeSubmitCallback,
    setRepeaterItems,
    updateApplication,
  ])

  const onDeleteEmployer = async (email: string) => {
    const reducedEmployers = employers?.filter((e) => e.email !== email)
    if (!reducedEmployers) {
      return
    }

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: { employers: reducedEmployers },
        },
        locale,
      },
    })
    await setRepeaterItems(reducedEmployers)
  }

  useDeepCompareEffect(() => {
    setBeforeSubmitCallback?.(async () => {
      if (!employers || employers.length === 0) {
        return [
          false,
          formatMessage(parentalLeaveFormMessages.employer.addEmployerError),
        ]
      }

      return [true, null]
    })
  }, [setBeforeSubmitCallback, employers])

  return (
    <Box>
      <Text variant="default">
        {answers.employerLastSixMonths === YES
          ? formatMessage(parentalLeaveFormMessages.employer.grantsDescription)
          : formatMessage(parentalLeaveFormMessages.employer.description)}
      </Text>
      <Box paddingTop={5} paddingBottom={5}>
        <EmployersTable
          employers={employers}
          editable={
            application.state === States.DRAFT ||
            application.state === States.EDIT_OR_ADD_PERIODS
          }
          onDeleteEmployer={onDeleteEmployer}
        />
      </Box>
      <Box alignItems="center">
        <Inline space={1} alignY="center">
          <Button size="small" icon="add" onClick={expandRepeater}>
            {formatMessage(parentalLeaveFormMessages.employer.addEmployer)}
          </Button>
        </Inline>
      </Box>
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

export default EmployersOverview
