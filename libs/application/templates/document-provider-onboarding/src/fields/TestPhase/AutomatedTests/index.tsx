import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
  Button,
  Icon,
  LoadingIcon,
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { m } from '../../../forms/messages'
import * as styles from './AutomatedTests.treat'

const AutomatedTests: FC<FieldBaseProps> = () => {
  interface Response {
    id: string
    isValid: boolean
    message: string
  }

  const { register, errors, trigger } = useForm()

  const validateEndpoint = async () => {
    setIsLoading(true)
    await fetch('/api/testMyEndpoint')
      .then((response) => response.json())
      .then((json) => {
        setResponse(json)
        setIsLoading(false)
      })
  }

  const [response, setResponse] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(false)
  //TODO finish design of this component
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
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="4/12">
              <Box
                marginTop={3}
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
              >
                <Button
                  onClick={() => {
                    trigger(['nationalId', 'docId']).then((isValid) =>
                      isValid ? validateEndpoint() : setResponse([]),
                    )
                  }}
                >
                  Hefja próf
                </Button>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
        {isLoading ? (
          <Box
            className={styles.isLoadingContainer}
            position="absolute"
            left={0}
            right={0}
            top={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="large"
            background="blue100"
          >
            <LoadingIcon animate size={30} />
          </Box>
        ) : (
          <Box>
            {response.map((Response) => (
              <Box marginTop={3} key={Response.id}>
                <GridContainer>
                  <GridRow>
                    <GridColumn>
                      {Response.isValid ? (
                        <Icon
                          color="mint600"
                          icon="checkmarkCircle"
                          size="medium"
                          type="filled"
                        />
                      ) : (
                        <Icon
                          color="red600"
                          icon="warning"
                          size="medium"
                          type="filled"
                        />
                      )}
                    </GridColumn>
                    <GridColumn>
                      <Text variant="h5">{Response.message}</Text>
                    </GridColumn>
                  </GridRow>
                </GridContainer>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AutomatedTests
