import React from 'react'
import { PlausiblePageviewDetail } from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'

const CompaniesDetail = gql`
  query GetCompanyInformationQuery($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      nationalId
      name
      dateOfRegistration
      status
      lastUpdated
      companyInfo {
        formOfOperation {
          type
          name
        }
        vat {
          vatNumber
        }
        address {
          streetAddress
          type
          postalCode
          city
          country
        }
        type {
          type
          name
        }
      }
    }
  }
`

const CompanyInfo: ServicePortalModuleComponent = () => {
  useNamespaces('sp.family')

  PlausiblePageviewDetail(
    ServicePortalPath.CompanyInfo.replace(':nationalId', 'detail'),
  )
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const { data, loading, error } = useQuery<Query>(CompaniesDetail, {
    variables: {
      input: {
        nationalId: nationalId, //'4710032980', // TODO: Skipta í raun gögn
      },
    },
  })

  const { companyRegistryCompany: company } = data || {}

  if (!nationalId || error || (!loading && !data))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:company-not-found',
          defaultMessage: 'Fyrirtæki fannst ekki',
        })}
      />
    )

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {company?.name || '...'}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage(m.fullName)}
          content={company?.name || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(company?.nationalId || '...')}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.address)}
          content={
            company?.companyInfo?.address[0]?.streetAddress +
            ', ' +
            company?.companyInfo?.address[0]?.postalCode +
            ' ' +
            company?.companyInfo?.address[0]?.city
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.registrationDate)}
          content={company?.dateOfRegistration || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.vsk)}
          content={company?.companyInfo?.vat[0]?.vatNumber || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.companyType)}
          content={company?.companyInfo?.type[0]?.name || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.companyCategory)}
          content={company?.companyInfo?.formOfOperation[0]?.name || '...'}
          loading={loading}
        />
        <Divider />
        <Box marginY={3} />
      </Stack>
    </>
  )
}

export default CompanyInfo
