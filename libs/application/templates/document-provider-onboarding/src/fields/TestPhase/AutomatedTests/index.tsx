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
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

//TODO: Implement this component, only initial setup.
const AutomatedTests: FC<FieldBaseProps> = ({ field, application }) => {
  interface Response {
    id: string
    isValid: boolean
    message: string
  }

  const fetchData = async () => {
    //
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
      <Box marginTop={3}>
        <GridContainer>
          <GridRow>
            <GridColumn span="6/12">
              <Input label="Kennitala mótttakanda" name="Test" />
            </GridColumn>
            <GridColumn span="6/12">
              <Input label="Id skjals" name="Test2" />
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
                  variant="primary"
                  onClick={() => {
                    fetchData()
                  }}
                >
                  Hefja próf
                </Button>
                <Box>{isLoading && <LoadingIcon size={50} />}</Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      {!isLoading && (
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
  )
}

export default AutomatedTests
