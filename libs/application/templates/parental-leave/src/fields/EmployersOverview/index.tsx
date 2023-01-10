import { RepeaterProps } from '@island.is/application/types'
import { FC } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  ContentBlock,
  Icon,
  Inline,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { useDeepCompareEffect } from 'react-use'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'

export interface EmployerRow {
  name: {
    label: string
    nationalId: string
  }
  email: string
  phoneNumber: string
  ratio: string
}

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

  const onDeleteEmployer = (nationalId: string) => {
    const reducedEmployers = employers?.filter(
      (e) => e.name.nationalId !== nationalId,
    )
    if (!reducedEmployers) {
      return
    }

    updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: { employers: reducedEmployers },
        },
        locale,
      },
    })
    setRepeaterItems(reducedEmployers)
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
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              <T.HeadData>Kennitala</T.HeadData>
              <T.HeadData>Nafn</T.HeadData>
              <T.HeadData>Netfang</T.HeadData>
              <T.HeadData>Símanúmer</T.HeadData>
              <T.HeadData>Hlutfall</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {employers?.map((e) => (
              <T.Row key={`${e.email}${e.name.nationalId}`}>
                <T.Data>
                  <Box onClick={() => onDeleteEmployer(e.name.nationalId)}>
                    <Icon
                      color="dark200"
                      icon="removeCircle"
                      size="medium"
                      type="outline"
                    />
                  </Box>
                </T.Data>
                <T.Data>{e.name?.nationalId}</T.Data>
                <T.Data>{e.name?.label}</T.Data>
                <T.Data>{e.email}</T.Data>
                <T.Data>{e.phoneNumber}</T.Data>
                <T.Data>{e.ratio}%</T.Data>
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
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
