import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/types'
import { Button, Text } from '@island.is/island-ui/core'

const CustomRepeater: FC<React.PropsWithChildren<RepeaterProps>> = ({
  expandRepeater,
}) => {
  return (
    <>
      <Text as={'p'}>
        Repeaters are presented as custom components. They primarily focus on
        easily implementing repetitive flows. The `expandRepeater` prop is
        important as it initiates that subflow to generate more nested items.
      </Text>

      <Button onClick={expandRepeater}>Expand repeater</Button>
    </>
  )
}

export default CustomRepeater
