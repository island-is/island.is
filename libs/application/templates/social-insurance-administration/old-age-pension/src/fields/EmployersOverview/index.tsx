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
import { oldAgePensionFormMessage } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { EmployersTable } from '../components/EmployersTable'
import { States } from '../../lib/constants'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'
import { Employer } from '../../types'

const EmployersOverview: FC<RepeaterProps> = ({
  error,
  application,
  expandRepeater,
  setRepeaterItems,
  setBeforeSubmitCallback,
}) => {
  const { employers } = getApplicationAnswers(application.answers)

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
