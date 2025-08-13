import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import { Application, KeyValueField } from '@island.is/application/types'
import { Box, Divider, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'

export const KeyValueFormField: FC<
  React.PropsWithChildren<{
    field: KeyValueField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const values = formatText(field.value, application, formatMessage)

  return (
    <>
      <Box
        paddingY={field.paddingY}
        paddingX={field.paddingX}
        paddingBottom={field.paddingBottom}
        display={field.display === 'flex' ? 'flex' : 'block'}
        justifyContent="spaceBetween"
        marginTop={field.marginTop}
        marginBottom={field.marginBottom}
      >
        <Box
          display="flex"
          alignItems="center"
          style={field.display === 'flex' ? { flex: 1 } : undefined}
        >
          <Text variant="h4" as="h4">
            {formatText(field.label, application, formatMessage)}
          </Text>
          {field.tooltip && (
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatText(field.tooltip, application, formatMessage)}
              />
            </Box>
          )}
        </Box>
        <Box
          display={Array.isArray(values) ? 'block' : 'flex'}
          alignItems="center"
          style={field.display === 'flex' ? { flex: 1 } : undefined}
        >
          {Array.isArray(values) ? (
            (values as string[]).map((value) => (
              <Markdown key={value}>{value}</Markdown>
            ))
          ) : (
            <Markdown>{values}</Markdown>
          )}
        </Box>
      </Box>
      {field.divider && <Divider />}
    </>
  )
}
