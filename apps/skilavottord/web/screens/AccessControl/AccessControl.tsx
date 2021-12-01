import React, { FC, useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import startCase from 'lodash/startCase'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  Text,
  Table,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'
import { filterInternalPartners } from '@island.is/skilavottord-web/utils'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'

import { PartnerModalForm } from './components'

const skilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
      active
    }
  }
`

const createSkilavottordRecyclingPartnerMutation = gql`
  mutation createSkilavottordRecyclingPartnerMutation(
    $nationalId: String!
    $companyName: String!
    $address: String!
    $postnumber: String!
    $city: String!
    $website: String!
    $phone: String!
    $active: Boolean!
  ) {
    createSkilavottordRecyclingRequest(
      partnerId: $partnerId
      permno: $permno
      requestType: $requestType
    ) {
      ... on RequestErrors {
        message
        operation
      }
      ... on RequestStatus {
        status
      }
    }
  }
`

const mock = [
  {
    nationalId: '1111116789',
    name: 'Gervimaður',
    role: 'recyclingCompany',
    partnerId: '8888888888',
  },
  {
    nationalId: '2222222222',
    name: 'Gervimaður2',
    role: 'recyclingCompany',
    partnerId: '9999999999',
  },
  {
    nationalId: '3333333333',
    name: 'Gervimaður3',
    role: 'recyclingCompany',
    partnerId: '9999999999',
  },
]

const formatNationalId = (nationalId: string) =>
  `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`

const AccessControl: FC = () => {
  const { user } = useContext(UserContext)
  const { data, error, loading } = useQuery(
    skilavottordAllRecyclingPartnersQuery,
  )
  const { linkResolver } = useLinkResolver()

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [partner, setPartner] = useState<any>(null)

  const {
    t: { accessControl: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  console.log('partner', partner)

  const partners = data?.skilavottordAllRecyclingPartners || []
  const recyclingPartners = filterInternalPartners(partners).map((partner) => ({
    label: partner.companyName,
    value: partner.companyId,
  }))

  const roles = Object.keys(Role).map((role) => ({
    label: startCase(role),
    value: role,
  }))

  const handleOnSubmit = async (partner: any, callback: () => void) => {
    console.log(partner)
    callback()
  }

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={sidenavText.title}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.recycled}`,
              link: `${routes.recycledVehicles}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companies}`,
              link: `${routes.recyclingCompanies.baseRoute}`,
            },
            {
              icon: 'lockClosed',
              title: `${sidenavText.accessControl}`,
              link: `${routes.accessControl}`,
            },
          ]}
          activeSection={2}
        />
      }
    >
      <Stack space={4}>
        <Box>
          <Breadcrumbs
            items={[
              { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
              {
                title: t.title,
              },
            ]}
            renderLink={(link) => {
              return (
                <NextLink {...linkResolver('homepage')} passHref>
                  {link}
                </NextLink>
              )
            }}
          />
          {/* <Breadcrumbs>
            <Link href={routes.home['recyclingCompany']}>Ísland.is</Link>
            <span>{t.title}</span>
          </Breadcrumbs> */}
        </Box>
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
        >
          <Text variant="h1" marginBottom={0}>
            {t.title}
          </Text>
          <Button onClick={() => setIsAddModalVisible(true)} size="small">
            {t.buttons.add}
          </Button>
          <PartnerModalForm
            title={t.modal.titles.add}
            text={t.modal.subtitles.add}
            continueButtonText={t.modal.buttons.continue}
            cancelButtonText={t.modal.buttons.cancel}
            show={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            onContinue={() => {}}
            onSubmit={handleOnSubmit}
            recyclingPartners={recyclingPartners}
            roles={roles}
          />
        </Box>

        {error || (loading && !data) ? (
          <Text>{t.empty}</Text>
        ) : (
          <Table.Table>
            <Table.Head>
              <Table.Row>
                <Table.HeadData>
                  <Text variant="eyebrow">{t.tableHeaders.nationalId}</Text>
                </Table.HeadData>
                <Table.HeadData>
                  <Text variant="eyebrow">{t.tableHeaders.name}</Text>
                </Table.HeadData>
                <Table.HeadData>
                  <Text variant="eyebrow">{t.tableHeaders.role}</Text>
                </Table.HeadData>
                <Table.HeadData>
                  <Text variant="eyebrow">{t.tableHeaders.partnerId}</Text>
                </Table.HeadData>
                <Table.HeadData></Table.HeadData>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {mock.map((item) => {
                return (
                  <Table.Row key={item.nationalId}>
                    <Table.Data>{formatNationalId(item.nationalId)}</Table.Data>
                    <Table.Data>{item.name}</Table.Data>
                    <Table.Data>{startCase(item.role)}</Table.Data>
                    <Table.Data>{item.partnerId}</Table.Data>
                    <Table.Data>
                      <Button
                        onClick={() => setPartner(item)}
                        variant="text"
                        icon="pencil"
                        size="small"
                        nowrap
                      >
                        {t.buttons.edit}
                      </Button>
                      <PartnerModalForm
                        title={t.modal.titles.edit}
                        text={t.modal.subtitles.edit}
                        continueButtonText={t.modal.buttons.continue}
                        cancelButtonText={t.modal.buttons.cancel}
                        show={partner}
                        onCancel={() => setPartner(null)}
                        onContinue={() => setPartner(null)}
                        onSubmit={handleOnSubmit}
                        recyclingPartners={recyclingPartners}
                        roles={roles}
                        partner={partner}
                      />
                    </Table.Data>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Table>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default AccessControl
