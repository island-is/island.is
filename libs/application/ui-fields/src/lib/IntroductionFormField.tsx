import React, { FC } from 'react'
import {
  Application,
  formatText,
  IntroductionField,
} from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'

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
      <Markdown>
        {formatText(field.introduction, application, formatMessage)}
      </Markdown>
    </div>
  )
}

export default IntroductionFormField
