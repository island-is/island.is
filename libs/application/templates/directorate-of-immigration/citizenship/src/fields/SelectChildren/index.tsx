import React from 'react'
import { Box, Tag } from '@island.is/island-ui/core'
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
      value: x.nationalId,
      label:  x.fullName,
      subLabel: `${selectChildren.checkboxes.subLabel.defaultMessage} ${x.otherParent.fullName}`,
      rightContent: <Tag outlined>{`Ríkisfang: ${x.citizenship.name}`}</Tag>
    }
  })

  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: field.id,
            title: 'Children',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: childrenCheckboxes,
            onSelect: (newAnswer) => {return { ...answers, selectedChildren: newAnswer}}
          }}
        />
      </Box>
    </Box>
  )
}