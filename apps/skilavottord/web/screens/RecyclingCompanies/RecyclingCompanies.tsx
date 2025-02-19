import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useContext } from 'react'

import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  hasMunicipalityRole,
  hasPermission,
} from '@island.is/skilavottord-web/auth/utils'
import { NotFound } from '@island.is/skilavottord-web/components'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  Query,
  RecyclingPartner,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { filterInternalPartners } from '@island.is/skilavottord-web/utils'

import NavigationLinks from '@island.is/skilavottord-web/components/NavigationLinks/NavigationLinks'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'

export const SkilavottordRecyclingPartnersQuery = gql`
  query skilavottordRecyclingPartnersQuery(
    $isMunicipalityPage: Boolean!
    $municipalityId: String
  ) {
    skilavottordRecyclingPartners(
      isMunicipalityPage: $isMunicipalityPage
      municipalityId: $municipalityId
    ) {
      companyId
      companyName
      address
      postnumber
      email
      active
      municipalityId
      isMunicipality
    }
  }
`

const RecyclingCompanies: FC<React.PropsWithChildren<unknown>> = () => {
  const { Table, Head, Row, HeadData, Body, Data } = T
  const { user } = useContext(UserContext)
  const router = useRouter()

  const {
    t: { recyclingCompanies: t, municipalities: mt, routes },
  } = useI18n()

  // Since we are resuing the same page for both municipalities and recycling companies we need to distinguish between municipalities and recycling companies
  let isMunicipalityPage = false
  let buttonText = t.buttons.add
  let activeSection = 2
  let title = t.title
  let info = t.info
  let empty = t.empty

  if (router.route === routes.municipalities.baseRoute) {
    activeSection = 1
    title = mt.title
    info = mt.info
    empty = mt.empty
    isMunicipalityPage = true
    buttonText = t.buttons.addMunicipality
  }

  // Show only recycling companies for the municipality
  let partnerId = null
  if (hasMunicipalityRole(user?.role)) {
    partnerId = user?.partnerId
  }

  const { data, error, loading } = useQuery<Query>(
    SkilavottordRecyclingPartnersQuery,
    {
      variables: {
        isMunicipalityPage: isMunicipalityPage,
        municipalityId: partnerId,
      },
    },
  )

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  const partners = data?.skilavottordRecyclingPartners || []
  const recyclingPartners = filterInternalPartners(partners)
  recyclingPartners.sort((a, b) => a.companyName.localeCompare(b.companyName))

  const handleCreate = () => {
    if (isMunicipalityPage) {
      router.push({
        pathname: routes.municipalities.add,
      })
    } else {
      router.push({
        pathname: routes.recyclingCompanies.add,
      })
    }
  }

  const handleUpdate = (id: string) => {
    if (isMunicipalityPage) {
      router.push({
        pathname: routes.municipalities.edit, // with BASE-PATH it duplicates the path
        query: { id },
      })
    } else {
      router.push({
        pathname: routes.recyclingCompanies.edit, // with BASE-PATH it duplicates the path
        query: { id },
      })
    }
  }

  return (
    <PartnerPageLayout side={<NavigationLinks activeSection={activeSection} />}>
      <Stack space={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: routes.home['recyclingFund'] },
            {
              title: title,
            },
          ]}
          renderLink={(link, item) => {
            return item?.href ? (
              <NextLink href={item?.href} legacyBehavior>
                {link}
              </NextLink>
            ) : (
              link
            )
          }}
        />
        <PageHeader title={title} info={info} />
        <Box display="flex" justifyContent="flexEnd">
          <Button onClick={handleCreate}>{buttonText}</Button>
        </Box>
        {error || (loading && !data) ? (
          <Text>{empty}</Text>
        ) : (
          <Stack space={3}>
            <Table>
              <Head>
                <Row>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.name}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.id}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.address}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.postnumber}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.email}</Text>
                  </HeadData>
                  <HeadData>
                    <Text variant="eyebrow">{t.tableHeaders.status}</Text>
                  </HeadData>
                  <HeadData></HeadData>
                </Row>
              </Head>
              <Body>
                {recyclingPartners.map((partner: RecyclingPartner) => (
                  <Row key={partner.companyId}>
                    <Data>{partner.companyName}</Data>
                    <Data>{partner.companyId}</Data>
                    <Data>{partner.address}</Data>
                    <Data>{partner.postnumber}</Data>
                    <Data>{partner.email}</Data>
                    <Data>
                      {partner.active ? (
                        <Text
                          color="mint400"
                          fontWeight="semiBold"
                          variant="eyebrow"
                        >
                          {t.status.active}
                        </Text>
                      ) : (
                        <Text
                          color="red600"
                          fontWeight="semiBold"
                          variant="eyebrow"
                        >
                          {t.status.inactive}
                        </Text>
                      )}
                    </Data>
                    <Data>
                      <Button
                        variant="text"
                        icon="chevronForward"
                        size="small"
                        nowrap
                        onClick={() => handleUpdate(partner.companyId)}
                      >
                        {t.buttons.view}
                      </Button>

                      {/* <DropdownMenu
                        disclosure={
                          <Button
                            variant="text"
                            icon="chevronDown"
                            size="small"
                            nowrap
                          >
                            {t.buttons.actions}
                          </Button>
                        }
                        items={[
                          {
                            title: t.buttons.edit,
                            onClick: () => setPartner(item),
                          },
                          {
                            title: t.buttons.delete,
                            render: () => (
                              <DialogPrompt
                                title={t.modal.titles.delete}
                                description={t.modal.subtitles.delete}
                                baseId={`delete-${item.nationalId}-dialog`}
                                ariaLabel={`delete-${item.nationalId}-dialog`}
                                disclosureElement={
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    paddingY={2}
                                    cursor="pointer"
                                    className={styles.deleteMenuItem}
                                  >
                                    <Text variant="eyebrow" color="red600">
                                      {t.buttons.delete}
                                    </Text>
                                  </Box>
                                }
                                buttonTextCancel={t.modal.buttons.cancel}
                                buttonTextConfirm={t.modal.buttons.confirm}
                                onConfirm={() =>
                                  handleDeleteAccessControl({
                                    nationalId: item.nationalId,
                                  })
                                }
                              />
                            ),
                          },
                        ]}
                        menuLabel={t.buttons.actions}
                      /> */}
                    </Data>
                  </Row>
                ))}
              </Body>
            </Table>
          </Stack>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default RecyclingCompanies
