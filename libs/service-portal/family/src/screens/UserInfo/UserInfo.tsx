import React, { useState } from 'react'
import { Typography, Box, Stack, Icon, Hidden } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoLine from '../../components/UserInfoLine/UserInfoLine'
// import { useNatRegGeneralLookup } from '@island.is/service-portal/graphql'
// import UserInfoSidebars from './UserInfoSidebars'
import * as styles from './UserInfo.treat'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'

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
  const { formatMessage } = useLocale()
  // const [activeSidebar, setActiveSidebar] = useState<UserInfoSidebarType>(null)
  // const { data: userNatReg } = useNatRegGeneralLookup(userInfo)

  // const handleSetActiveSidebar = (value: UserInfoSidebarType) =>
  //   setActiveSidebar(value)

  return (
    <>
      <Box marginBottom={6}>
        <Typography variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:my-info',
            defaultMessage: 'Mínar upplýsingar',
          })}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" marginBottom={4}>
        <Hidden below="sm">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight={5}
            borderRadius="circle"
            background="purple200"
            className={styles.avatar}
          >
            <Icon type="outline" icon="person" color="purple400" size="large" />
          </Box>
        </Hidden>
        <Typography variant="h2">{userInfo.profile.name}</Typography>
      </Box>
      <Stack space={1}>
        {/* <UserInfoLine
          label="Fæðingarstaður N/A"
          content={userNatReg?.city || ''}
        /> */}
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:display-name',
            defaultMessage: 'Birtingarnafn',
          })}
          content={userInfo.profile.name}
          editExternalLink="https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2"
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={userInfo.profile.natreg}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:citizenship',
            defaultMessage: 'Ríkisfang',
          })}
          content={
            userInfo.profile.nat === 'IS' ? 'Ísland' : userInfo.profile.nat
          }
        />
        {/* <UserInfoLine label="Hjúskaparstaða N/A" content="Þjóðskrá?" />
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
        /> */}
      </Stack>
      {/* <UserInfoSidebars
        activeSidebar={activeSidebar}
        onClose={handleSetActiveSidebar.bind(null, null)}
      /> */}
    </>
  )
}

export default SubjectInfo
