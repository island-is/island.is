import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import * as kennitala from 'kennitala'
import NextLink from 'next/link'
import React, { FC, useContext, useEffect, useState } from 'react'

import {
  Box,
  Breadcrumbs,
  Button,
  DialogPrompt,
  DropdownMenu,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  hasPermission,
  isDeveloper,
} from '@island.is/skilavottord-web/auth/utils'
import { NotFound } from '@island.is/skilavottord-web/components'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  AccessControlRole,
  AccessControl as AccessControlType,
  CreateAccessControlInput,
  DeleteAccessControlInput,
  Query,
  Role,
  UpdateAccessControlInput,
} from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  filterInternalPartners,
  getRoleTranslation,
} from '@island.is/skilavottord-web/utils'

import { AccessControlCreate, AccessControlUpdate } from './components'

import NavigationLinks from '@island.is/skilavottord-web/components/NavigationLinks/NavigationLinks'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import * as styles from './AccessControl.css'
import { SkilavottordAllRecyclingPartnersByTypeQuery } from '../RecyclingCompanies/RecyclingCompanies'
import municipalities from '@island.is/skilavottord-web/pages/en/municipalities'
import { use } from 'dd-trace'

const SkilavottordAllRecyclingPartnersQuery = gql`
  query skilavottordAllRecyclingPartnersQuery {
    skilavottordAllRecyclingPartners {
      companyId
      companyName
      active
      municipalityId
    }
  }
`

const SkilavottordAccessControlsQuery = gql`
  query skilavottordAccessControlsQuery {
    skilavottordAccessControls {
      nationalId
      name
      role
      email
      phone
      recyclingPartner {
        companyId
        companyName
        municipalityId
      }
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
      email
      phone
      recyclingPartner {
        companyId
        companyName
      }
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
      email
      phone
      recyclingPartner {
        companyId
        companyName
      }
    }
  }
`

export const DeleteSkilavottordAccessControlMutation = gql`
  mutation deleteSkilavottordAccessControlMutation(
    $input: DeleteAccessControlInput!
  ) {
    deleteSkilavottordAccessControl(input: $input)
  }
`

