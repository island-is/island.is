import React from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { selectChildren } from '../../lib/messages'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
} from '../../lib/utils'
import { DescriptionText } from '../components'

const SelectChildren = ({ field, application, error }: FieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useLocale()
  const otherParent = extractParentFromApplication(application)
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={selectChildren.general.description} />
      </Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(selectChildren.checkboxes.title)}
      </Text>
      <CheckboxController
        id={id}
        disabled={disabled}
        name={`${id}`}
        error={error}
        large={true}
        options={extractChildrenFromApplication(application).map((c) => ({
          value: c.name,
          label: c.name,
          subLabel: formatMessage(selectChildren.checkboxes.subLabel, {
            parentName: otherParent.name,
          }),
        }))}
      />
    </>
  )
}

export default SelectChildren
