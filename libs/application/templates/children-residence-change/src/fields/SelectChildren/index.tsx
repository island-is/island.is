import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { selectChildren } from '../../lib/messages'
import { CRCFieldBaseProps, Child } from '../../types'
import { DescriptionText } from '../components'

const shouldBeDisabled = (
  children: Child[],
  childOption: Child,
  selectedChildren?: string[],
) => {
  if (!selectedChildren || selectedChildren?.length === 0) {
    return false
  }
  const firstSelectedChild = children.find(
    (child) => selectedChildren[0] === child.nationalId,
  )
  if (
    firstSelectedChild?.livesWithApplicant !== childOption.livesWithApplicant ||
    firstSelectedChild?.otherParent.nationalId !==
      childOption.otherParent.nationalId
  ) {
    return true
  }
  return false
}

const SelectChildren = ({ field, application, error }: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  const {
    externalData: { nationalRegistry },
    answers,
  } = application
  const children = nationalRegistry.data.children
  const currentAnswer = answers.selectedChildren || []
  const [selectedChildrenState, setSelectedChildrenState] = useState<string[]>(
    currentAnswer,
  )

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
        defaultValue={selectedChildrenState}
        error={error}
        large={true}
        options={children.map((child) => ({
          value: child.nationalId,
          label: child.fullName,
          disabled: shouldBeDisabled(children, child, selectedChildrenState),
          subLabel: formatMessage(selectChildren.checkboxes.subLabel, {
            parentName: child.otherParent.fullName,
          }),
        }))}
        onSelect={(newAnswer) => setSelectedChildrenState(newAnswer)}
      />
    </>
  )
}

export default SelectChildren
