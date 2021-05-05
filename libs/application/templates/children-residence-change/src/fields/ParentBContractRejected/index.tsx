import React from 'react'
import { contractRejected } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { ContractRejectedContainer, DescriptionText } from '../components'

const ParentBContractRejected = ({}: CRCFieldBaseProps) => {
  return (
    <ContractRejectedContainer>
      <DescriptionText text={contractRejected.general.description} />
    </ContractRejectedContainer>
  )
}

export default ParentBContractRejected
