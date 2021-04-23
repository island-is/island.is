import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { selectChildren } from '../../lib/messages'
import { formatAddress } from '../../lib/utils'
import { CRCFieldBaseProps, Child, Address } from '../../types'
import { DescriptionText, InfoBanner } from '../components'

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

const SelectChildren = ({ field, application, error }: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  const {
    externalData: { nationalRegistry },
    answers,
  } = application
  const { address, children } = nationalRegistry.data
  const currentAnswer = answers.selectedChildren || []
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
        <DescriptionText text={selectChildren.general.description} />
      </Box>
      <Text variant="h3" marginBottom={2}>
        {formatMessage(selectChildren.checkboxes.title)}
      </Text>
      {childrenNotEligibleForTransfer && (
        <Box marginBottom={2}>
          <InfoBanner>
            <DescriptionText
              text={selectChildren.ineligible.text}
              textProps={{ variant: 'small', marginBottom: 0 }}
            />
          </InfoBanner>
        </Box>
      )}
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
          disabled: shouldBeDisabled(
            children,
            child,
            address,
            selectedChildrenState,
          ),
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
