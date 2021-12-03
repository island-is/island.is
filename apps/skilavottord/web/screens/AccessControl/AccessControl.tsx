import React, { FC, useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import startCase from 'lodash/startCase'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  Text,
  Table as T,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'
import { filterInternalPartners } from '@island.is/skilavottord-web/utils'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { Query } from '@island.is/skilavottord-web/graphql/schema'

import { PartnerModalForm, AccessControlImage } from './components'

const SkilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
      active
    }
  }
`

const SkilavottordAccessControlsQuery = gql`
  query skilavottordAccessControlsQuery {
    skilavottordAccessControls {
      nationalId
      name
      role
      partnerId
    }
  }
`

export const CreateSkilavottordAccessControlMutation = gql`
  mutation createSkilavottordAccessControlMutation(
    $input: CreateAccessControlInput!
  ) {
    createSkilavottordAccessControl(input: $input) {
      nationalId
      name
      role
      partnerId
    }
  }
`

export const UpdateSkilavottordAccessControlMutation = gql`
  mutation updateSkilavottordAccessControlMutation(
    $input: UpdateAccessControlInput!
  ) {
    updateSkilavottordAccessControl(input: $input) {
      nationalId
      name
      role
      partnerId
    }
  }
`

const formatNationalId = (nationalId: string) =>
  `${nationalId.slice(0, 6)}-${nationalId.slice(6)}`

const AccessControl: FC = () => {
  const { Table, Head, Row, HeadData, Body, Data } = T
  const { linkResolver } = useLinkResolver()
  const { user } = useContext(UserContext)
  const {
    data: recyclingPartnerData,
    error: recyclingPartnerError,
    loading: recyclingPartnerLoading,
  } = useQuery<Query>(SkilavottordAllRecyclingPartnersQuery)
  const {
    data: accessControlsData,
    error: accessControlsError,
    loading: accessControlsLoading,
  } = useQuery<Query>(SkilavottordAccessControlsQuery, { ssr: false })

  const [createSkilavottordAccessControl] = useMutation(
    CreateSkilavottordAccessControlMutation,
  )
  const [updateSkilavottordAccessControl] = useMutation(
    UpdateSkilavottordAccessControlMutation,
  )

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [partner, setPartner] = useState<any>(null)

  const error = recyclingPartnerError || accessControlsError
  const loading = recyclingPartnerLoading || accessControlsLoading
  const isData = !!recyclingPartnerData && !!accessControlsData

  const {
    t: { accessControl: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  const accessControls = accessControlsData?.skilavottordAccessControls || []

  const partners = recyclingPartnerData?.skilavottordAllRecyclingPartners || []
  const recyclingPartners = filterInternalPartners(partners).map((partner) => ({
    label: partner.companyName,
    value: partner.companyId,
  }))

  const roles = Object.keys(Role).map((role) => ({
    label: startCase(role),
    value: role,
  }))

  const handleCreateAccessControl = async (partner: any) => {
    await createSkilavottordAccessControl({
      variables: {
        input: {
          ...partner,
          role: partner.role.value,
          partnerId: partner.partnerId.value,
        },
      },
    })
  }

  const handleUpdateAccessControl = async (partner: any) => {
    await updateSkilavottordAccessControl({
      variables: {
        input: {
          ...partner,
          role: partner.role.value,
          partnerId: partner.partnerId.value,
        },
      },
    })
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
        </Box>
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
        >
          <GridRow marginBottom={7}>
            <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
              <Text variant="h1" as="h1" marginBottom={4}>
                {t.title}
              </Text>
              <Text variant="intro">
                Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú
                getur eytt umboðum eða bætt við nýjum.
              </Text>
            </GridColumn>
            {true && (
              <GridColumn
                span={['8/8', '2/8']}
                offset={['0', '0', '1/8']}
                order={[1, 2]}
              >
                <Box textAlign={['center', 'right']} padding={[6, 0]}>
                  <AccessControlImage />
                </Box>
              </GridColumn>
            )}
          </GridRow>
          <PartnerModalForm
            title={t.modal.titles.add}
            text={t.modal.subtitles.add}
            continueButtonText={t.modal.buttons.continue}
            cancelButtonText={t.modal.buttons.cancel}
            show={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            onContinue={() => {}}
            onSubmit={handleCreateAccessControl}
            recyclingPartners={recyclingPartners}
            roles={roles}
          />
        </Box>
        <Stack space={3}>
          <Box display="flex" justifyContent="flexEnd">
            <Button onClick={() => setIsAddModalVisible(true)}>
              {t.buttons.add}
            </Button>
          </Box>
          {error || (loading && !isData) ? (
            <Text>{t.empty}</Text>
          ) : (
            <Table>
              <Head>
                <Row>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.nationalId}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.name}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.role}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.partnerId}</Text>
                  </HeadData>
                  <HeadData></HeadData>
                </Row>
              </Head>
              <Body>
                {accessControls.map((item) => {
                  return (
                    <Row key={item.nationalId}>
                      <Data>{formatNationalId(item.nationalId)}</Data>
                      <Data>{item.name}</Data>
                      <Data>{startCase(item.role)}</Data>
                      <Data>{item.partnerId}</Data>
                      <Data>
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
                          show={!!partner}
                          onCancel={() => setPartner(null)}
                          onContinue={() => setPartner(null)}
                          onSubmit={handleUpdateAccessControl}
                          recyclingPartners={recyclingPartners}
                          roles={roles}
                          partner={partner}
                        />
                      </Data>
                    </Row>
                  )
                })}
              </Body>
            </Table>
          )}
        </Stack>
      </Stack>
    </PartnerPageLayout>
  )
}

export default AccessControl
