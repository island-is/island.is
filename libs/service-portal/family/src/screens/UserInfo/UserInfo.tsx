import React, { useState } from 'react'
import {
  Typography,
  Box,
  Stack,
  Button,
  Icon,
  Hidden,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoLine from '../../components/UserInfoLine/UserInfoLine'
import { useNatRegGeneralLookup } from '@island.is/service-portal/graphql'
import UserInfoSidebars from './UserInfoSidebars'
import * as styles from './UserInfo.treat'

export type UserInfoSidebarType =
  | null
  | 'name'
  | 'religiousOrg'
  | 'islandInfo'
  | 'islandAuthInfo'
  | 'legalDomicile'
  | 'registeredGender'
  | 'banMarking'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const [activeSidebar, setActiveSidebar] = useState<UserInfoSidebarType>(null)
  const { data: userNatReg } = useNatRegGeneralLookup(userInfo)

  const handleSetActiveSidebar = (value: UserInfoSidebarType) =>
    setActiveSidebar(value)

  return (
    <>
      <Box marginBottom={4}>
        <Typography variant="h1" as="h1">
          Mínar upplýsingar
        </Typography>
      </Box>
      <Stack space={1}>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          paddingY={[2, 3]}
          paddingX={[3, 6]}
          border="standard"
          borderRadius="large"
        >
          <div>
            <Stack space={1}>
              <Typography variant="h3">{userInfo.user.profile.name}</Typography>
              <div>Kennitala: {userInfo.user.profile.natreg}</div>
              <Box marginTop={1}>
                <Button
                  variant="text"
                  size="small"
                  icon="external"
                  onClick={handleSetActiveSidebar.bind(null, 'name')}
                >
                  Breyta nafni
                </Button>
              </Box>
            </Stack>
          </div>
          <Hidden below="sm">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="circle"
              background="purple200"
              className={styles.avatar}
            >
              <Icon type="user" color="purple400" width={40} height={40} />
            </Box>
          </Hidden>
        </Box>
        <UserInfoLine
          label="Fæðingarstaður N/A"
          content={userNatReg?.city || ''}
        />
        <UserInfoLine
          label="Ríkisfang"
          content={
            userInfo.user.profile.nat === 'IS'
              ? 'Ísland'
              : userInfo.user.profile.nat
          }
        />
        <UserInfoLine label="Hjúskaparstaða N/A" content="Þjóðskrá?" />
        <UserInfoLine
          label="Kyn N/A"
          content={userNatReg?.gender || ''}
          onEdit={handleSetActiveSidebar.bind(null, 'registeredGender')}
        />
        <UserInfoLine
          label="Trúfélag / lífsskoðunarfélag N/A"
          content="Þjóðskrá?"
          onEdit={handleSetActiveSidebar.bind(null, 'religiousOrg')}
        />
        <UserInfoLine
          label="Bannmerking N/A"
          content="Þjóðskrá?"
          onEdit={handleSetActiveSidebar.bind(null, 'banMarking')}
        />
      </Stack>
      <Box marginTop={6} marginBottom={3}>
        <Typography variant="h3">Lögheimili og tengiliðsupplýsingar</Typography>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label="Heimilisfang N/A"
          content={userNatReg?.address || ''}
          onEdit={handleSetActiveSidebar.bind(null, 'legalDomicile')}
        />
        <UserInfoLine
          label="Póstnúmer N/A"
          content={userNatReg?.postalcode.toString() || ''}
        />
        <UserInfoLine
          label="Borg N/A"
          content={userNatReg?.city || ''}
          onEdit={handleSetActiveSidebar.bind(null, 'legalDomicile')}
        />
        <UserInfoLine
          label="Símanúmer N/A"
          content="innskraning.island?"
          onEdit={handleSetActiveSidebar.bind(null, 'islandInfo')}
        />
        <UserInfoLine
          label="Netfang N/A"
          content="innskraning.island?"
          onEdit={handleSetActiveSidebar.bind(null, 'islandInfo')}
        />
      </Stack>
      <UserInfoSidebars
        activeSidebar={activeSidebar}
        onClose={handleSetActiveSidebar.bind(null, null)}
      />
    </>
  )
}

export default SubjectInfo
