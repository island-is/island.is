import React from 'react'
import { useQuery, gql } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
  ActionCard,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ServicePortalModuleComponent,
  m,
  ServicePortalPath,
  formatNationalId,
} from '@island.is/service-portal/core'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'
import { useHistory } from 'react-router-dom'

const CompaniesSimple = gql`
  query GetProcuringCompaniesQuery {
    getProcuringCompanies {
      nationalId
      companies {
        nationalId
        name
      }
    }
  }
`

const Companies: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useQuery<Query>(CompaniesSimple)
  console.log(data)
  const companies = data?.getProcuringCompanies?.companies || []

  const history = useHistory()

  const handleClick = (nationalId: string) =>
    history.push(
      ServicePortalPath.CompanyInfo.replace(':nationalId', nationalId),
    )
  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.myInfo)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.family:company-info-description',
                  defaultMessage: 'Hér eru gögn um þín fyrirtæki.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {!loading && !error && companies?.length <= 0 && (
          <AlertMessage type="info" title={formatMessage(m.noDataPresent)} />
        )}

        {loading && <FamilyMemberCardLoader />}

        {companies?.map((item) => (
          <ActionCard
            key={item.nationalId}
            heading={item.name || ''}
            cta={{
              label: formatMessage({
                id: 'sp.family:see-company-info',
                defaultMessage: 'Skoða upplýsingar',
              }),
              variant: 'text',
              onClick: () => handleClick(item.nationalId),
            }}
            text={
              item.nationalId &&
              `${formatMessage(m.natreg)}: ${formatNationalId(item.nationalId)}`
            }
          />
        ))}
      </Stack>
    </>
  )
}
export default Companies
