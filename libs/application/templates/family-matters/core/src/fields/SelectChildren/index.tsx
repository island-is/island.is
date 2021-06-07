import React, { useState } from 'react'
import kennitala from 'kennitala'
import { MessageDescriptor, useIntl } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import {
  Child,
  Address,
} from '@island.is/application/templates/family-matters-core/types'
import {
  DescriptionText,
  InfoBanner,
} from '@island.is/application/templates/family-matters-core/components'
import { sortChildrenByAge } from '@island.is/application/templates/family-matters-core/utils'

const shouldBeDisabled = (
  children: Child[],
  childOption: Child,
  selectedChildren?: string[],
) => {
  if (childOption.livesWithBothParents) {
    return true
  }
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

interface Props {
  id: string
  children: Child[]
  translations: {
    title: MessageDescriptor
    description: MessageDescriptor
    ineligible: MessageDescriptor
    checkBoxSubLabel: MessageDescriptor
    livesWithBothParents?: MessageDescriptor
  }
  currentAnswer?: string[]
  error?: string
}

const SelectChildren = ({
  id,
  children,
  translations,
  currentAnswer = [],
  error,
}: Props) => {
  const { formatMessage } = useIntl()
  const [selectedChildrenState, setSelectedChildrenState] = useState<string[]>(
    currentAnswer,
  )
  const childrenNotEligibleForTransfer = children.every(
    (child) => child.livesWithBothParents,
  )

  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={translations.description} />
      </Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(translations.title)}
      </Text>
      {childrenNotEligibleForTransfer && (
        <Box marginBottom={2}>
          <InfoBanner>
            <DescriptionText
              text={translations.ineligible}
              textProps={{ variant: 'small', marginBottom: 0 }}
            />
          </InfoBanner>
        </Box>
      )}
      <CheckboxController
        id={id}
        name={`${id}`}
        defaultValue={selectedChildrenState}
        error={error}
        large={true}
        options={sortChildrenByAge(children).map((child) => ({
          value: child.nationalId,
          label: child.fullName,
          tooltip:
            child.livesWithBothParents &&
            translations.livesWithBothParents &&
            formatMessage(translations.livesWithBothParents, {
              childName: child.fullName,
            }),
          disabled: shouldBeDisabled(children, child, selectedChildrenState),
          subLabel: formatMessage(translations.checkBoxSubLabel, {
            parentName: child.otherParent.fullName,
          }),
        }))}
        onSelect={(newAnswer) => setSelectedChildrenState(newAnswer)}
      />
    </>
  )
}

export default SelectChildren
