import React from 'react'

import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'

import { contractRejected } from '../../lib/messages'
import { ContractRejectedContainer } from '../components'

const ParentBContractRejected = () => {
  return (
    <ContractRejectedContainer>
      <DescriptionText text={contractRejected.general.description} />
    </ContractRejectedContainer>
  )
}

export default ParentBContractRejected
