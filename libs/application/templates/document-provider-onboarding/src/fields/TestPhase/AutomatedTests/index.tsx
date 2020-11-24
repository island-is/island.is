import React, { FC, useState } from 'react'
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
  Stack,
} from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { FieldDescription } from '@island.is/shared/form-fields'
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

  let [response, setResponse] = useState<Response[]>([])
  let [isLoading, setIsLoading] = useState(false)
  return (
    <Box>
      <Box marginBottom={3}>
        <FieldDescription
          description="Tilgangur þessa prófs er að sannreyna að skjalaveita geti sent notanda
          skjal og að notandi geti nálgast skjal hjá skjalaveitu."
        />
      </Box>
      <Box marginBottom={1}>
        <Text variant="h3">Leiðbeiningar</Text>
        <Text>
          Sendu skjal á einhverja kennitölu í pósthólfið á prófunarumhverfinu.
          Því næst skal slá inn kennitölu þess sem skjalið var sent á í reitinn
          hér að neðan og velja að keyra próf. Prófið athugar hvort skjal hafi
          borist þessari kennitölu á síðustu 5 mínútum. Einnig er sannreynt að
          hægt sé að sækja skjalið til skjalaveitu.
        </Text>
      </Box>
      <Box marginTop={3} position="relative">
        <GridContainer>
          <GridRow>
            <GridColumn span="6/12">
              <Input
                label="Kennitala móttakanda"
                name="nationalId"
                id="nationalId"
                ref={register({ required: true })}
                required
                defaultValue=""
                placeholder="Skráðu inn kennitölu"
                hasError={errors.nationalId !== undefined}
                errorMessage="Þú verður að skrá inn kennitölu móttakanda"
                disabled={isLoading}
              />
            </GridColumn>
            <GridColumn span="6/12">
              <Input
                label="Id skjals"
                name="docId"
                required
                placeholder="Skráðu inn Id skjals"
                ref={register({ required: true })}
                hasError={errors.docId !== undefined}
                errorMessage="Þú verður að skrá inn Id skjals"
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
