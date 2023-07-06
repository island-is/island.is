import React from 'react'

import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { getValueViaPath, formatText } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function HealthDeclaration({ field, application }: PropTypes): JSX.Element {
  const { formatMessage } = useLocale()
  const props = field.props as { title?: string; label: string }

  return (
    <>
      {props.title && (
        <Box marginBottom={4}>
          <Text variant="h5">
            {formatText(props.title, application, formatMessage)}
          </Text>
        </Box>
      )}
      <GridRow>
        <GridColumn span={['12/12', '8/12']} paddingBottom={1}>
          <Text>{formatText(props.label, application, formatMessage)}</Text>
        </GridColumn>
        <GridColumn span={['8/12', '3/12']} offset={['0', '1/12']}>
          <RadioController
            id={field.id}
            split="1/2"
            smallScreenSplit="1/2"
            largeButtons={false}
            defaultValue={
              (getValueViaPath(application.answers, field.id) as string[]) ??
              undefined
            }
            options={[
              {
                label: formatText(m.yes, application, formatMessage),
                value: 'yes',
              },
              {
                label: formatText(m.no, application, formatMessage),
                value: 'no',
              },
            ]}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}

export default HealthDeclaration
