import React from 'react'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import UserInfoOverviewItem from '../../components/UserInfoItem/UserInfoOverview'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { MockUserInfoList, userInfoItem } from './mockUserInfoList'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Box marginBottom={10}>
        <Typography variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:my-info-my-data',
            defaultMessage: 'Mín gögn',
          })}
        </Typography>
        <Typography variant="p" as="p">
          {formatMessage({
            id: 'service.portal:my-info-my-data-subtext',
            defaultMessage:
              'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum',
          })}
        </Typography>
      </Box>
      <Stack space={10}>
        {MockUserInfoList.map((UserInfoItem: userInfoItem, index: number) => (
          <UserInfoOverviewItem
            key={index}
            heading={UserInfoItem.heading}
            subtext={UserInfoItem.subtext}
            link={UserInfoItem.link}
            image={UserInfoItem.image}
          />
        ))}
      </Stack>

      {/* <Stack space={1}>
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
      </Stack> */}
    </>
  )
}

export default SubjectInfo
