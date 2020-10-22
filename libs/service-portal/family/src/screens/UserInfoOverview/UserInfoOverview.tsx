import React from 'react'
import { Typography, Box, Stack } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoOverviewItem from '../../components/UserInfoItem/UserInfoOverview'
import { useLocale } from '@island.is/localization'
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
    </>
  )
}

export default SubjectInfo
