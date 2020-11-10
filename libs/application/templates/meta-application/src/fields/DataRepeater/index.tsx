import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/core'
import { Button, Text } from '@island.is/island-ui/core'

const DataRepeater: FC<RepeaterProps> = ({ expandRepeater }) => {
  return (
    <>
      <Text>TODO</Text>

      <Button onClick={expandRepeater}>Bæta við</Button>
    </>
  )
}

export default DataRepeater
