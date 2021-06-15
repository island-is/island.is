import React, { useEffect, useState, useCallback } from 'react'
import { Text } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../components'

const BankInfoForm = () => {
  return (
    <FormLayout activeSection={6}>
      <FormContentContainer>
        <Text as="h1" variant="h2">
          Titil
        </Text>
      </FormContentContainer>

      <FormFooter previousUrl="/umsokn/netfang" />
    </FormLayout>
  )
}

export default BankInfoForm
