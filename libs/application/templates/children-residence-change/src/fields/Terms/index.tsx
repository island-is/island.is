import React from 'react'
import HtmlParser from 'react-html-parser'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { terms } from '../../lib/messages'

const Terms = ({ field, error }: FieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useLocale()
  const text = HtmlParser(terms.general.description.defaultMessage)
  return (
    <>
    <Box marginBottom={5} marginTop={3}>
      {text.map((item, i) => {
        const isHeading = item.type === 'h4'
        const marginBottom = isHeading ? 1 : 2
        return (<Text variant={isHeading ? 'h4' : 'default'} marginBottom={i + 1 === text.length ? 0 : marginBottom}>
          {item.props.children[0]}
        </Text>)
      })}
    </Box>
      <CheckboxController
        id={id}
        disabled={disabled}
        name={`${id}`}
        error={error}
        large={true}
        options={[
          {
            value: 'yes',
            label: formatMessage(terms.residenceChangeCheckbox.label),
          },
        ]}
      />
    </>
  )
}

export default Terms
