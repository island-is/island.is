import React, { FC, useEffect } from 'react'
import { RepeaterProps } from '@island.is/application/core'
import { ButtonDeprecated as Button, Text } from '@island.is/island-ui/core'

const DataRepeater: FC<RepeaterProps> = ({
  error,
  expandRepeater,
  repeater,
  application,
}) => {
  useEffect(() => {
    expandRepeater()
  }, [])

  return (
    <>
      <Text as={'p'}>TODO</Text>
    </>
  )
}

export default DataRepeater
