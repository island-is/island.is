import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'

export const createProviderMutation = gql`
  mutation CreateProvider($input: CreateProviderInput!) {
    createProvider(input: $input) {
      clientId
      clientSecret
      providerId
    }
  }
`

const ProdEnvironment: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  application,
}) => {
  const { lang: locale, formatMessage } = useLocale()

  interface Key {
    name: string
    value: string
  }

  const { register, clearErrors } = useFormContext()
  const [keys, setKeys] = useState<Key[]>([])
  const [prodEnvironmentError, setProdEnvironmentErrorError] = useState<
    string | null
  >(null)
  const { answers: formValue } = application
  const [currentAnswer, setCurrentAnswer] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (formValue.prodProviderId as string) || '',
  )
  const [createProvider, { loading }] = useMutation(createProviderMutation)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const nationalId = getValueViaPath<string>(
    application.answers,
    'applicant.nationalId',
  )

  const clientName = getValueViaPath<string>(
    application.answers,
    'applicant.name',
  )

  const onCreateProvider = async () => {
    setProdEnvironmentErrorError(null)
    const credentials = await createProvider({
      variables: {
        input: { nationalId: nationalId, clientName: clientName },
      },
    })

    if (!credentials.data) {
      setProdEnvironmentErrorError(m.prodEnviromentErrorMessage.defaultMessage)
    }

    setKeys([
      {
        name: 'Client ID',
        value: credentials.data.createProvider.clientId,
      },
      {
        name: 'Secret key',
        value: credentials.data.createProvider.clientSecret,
      },
    ])

    setCurrentAnswer(credentials.data.createProvider.providerId)

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            prodProviderId: credentials.data.createProvider.providerId,
            ...application.answers,
          },
        },
        locale,
      },
    }).then((response) => {
      application.answers = response.data?.updateApplication?.answers
    })
    clearErrors('prodProviderId')
  }

  return (
    <Box>
      <Box marginBottom={3}>
        <Text>
          <strong>
            {formatText(m.prodEnviromentStrongText, application, formatMessage)}
          </strong>
        </Text>
      </Box>
      <Box marginBottom={7} />
      <Box
        marginBottom={7}
        display="flex"
        flexDirection="column"
        alignItems="flexEnd"
      >
        <Button
          variant="ghost"
          size="small"
          loading={loading}
          disabled={currentAnswer !== ''}
          onClick={() => {
            onCreateProvider()
          }}
        >
          {formatText(m.prodEnviromentButton, application, formatMessage)}
        </Button>
        <input
          type="hidden"
          value={currentAnswer}
          {...register('prodProviderId', { required: true })}
        />
        {error && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {error}
            </Text>
          </Box>
        )}
        {prodEnvironmentError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {prodEnvironmentError}
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

export default ProdEnvironment
