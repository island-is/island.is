import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, formatText } from '@island.is/application/core'
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
import { runEndpointTestsMutation } from '../../../graphql/mutations/runEndpointTestsMutation'

const AutomatedTests: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  interface Response {
    id: string
    isValid: boolean
    message: string
  }

  const [response, setResponse] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [automatedTestsError, setautomatedTestsError] = useState<string | null>(
    null,
  )
  const { register, errors, trigger } = useForm()
  const [runEndpointTests] = useMutation(runEndpointTestsMutation)

  const validateEndpoint = async () => {
    setautomatedTestsError(null)
    setIsLoading(true)

    const results = await runEndpointTests({
      variables: {
        input: {
          nationalId: '2404805659',
          recipient: '2404805659',
          documentId: '123456',
        }, //TODO set real data
      },
    })

    if (!results.data) {
      setIsLoading(false)
      setautomatedTestsError(m.automatedTestsErrorMessage.defaultMessage)
    }

    setResponse(results.data.runEndpointTests)
    setIsLoading(false)
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
                name="nationalId"
                id="nationalId"
                ref={register({
                  required: true,
                  pattern: /([0-9]){6}-?([0-9]){4}/,
                })}
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
                disabled={isLoading}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']} paddingTop={[3, 0]}>
              <Input
                label={formatText(
                  m.automatedTestsDocIdLabel,
                  application,
                  formatMessage,
                )}
                name="docId"
                required
                placeholder={formatText(
                  m.automatedTestsDocIdPlaceholder,
                  application,
                  formatMessage,
                )}
                ref={register({ required: true })}
                hasError={errors.docId !== undefined}
                errorMessage={formatText(
                  m.automatedTestsDocIdErrorMessage,
                  application,
                  formatMessage,
                )}
                disabled={isLoading}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
        <Box marginTop={3} display="flex" alignItems="flexEnd">
          <Box>
            <Button
              variant="ghost"
              size="small"
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
