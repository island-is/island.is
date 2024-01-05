import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'

export const createTestProviderMutation = gql`
  mutation CreateTestProvider($input: CreateProviderInput!) {
    createTestProvider(input: $input) {
      clientId
      clientSecret
      providerId
    }
  }
`

const TestEnvironment: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  error,
}) => {
  const { lang: locale, formatMessage } = useLocale()
  interface Key {
    name: string
    value: string
  }
  const { answers: formValue } = application
  const { register, clearErrors } = useFormContext()

  const [keys, setKeys] = useState<Key[]>([])
  const [currentAnswer, setCurrentAnswer] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (formValue.testProviderId as string) || '',
  )
  const [environmentError, setEnvironmentError] = useState<string | null>(null)
  const [createTestProvider, { loading }] = useMutation(
    createTestProviderMutation,
  )
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const nationalId = getValueViaPath<string>(
    application.answers,
    'applicant.nationalId',
  )

  const clientName = getValueViaPath<string>(
    application.answers,
    'applicant.name',
  )

  const onRegister = async () => {
    setEnvironmentError(null)
    const credentials = await createTestProvider({
      variables: {
        input: { nationalId: nationalId, clientName: clientName },
      },
    })

    if (!credentials.data) {
      setEnvironmentError(m.testEnviromentErrorMessage.defaultMessage)
    }

    setKeys([
      {
        name: 'Client ID',
        value: credentials.data.createTestProvider.clientId,
      },
      {
        name: 'Secret key',
        value: credentials.data.createTestProvider.clientSecret,
      },
    ])

    setCurrentAnswer(credentials.data.createTestProvider.providerId)

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            testProviderId: credentials.data.createTestProvider.providerId,
            ...application.answers,
          },
        },
        locale,
      },
    }).then((response) => {
      application.answers = response.data?.updateApplication?.answers
    })
    clearErrors('testProviderId')
  }

  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={formatText(
              m.testEnviromentFieldDescription,
              application,
              formatMessage,
            )}
          />
        </Box>
        <Box marginBottom={3}>
          <Text>
            <strong>
              {formatText(
                m.testEnviromentStrongText,
                application,
                formatMessage,
              )}
            </strong>
          </Text>
        </Box>
      </Box>
      <Box
        marginBottom={7}
        display="flex"
        alignItems="flexEnd"
        flexDirection="column"
      >
        <Button
          variant="ghost"
          size="small"
          loading={loading}
          disabled={currentAnswer !== ''}
          onClick={() => {
            onRegister()
          }}
        >
          Búa til aðgang
        </Button>
        <input
          type="hidden"
          value={currentAnswer}
          {...register('testProviderId', { required: true })}
        />
        {error && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {error}
            </Text>
          </Box>
        )}
        {environmentError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {environmentError}
            </Text>
          </Box>
        )}
      </Box>
      {keys.map((Key, index) => (
        <Box marginBottom={3} key={index}>
          <CopyToClipboardInput
            inputLabel={Key.name}
            inputValue={Key.value}
          ></CopyToClipboardInput>
        </Box>
      ))}
    </Box>
  )
}

export default TestEnvironment