const AccessControl: FC<React.PropsWithChildren<unknown>> = () => {
  const { Table, Head, Row, HeadData, Body, Data } = T
  const { user } = useContext(UserContext)

  const [
    getAllRecyclingPartner,
    {
      data: recyclingPartnerData,
      error: recyclingPartnerError,
      loading: recyclingPartnerLoading,
    },
  ] = useLazyQuery<Query>(SkilavottordAllRecyclingPartnersQuery, {
    ssr: false,
  })

  const [
    getAllRecyclingPartnersByMunicipality,
    {
      data: recyclingPartnerByIdData,
      error: recyclingPartnerByIdError,
      loading: recyclingPartnerByIdLoading,
    },
  ] = useLazyQuery<Query>(SkilavottordAllRecyclingPartnersByTypeQuery, {
    ssr: false,
    variables: { isMunicipality: false, municipalityId: user?.partnerId },
  })

  const {
    data: accessControlsData,
    error: accessControlsError,
    loading: accessControlsLoading,
  } = useQuery<Query>(SkilavottordAccessControlsQuery, {
    ssr: false,
  })

  const [createSkilavottordAccessControl] = useMutation(
    CreateSkilavottordAccessControlMutation,
    {
      onError(_) {
        // Hide Runtime error message. The error message is already shown to the user in toast.
      },
      refetchQueries: [
        {
          query: SkilavottordAccessControlsQuery,
        },
      ],
    },
  )
  const [updateSkilavottordAccessControl] = useMutation(
    UpdateSkilavottordAccessControlMutation,
    {
      onError(_) {
        // Hide Runtime error message. The error message is already shown to the user in toast.
      },
      refetchQueries: [
        {
          query: SkilavottordAccessControlsQuery,
        },
      ],
    },
  )
  const [deleteSkilavottordAccessControl] = useMutation(
    DeleteSkilavottordAccessControlMutation,
    {
      refetchQueries: [
        {
          query: SkilavottordAccessControlsQuery,
        },
      ],
    },
  )

  const [
    isCreateAccessControlModalVisible,
    setIsCreateAccessControlModalVisible,
  ] = useState(false)
  const [partner, setPartner] = useState<AccessControlType>()

  const error =
    recyclingPartnerError || accessControlsError || recyclingPartnerByIdError
  const loading =
    recyclingPartnerLoading ||
    accessControlsLoading ||
    recyclingPartnerByIdLoading
  const isData = !!recyclingPartnerData || !!accessControlsData

  const {
    t: { accessControl: t, routes },
    activeLocale,
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('accessControl', user?.role as Role)) {
    return <NotFound />
  }

  const accessControls =
    accessControlsData?.skilavottordAccessControls ||
    accessControlsData?.skilavottordAccessControlsByRecyclingPartner ||
    []

  const partners =
    recyclingPartnerData?.skilavottordAllRecyclingPartners ||
    recyclingPartnerByIdData?.skilavottordAllRecyclingPartnersByType ||
    []
  const recyclingPartners = filterInternalPartners(partners).map((partner) => ({
    label: partner.municipalityId
      ? `${partner.municipalityId} - ${partner.companyName}`
      : partner.companyName,
    value: partner.companyId,
  }))

  const roles = Object.keys(AccessControlRole)
    .filter((role) =>
      !isDeveloper(user?.role) ? role !== Role.developer : role,
    )
    .filter((role) => {
      if (user.role == Role.municipality) {
        return (
          role === Role.recyclingCompany ||
          role === Role.recyclingCompanyAdmin ||
          role === Role.municipality
        )
      }

      return role
    })
    .map((role) => ({
      label: getRoleTranslation(role as Role, activeLocale),
      value: role,
    }))

  const handleCreateAccessControlCloseModal = () =>
    setIsCreateAccessControlModalVisible(false)

  const handleCreateAccessControlOpenModal = () => {
    if (user.role === Role.municipality) {
      getAllRecyclingPartnersByMunicipality()
    } else {
      getAllRecyclingPartner()
    }

    setIsCreateAccessControlModalVisible(true)
  }

  const handleUpdateAccessControlCloseModal = () => setPartner(undefined)

  const handleCreateAccessControl = async (input: CreateAccessControlInput) => {
    const { errors } = await createSkilavottordAccessControl({
      variables: { input },
    })
    if (!errors) {
      handleCreateAccessControlCloseModal()
    }
  }

  const handleUpdateAccessControl = async (input: UpdateAccessControlInput) => {
    const { errors } = await updateSkilavottordAccessControl({
      variables: { input },
    })
    if (!errors) {
      handleUpdateAccessControlCloseModal()
    }
  }

  const handleDeleteAccessControl = async (input: DeleteAccessControlInput) => {
    await deleteSkilavottordAccessControl({
      variables: { input },
    })
  }

  return (
    <PartnerPageLayout side={<NavigationLinks activeSection={3} />}>
      <Stack space={4}>
        <Box>
          <Breadcrumbs
            items={[
              { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
              {
                title: t.title,
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
        </Box>
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
        >
          <PageHeader title={t.title} info={t.info} />
          <AccessControlCreate
            title={t.modal.titles.add}
            text={t.modal.subtitles.add}
            show={isCreateAccessControlModalVisible}
            onCancel={handleCreateAccessControlCloseModal}
            onSubmit={handleCreateAccessControl}
            recyclingPartners={recyclingPartners}
            roles={roles}
          />
        </Box>
        <Stack space={3}>
          <Box display="flex" justifyContent="flexEnd">
            <Button onClick={handleCreateAccessControlOpenModal}>
              {t.buttons.add}
            </Button>
          </Box>
          {loading ? (
            <SkeletonLoader width="100%" height={206} />
          ) : !isData || error ? (
            <Box marginTop={4}>
              <Text>{t.empty}</Text>
            </Box>
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
                    <Text variant="eyebrow">{t.tableHeaders.partner}</Text>
                  </HeadData>
                  <HeadData></HeadData>
                </Row>
              </Head>
              <Body>
                {accessControls.map((item) => (
                  <Row key={item.nationalId}>
                    <Data>{kennitala.format(item.nationalId)}</Data>
                    <Data>{item.name}</Data>
                    <Data>
                      {getRoleTranslation(
                        item.role as AccessControlRole & Role,
                        activeLocale,
                      )}
                    </Data>
                    <Data>{item?.recyclingPartner?.companyName || '-'} </Data>
                    <Data>
                      <DropdownMenu
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
                      />
                    </Data>
                  </Row>
                ))}
              </Body>
            </Table>
          )}
        </Stack>
      </Stack>
      <AccessControlUpdate
        title={t.modal.titles.edit}
        text={t.modal.subtitles.edit}
        show={!!partner}
        onCancel={handleUpdateAccessControlCloseModal}
        onSubmit={handleUpdateAccessControl}
        recyclingPartners={recyclingPartners}
        roles={roles}
        currentPartner={partner}
      />
    </PartnerPageLayout>
  )
}

export default AccessControl
