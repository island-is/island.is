import React, { useState } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import {
  Child,
  Address,
} from '@island.is/application/templates/family-matters/types'
import { formatAddress } from '@island.is/application/templates/family-matters/utils'
import {
  DescriptionText,
  InfoBanner,
} from '@island.is/application/templates/family-matters/components'

const allChildrenLiveWithBothParents = (
  applicantAddress: Address,
  children: Child[],
) => {
  const formattedApplicantAddress = formatAddress(applicantAddress)
  return children.every(
    (child) =>
      formatAddress(child.otherParent.address) === formattedApplicantAddress,
  )
}

const shouldBeDisabled = (
  children: Child[],
  childOption: Child,
  applicantAddress: Address,
  selectedChildren?: string[],
) => {
  // If the applicant and the other parent live together
  // it should not be possible to request a transfer for the children
  const formattedApplicantAddress = formatAddress(applicantAddress)
  const formattedOtherParentAddress = formatAddress(
    childOption.otherParent.address,
  )
  if (formattedApplicantAddress === formattedOtherParentAddress) {
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
  address: Address
  translations: {
    title: MessageDescriptor
    description: MessageDescriptor
    ineligible: MessageDescriptor
    checkBoxSubLabel: MessageDescriptor
  }
  currentAnswer?: string[]
  error?: string
}

const SelectChildren = ({
  id,
  children,
  address,
  translations,
  currentAnswer = [],
  error,
}: Props) => {
  const { formatMessage } = useIntl()
  const [selectedChildrenState, setSelectedChildrenState] = useState<string[]>(
    currentAnswer,
  )
  const childrenNotEligibleForTransfer = allChildrenLiveWithBothParents(
    address,
    children,
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
        options={children.map((child) => ({
          value: child.nationalId,
          label: child.fullName,
          disabled: shouldBeDisabled(
            children,
            child,
            address,
            selectedChildrenState,
          ),
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
