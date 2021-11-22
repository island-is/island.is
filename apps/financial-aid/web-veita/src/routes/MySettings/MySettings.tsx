import React, { useContext, useState } from 'react'

import {
  ApplicationOverviewSkeleton,
  LoadingContainer,
} from '@island.is/financial-aid-web/veita/src/components'
import { Text, Box, Input } from '@island.is/island-ui/core'
import { AdminContext } from '../../components/AdminProvider/AdminProvider'

interface mySettingsState {
  myNationalId?: string
  myName?: string
  myEmail?: string
  myNickName?: string
  hasError: boolean
  hasSubmitError: boolean
}

export const MySettings = () => {
  const { admin } = useContext(AdminContext)

  const [state, setState] = useState<mySettingsState>({
    myNationalId: admin?.staff?.nationalId,
    myName: admin?.staff?.name,
    myEmail: admin?.staff?.email,
    myNickName: admin?.staff?.nickname,
    hasError: false,
    hasSubmitError: false,
  })

  return (
    <LoadingContainer
      isLoading={false}
      loader={<ApplicationOverviewSkeleton />}
    >
      <Box marginTop={15} marginBottom={2} className={``}>
        <Text as="h1" variant="h1">
          Mínar stillingar
        </Text>
      </Box>
    </LoadingContainer>
  )
}

export default MySettings
