import React from 'react'
import { useDrivingLicense } from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { toDate } from '../../utils/dateUtils'
import * as styles from '../DrivingLicense/DrivingLicense.css'

const DrivingLicenseDetail: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useDrivingLicense()
  console.log('data', data)
  console.log('loading', loading)
  console.log('error', error)

  if (error)
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.driving-license:driving-license-not-found',
          defaultMessage: 'Ökuréttindi fundust ekki',
        })}
      />
    )

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {loading ? (
        <Box>
          <LoadingDots large />
        </Box>
      ) : (
        <>
          <Box marginBottom={5}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
                <Stack space={1}>
                  <Text variant="h3" as="h1" paddingTop={0}>
                    {formatMessage({
                      id: 'sp.driving-license:driving-license-title',
                      defaultMessage: 'Ökuréttindin þín',
                    })}
                  </Text>
                  <Text as="p" variant="default">
                    {formatMessage({
                      id: 'sp.driving-license:driving-license-description',
                      defaultMessage:
                        'Hér birtast upplýsingar um ökuskírteini þitt ásam þeim ökuréttidnum sem þú ert með í gildi á hverjum tíma.',
                    })}
                  </Text>
                </Stack>
              </GridColumn>
            </GridRow>
          </Box>
          <Stack space={2}>
            <UserInfoLine
              title={formatMessage({
                id: 'sp.driving-license:license-base-info',
                defaultMessage: 'Grunnupplýsingar ökuskírteinis',
              })}
              label={defineMessage({
                id: 'sp.driving-license:license-number',
                defaultMessage: 'Númer',
              })}
              content={data?.id}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage({
                id: 'sp.driving-license:license-issued',
                defaultMessage: 'Útgáfudagur',
              })}
              content={data && toDate(data.issued)}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage({
                id: 'sp.driving-license:license-expire',
                defaultMessage: 'Lokadagur',
              })}
              content={data && toDate(data.expires)}
              loading={loading}
            />
            <Divider />
            <Box marginY={3} />
            <Box position="relative" paddingY={1} paddingRight={4}>
              <Text variant="eyebrow" paddingBottom={2}>
                {formatMessage({
                  id: 'sp.driving-license:license-categories-title',
                  defaultMessage: 'Réttindaflokkar',
                })}
              </Text>

              <GridRow align={['flexStart', 'center']}>
                <GridColumn order={1} span={['8/12', '3/12']}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    overflow="hidden"
                  >
                    <Text variant="h5" as="span" lineHeight="lg">
                      {data && data.categories[0].name}
                    </Text>
                  </Box>
                </GridColumn>
                <GridColumn order={[3, 2]} span={['1/1', '3/12']}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    width="full"
                    className={styles.content}
                    overflow="hidden"
                  >
                    {loading ? (
                      <LoadingDots />
                    ) : (
                      <Text variant="default">
                        {data && toDate(data.categories[0].issued)}
                      </Text>
                    )}
                  </Box>
                </GridColumn>
                <GridColumn order={[3, 2]} span={['1/1', '3/12']}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height="full"
                    width="full"
                    className={styles.content}
                    overflow="hidden"
                  >
                    {loading ? (
                      <LoadingDots />
                    ) : (
                      <Text variant="default">!!!!</Text>
                    )}
                  </Box>
                </GridColumn>
                <GridColumn order={4} span={['1/1', '3/12']}>
                  <Box
                    display="flex"
                    justifyContent={['flexStart', 'flexEnd']}
                    alignItems="center"
                    height="full"
                  >
                    <Button variant="text" size="small">
                      +
                    </Button>
                  </Box>
                </GridColumn>
              </GridRow>
            </Box>
            <Divider />
          </Stack>
        </>
      )}
    </>
  )
}

export default DrivingLicenseDetail
