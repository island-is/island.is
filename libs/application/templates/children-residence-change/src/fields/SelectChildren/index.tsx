import React from 'react'
import { useIntl } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { selectChildren } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const SelectChildren = ({ field, application, error }: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  const {
    externalData: { parentNationalRegistry, childrenNationalRegistry },
  } = application
  const otherParent = parentNationalRegistry.data
  const children = childrenNationalRegistry.data
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
        defaultValue={[]}
        error={error}
        large={true}
        options={children.map((c) => ({
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
