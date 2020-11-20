import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'

const TestEnvironment: FC<FieldBaseProps> = ({ error, field, application }) => {
  interface Key {
    id: string
    name: string
    value: string
  }

  const fetchData = async () => {
    //TODO: This should be post to create new user, answer will hold variables, is get for now.
    fetch('/api/keys')
      .then((response) => response.json())
      .then((json) => setKeys(json))
  }

  let [keys, setKeys] = useState<Key[]>([])

  return (
    //TODO: we can make this a generic component for reuasabilty, same as production environment
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription description="Hér getur þú búið til aðgang að prófunarumhverfi. Athugið að afrita og geyma þessar upplýsingar því þær eru ekki geymdar hér í þessari umsókn. Ef upplýsingarnar glatast er hægt að búa til nýjan aðgang." />
        </Box>
        <Box marginBottom={1}>
          <Text variant="h3">Aðgangur að pósthólfi</Text>
          <Text>
            Hér er hægt að útbúa aðgang til að senda inn skjalatilvísanir í
            pósthólf
          </Text>
        </Box>
      </Box>
      <Box></Box>
      <Box marginBottom={7}>
        <Button
          variant="primary"
          onClick={() => {
            fetchData()
          }}
        >
          Búa til aðgang
        </Button>
      </Box>
      {keys.map((Key) => (
        <Box marginBottom={3} key={Key.id}>
          <CopyToClipboardInput
            inputLabel={Key.name}
            inputValue={Key.value}
          ></CopyToClipboardInput>
        </Box>
      ))}
    </Box>
  )
}

export default TestEnvironment
