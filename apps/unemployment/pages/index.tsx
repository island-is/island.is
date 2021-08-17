import React from 'react'
import {
  Box,
  Input,
  Button,
  Text
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
    <Box>
      <Text>Velkomin/n á vef atvinnuleysisbóta.</Text>
      <Text>Vinsamlegast skráðu þig inn rafrænt til að halda áfram</Text>
      <Input
        name="tel"
        placeholder="Símanúmer"
        data-cy="tel"
        />
      <Box>
          <Button onClick={login} width="fluid">
            Innskrá
          </Button>
        </Box>
      </Box>
  )
}

export default Index
