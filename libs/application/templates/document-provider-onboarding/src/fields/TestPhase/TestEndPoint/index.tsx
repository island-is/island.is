import React, { FC, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useFormContext, Controller } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'
import { ErrorMessage } from '@hookform/error-message'

export const updateTestEndpointMutation = gql`
  mutation UpdateTestEndpoint($input: UpdateEndpointInput!) {
    updateTestEndpoint(input: $input) {
      audience
      scope
    }
  }
`

const TestEndPoint: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  interface Variable {
    id: string
    name: string
    value: string
  }

  const {
    clearErrors,
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext()
  const { answers: formValue } = application
  const [variables, setendPointVariables] = useState<Variable[]>([])
  const [testEndPointError, setTestEndPointError] = useState<string | null>(
    null,
  )

  const [endpointExists, setendpointExists] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formValue.endPointObject?.endPointExists || '',
  )
  const [updateEndpoint, { loading }] = useMutation(
    updateTestEndpointMutation,
    {
      onError: (error) => {
        if (error.message.includes('Unique key violation')) {
          setTestEndPointError(
            formatText(
              m.testEndPointErrorMessageUniqueKeyViolation,
              application,
              formatMessage,
            ),
          )
        } else {
          setTestEndPointError(
            formatText(m.testEndPointErrorMessage, application, formatMessage),
          )
        }
      },
    },
  )

  const nationalId = getValueViaPath<string>(
    application.answers,
    'applicant.nationalId',
  )

  const testProviderId = getValueViaPath<string>(
    application.answers,
    'testProviderId',
  )

  const onUpdateEndpoint = async (isValid: boolean) => {
    setTestEndPointError(null)
    if (isValid) {
      const result = await updateEndpoint({
        variables: {
          input: {
            nationalId: nationalId,
            endpoint: getValues('endPointObject.endPoint'),
            providerId: testProviderId,
          },
        },
      })
      if (result) {
        setendPointVariables([
          {
            id: '1',
            name: 'Audience',
            value: result.data.updateTestEndpoint.audience,
          },
          {
            id: '2',
            name: 'Scope',
            value: result.data.updateTestEndpoint.scope,
          },
        ])
        setendpointExists('true')
        clearErrors()
      }
    }
  }

  return (
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={formatText(
              m.testEndPointSubTitle,
              application,
              formatMessage,
            )}
          />
        </Box>
        <Box marginBottom={1}>
          <Controller
            defaultValue=""
            name={'endPointObject.endPoint'}
            render={() => (
              <Input
                label={formatText(
                  m.testEndpointLabel,
                  application,
                  formatMessage,
                )}
                disabled={loading}
                {...register('endPointObject.endPoint')}
                id={'endPointObject.endPoint'}
                defaultValue=""
                placeholder={formatText(
                  m.testEndpointPlaceholder,
                  application,
                  formatMessage,
                )}
                hasError={errors['endPointObject.endPoint'] !== undefined}
                errorMessage={formatText(
                  m.testEndpointInputErrorMessage,
                  application,
                  formatMessage,
                )}
              />
            )}
          />
        </Box>
      </Box>
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
          onClick={() => {
            trigger(['endPointObject.endPoint']).then((answer) =>
              onUpdateEndpoint(answer),
            )
          }}
        >
          Vista endapunkt
        </Button>
        <input
          type="hidden"
          value={endpointExists}
          {...register('endPointObject.endPointExists', { required: true })}
        />
        {errors['endPointObject.endPointExists'] && (
          <Box color="red600" paddingY={2} display="flex">
            <Text fontWeight="semiBold" color="red600">
              <ErrorMessage
                as="span"
                errors={errors}
                name="endPointObject.endPointExists"
              />
            </Text>
          </Box>
        )}
        {testEndPointError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {testEndPointError}
            </Text>
          </Box>
        )}
      </Box>

      {variables &&
        variables.map((Variable, index) => (
          <Box marginBottom={3} key={index}>
            <CopyToClipboardInput
              inputLabel={Variable.name}
              inputValue={Variable.value}
            ></CopyToClipboardInput>
          </Box>
        ))}
    </Box>
  )
}

export default TestEndPoint
