import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/core'
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
import { m } from '../../../forms/messages'

import { runEndpointTestsMutation } from '../../../graphql/mutations/runEndpointTestsMutation'

const AutomatedTests: FC<FieldBaseProps> = () => {
  interface Response {
    id: string
    isValid: boolean
    message: string
  }

  const [response, setResponse] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { register, errors, trigger } = useForm()
  const [runEndpointTests] = useMutation(runEndpointTestsMutation)

  const validateEndpoint = async () => {
    setIsLoading(true)

    const results = await runEndpointTests({
      variables: {
        input: { recipient: '2404805659', documentId: '123456' }, //TODO set real data
      },
    })

    if (!results.data) {
      //TODO display error
    }

    setResponse(results.data.runEndpointTests)
    setIsLoading(false)
  }
  //TODO finish loading state
  return (
    <Box>
      <Box marginBottom={3}>
        <FieldDescription
          description={m.automatedTestsSubTitle.defaultMessage}
        />
      </Box>
      <Box marginBottom={1}>
        <Text variant="h3">{m.automatedTestsSubHeading.defaultMessage}</Text>
        <Text>{m.automatedTestsMessage.defaultMessage}</Text>
      </Box>
      <Box marginTop={3} position="relative">
        <GridContainer>
          <GridRow>
            <GridColumn span="6/12">
              <Input
                label={m.automatedTestsNationalIdLabel.defaultMessage}
                name="nationalId"
                id="nationalId"
                ref={register({
                  required: true,
                  pattern: /([0-9]){6}-?([0-9]){4}/,
                })}
                required
                defaultValue=""
                placeholder="Skráðu inn kennitölu"
                hasError={errors.nationalId !== undefined}
                errorMessage={
                  m.automatedTestsNationalIdErrorMessage.defaultMessage
                }
                disabled={isLoading}
              />
            </GridColumn>
            <GridColumn span="6/12">
              <Input
                label={m.automatedTestsDocIdLabel.defaultMessage}
                name="docId"
                required
                placeholder="Skráðu inn Id skjals"
                ref={register({ required: true })}
                hasError={errors.docId !== undefined}
                errorMessage={m.automatedTestsDocIdErrorMessage.defaultMessage}
                disabled={isLoading}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
        <Box marginTop={3} display="flex" justifyContent="flexEnd">
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              trigger(['nationalId', 'docId']).then((isValid) =>
                isValid ? validateEndpoint() : setResponse([]),
              )
            }}
          >
            {m.automatedTestsButton.defaultMessage}
          </Button>
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
