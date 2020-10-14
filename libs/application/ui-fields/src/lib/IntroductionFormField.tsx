import React, { FC } from 'react'
import {
  Application,
  formatText,
  IntroductionField,
} from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

const IntroductionFormField: FC<{
  application: Application
  field: IntroductionField
  showFieldName: boolean
}> = ({ application, field, showFieldName }) => {
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && (
        <Text variant="h2">
          {formatText(field.name, application, formatMessage)}
        </Text>
      )}
      <Text>{formatText(field.introduction, application, formatMessage)}</Text>
    </div>
  )
}

export default IntroductionFormField
