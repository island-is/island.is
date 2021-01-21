import React from 'react'

import { RadioController } from '@island.is/shared/form-fields'
import {
  Box,
  Stack,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  CustomField,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

function HealthDeclaration({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  const { props } = field as { props: { title?: string; label: string } }
  return (
    <>
      {props.title && (
        <Box marginBottom={4}>
          <Text variant="h5">{props.title}</Text>
        </Box>
      )}
      <GridRow>
        <GridColumn span="9/12">
          <Text>{props.label}</Text>
        </GridColumn>
        <GridColumn span="3/12">
          <RadioController
            id={field.id}
            split="1/2"
            defaultValue={
              (getValueViaPath(application.answers, field.id) as string[]) ??
              undefined
            }
            options={[
              { label: 'Já', value: 'yes' },
              { label: 'Nei', value: 'no' },
            ]}
          />
        </GridColumn>
      </GridRow>
    </>
  )
}

export default HealthDeclaration
