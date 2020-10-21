import React from 'react'
import {
  Typography,
  Box,
  Stack,
  Button,
  Icon,
  Inline,
  GridContainer,
  GridRow,
  GridColumn,
  ArrowLink,
  Hidden,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { MockUserInfoList, userInfoItem } from './MockUserInfoList'
import * as styles from './UserInfo.treat'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()

  const userInfoItem = (
    key: string,
    headingMessageId: string,
    headingDefaultMessage: string,
    subtextId: string,
    subtextDefaultMessage: string,
    link: string,
    image: string,
  ) => {
    return (
      <GridRow key={key}>
        <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
          <Box marginBottom={2}>
            <Typography variant="h2" as="h2">
              {formatMessage({
                id: headingMessageId,
                defaultMessage: headingDefaultMessage,
              })}
            </Typography>
          </Box>
          <Typography variant="p" as="p">
            {formatMessage({
              id: subtextId,
              defaultMessage: subtextDefaultMessage,
            })}
          </Typography>
          <Box marginTop={[3, 4]}>
            <ArrowLink href={link}>
              {formatMessage('service.portal:continue-button')}
            </ArrowLink>
          </Box>
        </GridColumn>
        <GridColumn span={['0', '0', '2/12', '2/12']} offset={'1/12'}>
          <Box>
            <img src={image} />
          </Box>
        </GridColumn>
      </GridRow>
    )
  }

  return (
    <>
      <Box marginBottom={6}>
        <Box marginBottom={1}>
          <Typography variant="h1" as="h1">
            {formatMessage({
              id: 'service.portal:my-data',
              defaultMessage: 'Mín gögn',
            })}
          </Typography>
        </Box>
        <Typography variant="p" as="p">
          {formatMessage({
            id: 'service.portal:my-data-subtext',
            defaultMessage:
              'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum',
          })}
        </Typography>
      </Box>
      <Stack space={15}>
        {MockUserInfoList.map((UserInfoItem: userInfoItem, index) => (
          <Box key={index}>
            {userInfoItem(
              `${UserInfoItem.image}${index}`,
              UserInfoItem.headingMessageId,
              UserInfoItem.headingDefaultMessage,
              UserInfoItem.subtextId,
              UserInfoItem.subtextDefaultMessage,
              UserInfoItem.link,
              UserInfoItem.image,
            )}
          </Box>
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
