import React, { FC } from 'react'
import { IntroductionField } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

const IntroductionFormField: FC<{
  field: IntroductionField
  showFieldName: boolean
}> = ({ field, showFieldName }) => {
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && <Text variant="h2">{formatMessage(field.name)}</Text>}
      <Text>{formatMessage(field.introduction)}</Text>
    </div>
  )
}

export default IntroductionFormField
