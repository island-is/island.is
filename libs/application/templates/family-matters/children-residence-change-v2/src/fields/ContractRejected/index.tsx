import React from 'react'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { contractRejected } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { ContractRejectedContainer } from '../components'

const ContractRejected = ({ application }: CRCFieldBaseProps) => {
  const { answers, externalData } = application
  const selectedChildren = getSelectedChildrenFromExternalData(
    externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )

  const otherParentName = selectedChildren[0]?.otherParent?.fullName || ''
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
