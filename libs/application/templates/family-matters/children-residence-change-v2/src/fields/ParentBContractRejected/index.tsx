import React from 'react'
import { contractRejected } from '../../lib/messages'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { ContractRejectedContainer } from '../components'

const ParentBContractRejected = () => {
  return (
    <ContractRejectedContainer>
      <DescriptionText text={contractRejected.general.description} />
    </ContractRejectedContainer>
  )
}

export default ParentBContractRejected
