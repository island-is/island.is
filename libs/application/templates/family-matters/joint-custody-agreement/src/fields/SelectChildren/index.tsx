import React from 'react'
import { SelectChildren } from '@island.is/application/templates/family-matters-core/fields'
import { selectChildren } from '../../lib/messages'
import { JCAFieldBaseProps } from '../../types'

const JCASelectChildren = ({
  field,
  application,
  error,
}: JCAFieldBaseProps) => {
  const {
    externalData: { nationalRegistry },
    answers,
  } = application
  const { children } = nationalRegistry.data
  return (
    <SelectChildren
      id={field.id}
      children={children}
      error={error}
      currentAnswer={answers.selectedChildren}
      translations={{
        title: selectChildren.checkboxes.title,
        description: selectChildren.general.description,
        ineligible: selectChildren.ineligible.text,
        checkBoxSubLabel: selectChildren.checkboxes.subLabel,
        // TODO: fix this translation
        soleCustodySubLabel: selectChildren.checkboxes.subLabel,
      }}
    />
  )
}

export default JCASelectChildren
