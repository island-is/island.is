import React, { FC, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ErrorMessage } from '@hookform/error-message'
import { useFormContext, Controller } from 'react-hook-form'
import {
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'

export const updateEndpointMutation = gql`
  mutation UpdateEndpoint($input: UpdateEndpointInput!) {
    updateEndpoint(input: $input) {
      audience
      scope
    }
  }
`

const ProdEndPoint: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  interface Variable {
    id: string
    name: string
    value: string
  }

  const {
    register,
    clearErrors,
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext()
  const { answers: formValue } = application
  const [prodEndPointError, setprodEndPointError] = useState<string | null>(
    null,
  )
  const [variables, setendPointVariables] = useState<Variable[]>([])
  const [prodEndPointExists, setprodEndPointExists] = useState(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formValue.productionEndPointObject?.prodEndPointExists || '',
  )
  const [updateEndpoint, { loading }] = useMutation(updateEndpointMutation, {
    onError: (error) => {
      if (error.message.includes('Unique key violation')) {
        setprodEndPointError(
          formatText(
            m.testEndPointErrorMessageUniqueKeyViolation,
            application,
            formatMessage,
          ),
        )
      } else {
        setprodEndPointError(
          formatText(m.prodEndPointErrorMessage, application, formatMessage),
        )
      }
    },
  })

  const nationalId = getValueViaPath<string>(
    application.answers,
    'applicant.nationalId',
  )

  const prodProviderId = getValueViaPath<string>(
    application.answers,
    'prodProviderId',
  )

  const onUpdateEndpoint = async (isValid: boolean) => {
    if (isValid) {
      setprodEndPointError(null)
      const result = await updateEndpoint({
        variables: {
          input: {
            nationalId: nationalId,
            endpoint: getValues('productionEndPointObject.prodEndPoint'),
            providerId: prodProviderId,
          },
        },
      })
      if (result) {
        setendPointVariables([
          {
            id: '1',
            name: 'Audience',
            value: result.data.updateEndpoint.audience,
          },
          { id: '2', name: 'Scope', value: result.data.updateEndpoint.scope },
        ])
        setprodEndPointExists('true')
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
              m.prodEndPointSubTitle,
              application,
              formatMessage,
            )}
          />
        </Box>
        <Box marginBottom={1}>
          <Controller
            defaultValue=""
            name={'productionEndPointObject.prodEndPoint'}
            render={() => (
              <Input
                label={formatText(
                  m.prodEndpointLabel,
                  application,
                  formatMessage,
                )}
                {...register('productionEndPointObject.prodEndPoint')}
                id={'productionEndPointObject.prodEndPoint'}
                defaultValue=""
                placeholder={formatText(
                  m.prodEndpointPlaceholder,
                  application,
                  formatMessage,
                )}
                hasError={
                  errors &&
                  getErrorViaPath(
                    errors,
                    'productionEndPointObject.prodEndPoint',
                  ) !== undefined
                }
                errorMessage={formatText(
                  m.prodEndpointInputErrorMessage,
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
            trigger(['productionEndPointObject.prodEndPoint']).then((answer) =>
              onUpdateEndpoint(answer),
            )
          }}
        >
          Vista endapunkt
        </Button>
        <input
          type="hidden"
          value={prodEndPointExists}
          {...register('productionEndPointObject.prodEndPointExists', {
            required: true,
          })}
        />

        {errors['productionEndPointObject.prodEndPointExists'] && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              <ErrorMessage
                as="span"
                errors={errors}
                name="productionEndPointObject.prodEndPointExists"
              />
            </Text>
          </Box>
        )}
        {prodEndPointError && (
          <Box color="red600" paddingY={2}>
            <Text fontWeight="semiBold" color="red600">
              {prodEndPointError}
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

export default ProdEndPoint
