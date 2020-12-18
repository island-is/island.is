import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { registerProviderMutation } from '../../../graphql/mutations/registerProviderMutation'
import { m } from '../../../forms/messages'

const ProdEnvironment: FC<FieldBaseProps> = ({ error, application }) => {
  const { formatMessage } = useLocale()

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    (formValue.prodProviderId as string) || '',
  )
  const [registerProvider] = useMutation(registerProviderMutation)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const nationalId = getValueViaPath(
    application.answers,
    'applicant.nationalId',
    undefined,
  ) as string

  const clientName = getValueViaPath(
    application.answers,
    'applicant.name',
    undefined,
  ) as string

  const onRegister = async () => {
    setProdEnvironmentErrorError(null)
    const credentials = await registerProvider({
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
        value: credentials.data.registerProvider.clientId,
      },
      {
        name: 'Secret key',
        value: credentials.data.registerProvider.clientSecret,
      },
    ])

    setCurrentAnswer(credentials.data.registerProvider.providerId)

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            prodProviderId: credentials.data.registerProvider.providerId,
            ...application.answers,
          },
        },
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
          disabled={currentAnswer !== ''}
          onClick={() => {
            onRegister()
          }}
        >
          {formatText(m.prodEnviromentButton, application, formatMessage)}
        </Button>
        <input
          type="hidden"
          value={currentAnswer}
          ref={register({ required: true })}
          name={'prodProviderId'}
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
