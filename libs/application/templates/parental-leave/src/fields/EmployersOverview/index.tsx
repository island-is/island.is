import { RepeaterProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  ContentBlock,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { useDeepCompareEffect } from 'react-use'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { EmployerRow } from '../../types'
import { EmployersTable } from '../components/EmployersTable'

const EmployersOverview: FC<RepeaterProps> = ({
  error,
  application,
  expandRepeater,
  setRepeaterItems,
  setBeforeSubmitCallback,
}) => {
  const employers: EmployerRow[] | undefined = getValueViaPath(
    application.answers,
    'employers',
  )

  const { formatMessage, locale } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const onDeleteEmployer = async (nationalId: string) => {
    const reducedEmployers = employers?.filter(
      (e) => e.name.nationalId !== nationalId,
    )
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
        {parentalLeaveFormMessages.employer.description.defaultMessage}
      </Text>
      <Box paddingTop={5} paddingBottom={5}>
        <EmployersTable
          employers={employers}
          editable
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
