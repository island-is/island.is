import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import CopyToClipboardInput from '../../DocumentProvicerApplication/Components/CopyToClipboardInput/Index'

const ProdEnvironment: FC<FieldBaseProps> = () => {
  // TODO: Add this to types file ?
  interface Key {
    id: string
    name: string
    value: string
  }

  const fetchData = async () => {
    //TODO: This should be post to create new user, answer will hold variables, is get for now.
    fetch('/api/prodKeys')
      .then((response) => response.json())
      .then((json) => setKeys(json))
  }

  let [keys, setKeys] = useState<Key[]>([])

  return (
    //TODO: we can make this a generic component for reuasabilty, same as TEST environment
    <Box>
      <Box marginBottom={7} />
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

export default ProdEnvironment
