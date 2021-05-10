import React from 'react'
import { contractRejected } from '../../lib/messages'
import { ContractRejectedContainer, DescriptionText } from '../components'

const ParentBContractRejected = () => {
  return (
    <ContractRejectedContainer>
      <DescriptionText text={contractRejected.general.description} />
    </ContractRejectedContainer>
  )
}

export default ParentBContractRejected
