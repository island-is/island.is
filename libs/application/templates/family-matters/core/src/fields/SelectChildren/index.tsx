import React, { useState } from 'react'
import { MessageDescriptor, useIntl, IntlFormatters } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { DescriptionText, InfoBanner } from '../../components'
import { sortChildrenByAge } from '../../utils'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'

const shouldBeDisabled = (
  children: ApplicantChildCustodyInformation[],
  childOption: ApplicantChildCustodyInformation,
  selectedChildren?: string[],
) => {
  if (childOption.livesWithBothParents || !childOption.otherParent) {
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
    firstSelectedChild?.otherParent?.nationalId !==
      childOption.otherParent?.nationalId
  ) {
    return true
  }
  return false
}

interface Props {
  id: string
  children: ApplicantChildCustodyInformation[]
  translations: {
    title: MessageDescriptor
    description: MessageDescriptor
    ineligible: MessageDescriptor
    checkBoxSubLabel: MessageDescriptor
    soleCustodySubLabel: MessageDescriptor
    livesWithBothParents?: MessageDescriptor
    soleCustodyTooltip?: MessageDescriptor
  }
  currentAnswer?: string[]
  error?: string
}

const checkboxInfoText = (
  child: ApplicantChildCustodyInformation,
  formatMessage: IntlFormatters['formatMessage'],
  translations: Props['translations'],
) => {
  const {
    soleCustodySubLabel,
    soleCustodyTooltip,
    checkBoxSubLabel,
    livesWithBothParents,
  } = translations
  const defaultSubLabel = formatMessage(checkBoxSubLabel, {
    parentName: child.otherParent?.fullName,
  })
  if (!child.otherParent) {
    return {
      subLabel: formatMessage(soleCustodySubLabel),
      tooltip:
        soleCustodyTooltip &&
        formatMessage(soleCustodyTooltip, {
          childName: child.fullName,
        }),
    }
  } else if (child.livesWithBothParents) {
    return {
      subLabel: defaultSubLabel,
      tooltip:
        livesWithBothParents &&
        formatMessage(livesWithBothParents, {
          childName: child.fullName,
        }),
    }
  }
  return {
    subLabel: defaultSubLabel,
  }
}

const SelectChildren = ({
  id,
  children,
  translations,
  currentAnswer = [],
  error,
}: Props) => {
  const { formatMessage } = useIntl()
  const [selectedChildrenState, setSelectedChildrenState] =
    useState<string[]>(currentAnswer)
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
          tooltip: checkboxInfoText(child, formatMessage, translations).tooltip,
          disabled: shouldBeDisabled(children, child, selectedChildrenState),
          subLabel: checkboxInfoText(child, formatMessage, translations)
            .subLabel,
        }))}
        onSelect={(newAnswer) => setSelectedChildrenState(newAnswer)}
      />
    </>
  )
}

export default SelectChildren
