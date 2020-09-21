import React, { FC } from 'react'
import { IntroductionField } from '@island.is/application/template'
import { Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

const IntroductionFormField: FC<{
  field: IntroductionField
  showFieldName: boolean
}> = ({ field, showFieldName }) => {
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && (
        <Typography variant="h2">{formatMessage(field.name)}</Typography>
      )}
      <Typography variant="p">{formatMessage(field.introduction)}</Typography>
    </div>
  )
}

export default IntroductionFormField
