import React from 'react'
import { Box, Checkbox, Text } from '@island.is/island-ui/core'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { selectChildren } from '../../lib/messages'
import { FieldComponents, FieldTypes } from '@island.is/application/types'

export const SelectChildren = ({
  field,
  application,
  error,
}: any) => {
  const {
    externalData: { childrenCustodyInformation },
    answers,
  } = application
  console.log('application', application)
  const children = childrenCustodyInformation.data
  const childrenCheckboxes = children.map((x: any) => {
    return {
      value: x.fullName,
      label:  x.fullName,
      subLabel: `${selectChildren.checkboxes.subLabel.defaultMessage} ${x.otherParent.fullName}`
    }
  })
  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: 'children',
            title: 'Children',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: childrenCheckboxes,
          }}
        />
      </Box>
    </Box>
  )
}