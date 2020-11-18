import React, { FC, useEffect, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'

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
        //TODO: Need copy button, should maybe be individual component
        <Box marginBottom={3} key={Key.id}>
          <Input disabled label={Key.name} name="Test1" value={Key.value} />
        </Box>
      ))}
    </Box>
  )
}

export default ProdEnvironment
