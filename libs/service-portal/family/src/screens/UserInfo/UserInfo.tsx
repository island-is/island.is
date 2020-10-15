import React, { useState, useRef } from 'react'
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
// import { useNatRegGeneralLookup } from '@island.is/service-portal/graphql'
// import UserInfoSidebars from './UserInfoSidebars'
import * as styles from './UserInfo.treat'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { Modal } from '../../components/Modal'
import FileUploadshi from '../../components/Modal/FileUpload'

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

  const [showModal, setModal] = useState(false)

  const onClickEvent = () => {
    setModal(true)
  }

  const uploadPicForm = (mobile = false) => {
    return (
      <Box className={styles.uploadPictureContainer}>
        <Box
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          display="flex"
          padding={[2, 2, 2, 4]}
        >
          <Typography variant="h4">
            {mobile ? 'Veldu mynd' : 'Dragðu mynd hingað til að hlaða upp'}
          </Typography>
          <Typography variant="p">
            Tekið er við skjölum með endingu: .jpeg, .gif, .png
          </Typography>
          <Box paddingTop={[1, 1, 1, 4]}>
            <Button variant="ghost">Veljið mynd til að hlaða upp</Button>
          </Box>
        </Box>
      </Box>
    )
  }

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
            onClick={onClickEvent}
          >
            <Icon type="user" color="purple400" width={40} height={40} />
            <Icon type="calendar" color="purple400" width={20} height={20} />
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
        <Hidden below="sm">
          <Modal
            show={showModal}
            onCancel={() => setModal(false)}
            onContinue={() => {
              setModal(false)
            }}
            onClickOutside={() => {
              setModal(false)
            }}
            title="Skipta út mynd"
          >
            <FileUploadshi />
          </Modal>
        </Hidden>
        <Hidden above="xs">
          <FileUploadshi />
        </Hidden>

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
