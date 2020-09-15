import React from 'react'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoCard from './cards/UserInfo'
import ResidenceInfoCard from './cards/ResidenceInfo'
import FamilyInfoCard from './cards/FamilyInfo'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  return (
    <>
      <Box marginBottom={7}>
        <Typography variant="h1" as="h1">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={3}>
        <UserInfoCard userInfo={userInfo} />
        <ResidenceInfoCard userInfo={userInfo} />
        <FamilyInfoCard userInfo={userInfo} />
      </Stack>
    </>
  )
}

export default SubjectInfo
