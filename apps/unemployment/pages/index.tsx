import React from 'react'
import {
  Box,
  Input,
  Button,
  Text,
  Columns,
  Column
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { ApplicationService } from '../services/application.service'

export function Index() {
  const router = useRouter()

  const login = () => {
    // Check where the user is in the application
    const application = ApplicationService.getApplication()
    if (application && application.stepCompleted > 0) {
      router.push('/application/' + (+application.stepCompleted + 1).toString())
    }
    else {
      // User is starting their application
      router.push('/application/1')
    }
  }

  return (
    <Box paddingY={30}>
      <Text variant="h1" marginBottom={3}>Velkomin/n á vef atvinnuleysisbóta.</Text>
      <Text marginBottom={6}>Vinsamlegast skráðu þig inn rafrænt til að halda áfram</Text>
      <Box width="half">
        <Columns space={2} >
          <Column>
            <Input
              name="tel"
              placeholder="Símanúmer"
              data-cy="tel"
            />
          </Column>
          <Column>
            <Button onClick={login} variant="primary" data-cy="login-btn">
              Innskrá
            </Button>
          </Column>
        </Columns>
      </Box>
    </Box>
  )
}

export default Index
