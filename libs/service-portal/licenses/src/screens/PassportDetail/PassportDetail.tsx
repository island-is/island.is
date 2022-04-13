import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Text,
  Button,
  AlertBanner,
  Link,
} from '@island.is/island-ui/core'
import {
  PlausiblePageviewDetail,
  ServicePortalModuleComponent,
  ServicePortalPath,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { isExpired, toDate } from '../../utils/dateUtils'
import * as styles from '../../components/DrivingLicense/DrivingLicense.css'
import { m } from '../../lib/messages'
import { passportDetail, passportDetailChildren } from '../../mock/passport'
import { useLocation } from 'react-router-dom'

const PassportDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const findIdArr = pathname.split('/')
  const findId = findIdArr[findIdArr.length - 1]

  //const { data, loading, error } = useDrivingLicense()
  let data = passportDetail
  const childrenData = passportDetailChildren.find((x) => x.number === findId)

  const loading = false
  const error = false
  const isChild = pathname.includes('barna')
  if (isChild && childrenData) data = childrenData

  PlausiblePageviewDetail(
    ServicePortalPath.LicensesDrivingDetail.replace(':id', 'detail'),
  )

  const licenseExpired =
    data && isExpired(new Date(), new Date(data.expirationDate))

  return (
    <>
      {error && !loading && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetchingPassport)}
            variant="error"
          />
        </Box>
      )}
      <Box marginBottom={3}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '5/8', '5/8']}>
            <Stack space={1}>
              <Text variant="h3" as="h1" paddingTop={0}>
                {isChild
                  ? formatMessage(m.passportCardTitle)
                  : data.type + ' ' + data.subType}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(m.passportDescription)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {data && (
        <Stack space={2}>
          {licenseExpired && (
            <GridRow>
              <GridColumn span={['12/12', '12/12', '5/8', '5/8']}>
                <Box marginBottom={5}>
                  <AlertBanner
                    variant="info"
                    title={formatMessage(m.passportExpired)}
                    description={formatMessage(m.passportExpiredText)}
                  />
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Link href={'#'}>
                    <Button
                      variant="text"
                      size="small"
                      icon="open"
                      iconType="outline"
                    >
                      {formatMessage(m.passportRenew)}
                    </Button>
                  </Link>
                </Box>
              </GridColumn>
            </GridRow>
          )}
          <UserInfoLine
            label={defineMessage(m.passportName)}
            content={data?.displayFirstName + ' ' + data?.displayLastName}
            loading={loading}
            titlePadding={3}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.passportNumberShort}
            content={data?.number}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.issueDate}
            content={
              data && toDate(new Date(data.issuingDate).getTime().toString())
            }
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.expireDate}
            renderContent={() => (
              <Box display="flex" alignItems="center">
                <Text>
                  {toDate(
                    loading
                      ? ''
                      : new Date(data.expirationDate).getTime().toString(),
                  )}
                </Text>
                <Box
                  marginLeft={3}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  textAlign="center"
                >
                  <Box
                    marginRight={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                  >
                    <Icon
                      icon={licenseExpired ? 'closeCircle' : 'checkmarkCircle'}
                      color={licenseExpired ? 'red600' : 'mint600'}
                      type="filled"
                    />
                  </Box>
                  <Text variant="eyebrow">
                    {licenseExpired
                      ? formatMessage(m.isExpired)
                      : formatMessage(m.isValid)}
                  </Text>
                </Box>
              </Box>
            )}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(m.passportNameComputer)}
            content={data.mrzLastName + ' ' + data.mrzFirstName}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(m.passportGender)}
            content={data.sex}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(m.issuedBy)}
            content={'Þjóðskrá'}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <Box marginY={3} />
        </Stack>
      )}
    </>
  )
}

export default PassportDetail
