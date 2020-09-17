import React, { FC } from 'react'
import { DividerField } from '@island.is/application/template'
import { Divider, Typography } from '@island.is/island-ui/core'

const DividerFormField: FC<{
  field: DividerField
}> = ({ field }) => {
  return (
    <>
      <Divider />
      {field.name}
      <Divider />
    </>
  )
}

export default DividerFormField
