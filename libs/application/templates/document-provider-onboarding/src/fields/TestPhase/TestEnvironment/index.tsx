import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'
import { m } from '../../../forms/messages'

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

  const [keys, setKeys] = useState<Key[]>([])

  return (
    //TODO: we can make this a generic component for reuasabilty, same as production environment
    <Box>
      <Box marginBottom={7}>
        <Box marginBottom={3}>
          <FieldDescription
            description={m.testEnviromentFieldDescription.defaultMessage}
          />
        </Box>
        <Box marginBottom={1}>
          <Text variant="h3">{m.testEnviromentSubHeading.defaultMessage}</Text>
          <Text>{m.testEnviromentSubMessage.defaultMessage}</Text>
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
