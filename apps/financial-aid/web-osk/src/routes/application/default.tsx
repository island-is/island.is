import React, { useEffect, useState, useCallback } from 'react'
import { Text } from '@island.is/island-ui/core'

import { ContentContainer, Footer, FormLayout } from '../../components'

const BankInfoForm = () => {
  return (
    <FormLayout activeSection={6}>
      <ContentContainer>
        <Text as="h1" variant="h2">
          Titil
        </Text>
      </ContentContainer>

      <Footer previousUrl="/umsokn/netfang" />
    </FormLayout>
  )
}

export default BankInfoForm
