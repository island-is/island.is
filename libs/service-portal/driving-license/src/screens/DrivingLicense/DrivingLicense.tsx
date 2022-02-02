import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Link,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './DrivingLicense.css'
import { getExpiresIn, toDate } from '../../utils/dateUtils'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useRouter } from 'next/router'

const DrivingLicenseQuery = gql`
  query DrivingLicenseQuery {
    drivingLicense {
      id
      name
      issued
      expires
      categories {
        name
        issued
        expires
      }
    }
  }
`

const DrivingLicense: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.driving-license')
  const router = useRouter()
  const { formatMessage } = useLocale()
  const [currentDate] = useState(new Date())
  const { data } = useQuery<Query>(DrivingLicenseQuery)
  const { drivingLicense } = data || {}

  if (!drivingLicense) {
    return null
  }

  const { id, expires } = drivingLicense

  const drivingLicenceImg =
    'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg?w=100&h=100&fit=pad&bg=white&fm=png'

  const expiresIn = getExpiresIn(currentDate, new Date(2022, 6, 22))

  return (
    <>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/8', '6/8']} paddingBottom={5}>
          <Stack space={2}>
            <Text variant="h3" as="h1">
              {formatMessage({
                id: 'sp.driving-license:title',
                defaultMessage: 'Þín skírteini',
              })}
            </Text>
            <Text as="p">
              {formatMessage({
                id: 'sp.driving-license:overview-subtext',
                defaultMessage:
                  'Hér gefur að líta núverandi skírteini þín og gildistíma þeirra.',
              })}
            </Text>
          </Stack>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="12/12">
          <Stack space={2}>
            <Box
              border="standard"
              borderRadius="large"
              padding={4}
              display="flex"
              justifyContent="spaceBetween"
            >
              <Box
                display="flex"
                justifyContent="flexStart"
                flexDirection="row"
              >
                <img
                  className={styles.image}
                  src={drivingLicenceImg}
                  alt={formatMessage({
                    id: 'sp.driving-license:license',
                    defaultMessage: 'Ökuréttindi',
                  })}
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="spaceBetween"
                >
                  <Text variant="h4" as="h2">
                    {formatMessage({
                      id: 'sp.driving-license:license',
                      defaultMessage: 'Ökuréttindi',
                    })}
                  </Text>
                  <Text>
                    {formatMessage({
                      id: 'sp.driving-license:license-number',
                      defaultMessage: 'Númer ökuskírteinis - ',
                    })}
                    {data?.drivingLicense?.id}
                  </Text>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                textAlign="right"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                  textAlign="right"
                  marginBottom={1}
                >
                  {expiresIn && (
                    <Box paddingRight={1}>
                      <Tag disabled variant="red">
                        {formatMessage({
                          id: 'sp.driving-license:expires-in',
                          defaultMessage: 'Rennur út innan ',
                        })}
                        {Math.round(expiresIn.value)}
                        {expiresIn.key === 'months'
                          ? formatMessage({
                              id: 'sp.driving-license:months',
                              defaultMessage: ' mánaða',
                            })
                          : formatMessage({
                              id: 'sp.driving-license:days',
                              defaultMessage: ' daga',
                            })}
                      </Tag>
                    </Box>
                  )}
                  <Box>
                    <Tag disabled variant="blue">
                      {formatMessage({
                        id: 'sp.driving-license:valid-until',
                        defaultMessage: 'Í gildi til ',
                      })}
                      {toDate(expires)}
                    </Tag>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flexEnd"
                  alignItems="center"
                >
                  <Button variant="text" size="small" icon="download">
                    {formatMessage({
                      id: 'sp.driving-license:send-to-phone',
                      defaultMessage: 'Senda í síma',
                    })}
                  </Button>
                  <Box className={styles.line} marginLeft={2} marginRight={2} />
                  <Link
                    href={ServicePortalPath.DrivingLicenseDetail.replace(
                      ':id',
                      id,
                    )}
                  >
                    <Button
                      variant="text"
                      size="small"
                      icon="arrowForward"
                      // onClick={() => {
                      //   router.push(
                      //     ServicePortalPath.DrivingLicenseDetail.replace(
                      //       ':id',
                      //       id,
                      //     ),
                      //   )
                      // }}
                    >
                      {formatMessage({
                        id: 'sp.driving-license:see-more',
                        defaultMessage: 'Skoða upplýsingar',
                      })}
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Stack>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default DrivingLicense
