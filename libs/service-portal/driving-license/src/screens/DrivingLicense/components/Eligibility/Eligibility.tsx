import React from 'react'
import format from 'date-fns/format'
import { gql, useQuery } from '@apollo/client'
import { defineMessage } from 'react-intl'
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

import { mapCategory } from './dataMapper'
import { Application } from '../Application'

const DrivingLicenseQuery = gql`
  query DrivingLicenseQuery {
    drivingLicense {
      id
      isProvisional
      eligibilities {
        id
        issued
        expires
        comment
      }
    }
  }
`

function Eligibility(): JSX.Element | null {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()
  const { data } = useQuery<Query>(DrivingLicenseQuery)
  const { drivingLicense } = data || {}

  if (!drivingLicense) {
    return null
  }

  return (
    <>
      <Stack space={2}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage({
                  id: 'sp.driving-license:title',
                  defaultMessage: 'Ökuréttindi',
                })}
              </Text>
              <Text as="p">
                {formatMessage({
                  id: 'sp.driving-license:overview-subtext',
                  defaultMessage:
                    'Hér gefur að líta núverandi ökuréttindi þín og gildistíma þeirra.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="12/12">
            <Stack space={2}>
              <Text variant="h3">Mín réttindi</Text>
              {drivingLicense.eligibilities.map((eligibility) => {
                const category = mapCategory(eligibility.id)
                return (
                  <Box
                    border="standard"
                    borderRadius="standard"
                    padding={4}
                    display="flex"
                    justifyContent="spaceBetween"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="spaceBetween"
                    >
                      <Box>
                        <Text color="purple400" variant="eyebrow">
                          Tegund réttinda
                        </Text>
                      </Box>
                      <Text variant="h3">{category.name}</Text>
                      <Text>
                        Gefið út{' '}
                        {format(new Date(eligibility.issued), dateFormat.is)}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="spaceBetween"
                      textAlign="right"
                    >
                      <Box>
                        <Tag disabled variant={category.color}>
                          Flokkur {category.id}
                        </Tag>
                      </Box>
                      <Text variant="small">
                        Gildistími:{' '}
                        {format(new Date(eligibility.expires), dateFormat.is)}
                      </Text>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </GridColumn>
        </GridRow>
      </Stack>

      {drivingLicense.isProvisional && (
        <Application
          heading={defineMessage({
            id: 'sp.driving-license:driving-license-final-license-heading',
            defaultMessage: 'Fullnaðarskírteini',
          })}
          subText={defineMessage({
            id: 'sp.driving-license:driving-license-final-license-subtext',
            defaultMessage:
              'Ökumaður getur fengið fullnaðarskírteini, hafi hann haft bráðabirgðaskírteini samfellt í 12 mánuði og ekki á þeim tíma fengið punkta í punktakerfi vegna umferðarlagabrota og farið í akstursmat.',
          })}
        />
      )}
    </>
  )
}

export default Eligibility
