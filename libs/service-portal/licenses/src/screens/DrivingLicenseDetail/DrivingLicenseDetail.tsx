import { info } from "kennitala";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import { defineMessage } from "react-intl";

import {
  AlertBanner,
  Box,
  Button,
  Divider,
  Icon,
  Link,
  Stack,
  Text
} from "@island.is/island-ui/core";
import { useLocale, useNamespaces } from "@island.is/localization";
import {
  IntroHeader,
  ServicePortalModuleComponent,
  UserInfoLine
} from "@island.is/service-portal/core";
import { useDrivingLicense } from "@island.is/service-portal/graphql";

import { PkPass } from "../../components/QRCodeModal/PkPass";
import { m } from "../../lib/messages";
import { mapCategory } from "../../utils/dataMapper";
import { isExpired, toDate } from "../../utils/dateUtils";
import ExpandableLine from "./ExpandableLine";

const DrivingLicenseDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useDrivingLicense()
  const licenseExpired = data && isExpired(new Date(), new Date(data.gildirTil))

  const { age } = info(data?.kennitala ?? userInfo.profile.nationalId)

  const renewalLink =
    age >= 70
      ? 'https://island.is/endurnyjun-oekuskirteina-fyrir-70-ara-og-eldri'
      : 'https://island.is/endurnyjun-okuskirteina'

  return (
    <>
      {error && !loading && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetchingDrivingLicense)}
            variant="error"
          />
        </Box>
      )}
      <IntroHeader
        title={m.yourDrivingLicense}
        intro={m.drivingLicenseDescription}
      />
      {data && (
        <Stack space={2}>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            alignItems={['flexStart', 'center']}
          >
            <PkPass
              expireDate={toDate(
                loading ? '' : new Date(data.gildirTil).getTime().toString(),
              )}
            />
            <Box marginX={[0, 1]} marginY={[1, 0]} />
            <Link href={renewalLink}>
              <Button
                variant="utility"
                size="small"
                icon="open"
                iconType="outline"
              >
                {formatMessage(m.renewDrivingLicense)}
              </Button>
            </Link>
          </Box>
          <UserInfoLine
            title={formatMessage(m.drivingLicenseBaseInfo)}
            label={defineMessage(m.number)}
            content={data?.id.toString()}
            loading={loading}
            titlePadding={3}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <UserInfoLine
            label={m.issueDate}
            content={
              data &&
              toDate(new Date(data.utgafuDagsetning).getTime().toString())
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
                      : new Date(data.gildirTil).getTime().toString(),
                  )}
                </Text>
                <Box
                  marginLeft={2}
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
            label={formatMessage(m.issuedBy)}
            content={data.nafnUtgafustadur}
            loading={loading}
            paddingBottom={1}
            labelColumnSpan={['1/1', '6/12']}
            valueColumnSpan={['1/1', '6/12']}
          />
          <Divider />
          <Box marginY={3} />
          <Box position="relative" paddingTop={1} paddingRight={4}>
            <Text variant="eyebrow">{formatMessage(m.licenseCategories)}</Text>
          </Box>

          {data?.rettindi.map(
            (item: {
              id: React.Key | null | undefined
              utgafuDags: string | number | Date
              gildirTil: string | number | Date
              nr: string | undefined
            }) => {
              return (
                <ExpandableLine
                  key={item.nr}
                  licenseIssued={formatMessage(m.issueDate)}
                  licenseExpire={formatMessage(m.expireDate)}
                  issuedDate={toDate(
                    new Date(item.utgafuDags).getTime().toString(),
                  )}
                  expireDate={toDate(
                    new Date(item.gildirTil).getTime().toString(),
                  )}
                  category={item.nr?.trim()}
                >
                  {item.nr &&
                    ReactHtmlParser(mapCategory(item.nr.trim()).text ?? '')}
                </ExpandableLine>
              )
            },
          )}
        </Stack>
      )}
    </>
  )
}

export default DrivingLicenseDetail
