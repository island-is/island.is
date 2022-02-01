import React from 'react'
import format from 'date-fns/format'
import { gql, useQuery } from '@apollo/client'
import { dateFormat } from '@island.is/shared/constants'
import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './Eligibility.css'

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

const Eligibility = () => {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()
  const { data } = useQuery<Query>(DrivingLicenseQuery)
  const { drivingLicense } = data || {}

  if (!drivingLicense) {
    return null
  }

  function daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate()
  }

  const toDate = (seconds: string) => {
    const t = new Date(+seconds)
    return format(t, dateFormat.is)
  }

  const getDaysBetween = (date: Date) => {
    const current = new Date()
    return (date.getTime() - current.getTime()) / 86400000
  }

  const getMonthsBetween = (date: Date) => {
    const current = new Date()
    return (
      (date.getTime() - current.getTime()) /
      (86400000 * daysInMonth(date.getMonth(), date.getFullYear()))
    )
  }

  const getYearsBetween = (date: Date) => {
    const current = new Date()
    return date.getFullYear() - current.getFullYear()
  }

  const getExpiresIn = (date: Date) => {
    const years = getYearsBetween(date)
    if (years < 1) {
      const months = getMonthsBetween(date)
      if (months < 1) {
        return { key: 'days', value: getDaysBetween(date) }
      } else if (months <= 6) {
        return { key: 'months', value: months }
      } else {
        return null
      }
    }
    return null
  }
  const { id, name, issued, expires } = drivingLicense

  const drivingLicenceImg =
    'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg?w=100&h=100&fit=pad&bg=white&fm=png'

  const expiresIn = getExpiresIn(new Date(2022, 2, 22))

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
                flexDirection="row"
                justifyContent="spaceBetween"
                textAlign="right"
              >
                {expiresIn && (
                  <Box paddingRight={1}>
                    <Tag disabled variant="red">
                      {formatMessage({
                        id: 'sp.driving-license:expires-in',
                        defaultMessage: 'Rennur út innan ',
                      })}
                      {expiresIn.value}
                      {expiresIn.key === 'month'
                        ? formatMessage({
                            id: 'sp.driving-license:month',
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
                    {toDate(expires)}
                  </Tag>
                </Box>
              </Box>
            </Box>
          </Stack>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default Eligibility
