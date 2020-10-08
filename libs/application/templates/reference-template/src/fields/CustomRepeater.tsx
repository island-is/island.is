import React, { FC } from 'react'
import { RepeaterProps } from '@island.is/application/core'
import { Button, Typography } from '@island.is/island-ui/core'

const CustomRepeater: FC<RepeaterProps> = ({ expandRepeater }) => {
  return (
    <>
      <Typography as={'p'}>
        Repeaters are presented as custom components. They primarily focus on
        easily implementing repetitive flows. The `expandRepeater` prop is
        important as it initiates that subflow to generate more nested items.
      </Typography>

      <Button onClick={expandRepeater}>Expand repeater</Button>
    </>
  )
}

export default CustomRepeater
