import React from 'react'
import {
  Typography,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import UserInfoOverviewItem from '../../components/UserInfoItem/UserInfoItem'
import { useLocale } from '@island.is/localization'
import { mockUserInfoList } from './mockUserInfoList'

const UserInfoOverview: ServicePortalModuleComponent = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={[6, 6, 10]}>
        <Box>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <Stack space={2}>
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
              </Stack>
            </GridColumn>
          </GridRow>
        </Box>
        {mockUserInfoList.map((item, index) => (
          <UserInfoOverviewItem
            key={index}
            heading={item.heading}
            subtext={item.subtext}
            link={item.link}
            image={item.image}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default UserInfoOverview
