import React from 'react'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters/utils'
import { contractRejected } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { ContractRejectedContainer, DescriptionText } from '../components'

const ContractRejected = ({ application }: CRCFieldBaseProps) => {
  const { answers, externalData } = application
  const selectedChildren = getSelectedChildrenFromExternalData(
    externalData.nationalRegistry.data.children,
    answers.selectedChildren,
  )

  const otherParentName = selectedChildren[0].otherParent.fullName
  return (
    <ContractRejectedContainer>
      <DescriptionText
        text={contractRejected.general.description.applicant}
        format={{ otherParentName: otherParentName }}
      />
    </ContractRejectedContainer>
  )
}

export default ContractRejected
