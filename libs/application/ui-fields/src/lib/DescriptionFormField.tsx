import React, { FC } from 'react'
import {
  Application,
  formatText,
  DescriptionField,
} from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'

const DescriptionFormField: FC<{
  application: Application
  field: DescriptionField
  showFieldName: boolean
}> = ({ application, field, showFieldName }) => {
  const { formatMessage } = useLocale()

  return (
    <div>
      {showFieldName && (
        <Text variant="h2">
          {formatText(field.title, application, formatMessage)}
        </Text>
      )}
      <Text>
        <Markdown>
          {formatText(field.description, application, formatMessage)}
        </Markdown>
      </Text>
    </div>
  )
}

export default DescriptionFormField
