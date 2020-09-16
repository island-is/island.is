import React, { FC } from 'react'
import { IntroductionField } from '@island.is/application/template'
import { Typography } from '@island.is/island-ui/core'

const IntroductionFormField: FC<{
  field: IntroductionField
  showFieldName: boolean
}> = ({ field, showFieldName }) => {
  return (
    <div>
      {showFieldName && <Typography variant="h2">{field.name}</Typography>}
      <Typography variant="p">{field.introduction}</Typography>
    </div>
  )
}

export default IntroductionFormField
