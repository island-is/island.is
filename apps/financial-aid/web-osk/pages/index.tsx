import React, { useContext, useEffect } from 'react'
import { Button, Text } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'
import { ContentContainer } from '@island.is/financial-aid-web/osk/src/components'

const Index = () => {
  const router = useRouter()
  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  return (
    <ContentContainer>
      <Text as="h1" variant="h2" marginBottom={2}>
        Abbabba þú hefur villst
      </Text>

      <Button
        onClick={() => {
          router.push('/umsokn')
        }}
        data-testid="logout-button"
        preTextIconType="filled"
        type="button"
        variant="primary"
      >
        heim
      </Button>
    </ContentContainer>
  )
}

export default Index
