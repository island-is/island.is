import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
  Button,
  AlertMessage,
  ContentBlock,
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../../forms/messages'

export const runEndpointTestsMutation = gql`
  mutation RunEndpointTests($input: RunEndpointTestsInput!) {
    runEndpointTests(input: $input) {
      id
      isValid
      message
    }
  }
`

const AutomatedTests: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()

  interface Response {
    id: string
    isValid: boolean
    message: string
  }

  const [response, setResponse] = useState<Response[]>([])
  const [automatedTestsError, setautomatedTestsError] = useState<string | null>(
    null,
  )
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
  } = useForm()
  const [runEndpointTests, { loading }] = useMutation(runEndpointTestsMutation)

  const nationalId = getValueViaPath<string>(
    application.answers,
    'applicant.nationalId',
  )

  const validateEndpoint = async () => {
    setautomatedTestsError(null)

    const testProviderId = getValueViaPath<string>(
      application.answers,
      'testProviderId',
    )

    const results = await runEndpointTests({
      variables: {
        input: {
          nationalId: nationalId,
          recipient: getValues('nationalId'),
          documentId: getValues('docId'),
          providerId: testProviderId,
        },
      },
    })

    if (!results.data) {
      setautomatedTestsError(m.automatedTestsErrorMessage.defaultMessage)
    }

    setResponse(results.data.runEndpointTests)
  }
  //TODO finish loading state
  return (
    <Box>
      <Box marginBottom={3}>
        <FieldDescription
          description={formatText(
            m.automatedTestsSubTitle,
            application,
            formatMessage,
          )}
        />
      </Box>
      <Box marginBottom={1}>
        <Text variant="h3">
          {formatText(m.automatedTestsSubHeading, application, formatMessage)}
        </Text>
        <Text>
          {formatText(m.automatedTestsMessage, application, formatMessage)}
        </Text>
      </Box>
      <Box marginTop={3} position="relative">
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                label={formatText(
                  m.automatedTestsNationalIdLabel,
                  application,
                  formatMessage,
                )}
                {...register('nationalId', {
                  required: true,
                  pattern: /([0-9]){6}-?([0-9]){4}/,
                })}
                id="nationalId"
                required
                defaultValue=""
                placeholder={formatText(
                  m.automatedTestsNationalIdPlaceholder,
                  application,
                  formatMessage,
                )}
                hasError={errors.nationalId !== undefined}
                errorMessage={formatText(
                  m.automatedTestsNationalIdErrorMessage,
                  application,
                  formatMessage,
                )}
                disabled={loading}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingTop={[3, 0]}>
              <Input
                label={formatText(
                  m.automatedTestsDocIdLabel,
                  application,
                  formatMessage,
                )}
                {...register('docId', { required: true })}
                required
                placeholder={formatText(
                  m.automatedTestsDocIdPlaceholder,
                  application,
                  formatMessage,
                )}
                hasError={errors.docId !== undefined}
                errorMessage={formatText(
                  m.automatedTestsDocIdErrorMessage,
                  application,
                  formatMessage,
                )}
                disabled={loading}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
        <Box marginTop={3} display="flex" alignItems="flexEnd">
          <Box>
            <Button
              variant="ghost"
              size="small"
              loading={loading}
              onClick={() => {
                trigger(['nationalId', 'docId']).then((isValid) =>
                  isValid ? validateEndpoint() : setResponse([]),
                )
              }}
            >
              {formatText(m.automatedTestsButton, application, formatMessage)}
            </Button>
          </Box>
          {automatedTestsError && (
            <Box color="red600" paddingY={2}>
              <Text fontWeight="semiBold" color="red600">
                {automatedTestsError}
              </Text>
            </Box>
          )}
        </Box>

        <Box>
          {response.map((Response) => (
            <Box marginTop={3} key={Response.id}>
              <ContentBlock>
                {Response.isValid ? (
                  <AlertMessage
                    type="success"
                    title={Response.message}
                  ></AlertMessage>
                ) : (
                  <AlertMessage
                    type="error"
                    title={Response.message}
                  ></AlertMessage>
                )}
              </ContentBlock>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default AutomatedTests
