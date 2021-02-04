import React, { FC, useMemo } from 'react'
import HtmlParser from 'react-html-parser'

import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
  RadioField,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Text, Box } from '@island.is/island-ui/core'
import {
  RadioController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { buildOptions } from '../utils'
import { useDefaultValue } from '../useDefaultValue'

interface Props extends FieldBaseProps {
  field: RadioField
}
const RadioFormField: FC<Props> = ({
  showFieldName = false,
  field,
  error,
  application,
}) => {
  const {
    disabled,
    id,
    title,
    description,
    options,
    width,
    emphasize,
    largeButtons,
  } = field
  const { formatMessage } = useLocale()

  const finalOptions = useMemo(() => buildOptions(options, application), [
    options,
    application,
  ])

  return (
    <div>
      {showFieldName && (
        <Text variant={'h4'}>
          {formatText(title, application, formatMessage)}
        </Text>
      )}

      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box
        background={emphasize ? 'blue100' : undefined}
        padding={emphasize ? 3 : undefined}
        marginTop={3}
      >
        <RadioController
          largeButtons={largeButtons}
          emphasize={emphasize}
          id={id}
          disabled={disabled}
          error={error}
          split={width === 'half' ? '1/2' : '1/1'}
          name={`${id}`}
          defaultValue={
            (getValueViaPath(application.answers, id) as string[]) ??
            useDefaultValue(field, application)
          }
          options={finalOptions.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: HtmlParser(formatText(label, application, formatMessage)),
            ...(tooltip && {
              tooltip: HtmlParser(
                formatText(tooltip, application, formatMessage),
              ),
            }),
          }))}
        />
      </Box>
    </div>
  )
}

export default RadioFormField
