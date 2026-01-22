/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import * as kennitala from 'kennitala'
import NextLink from 'next/link'
import React, { FC, useContext, useState } from 'react'

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
import { hasDeveloperRole } from '@island.is/skilavottord-web/auth/utils'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
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
import { getRoleTranslation } from '@island.is/skilavottord-web/utils'
import { BASE_PATH } from '@island.is/skilavottord/consts'

import { AccessControlCreate, AccessControlUpdate } from './components'

import AuthGuard from '@island.is/skilavottord-web/components/AuthGuard/AuthGuard'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import * as styles from './AccessControl.css'

const SkilavottordAccessControlsByRecyclingPartnerQuery = gql`
  query skilavottordAccessControlsByRecyclingPartnerQuery {
    skilavottordAccessControlsByRecyclingPartner {
      nationalId
      name
      role
      email
      phone
      recyclingLocation
      recyclingPartner {
        companyId
        companyName
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
      recyclingLocation
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
      recyclingLocation
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

const AccessControlCompany: FC<React.PropsWithChildren<unknown>> = () => {
  const { Table, Head, Row, HeadData, Body, Data } = T
  const { user } = useContext(UserContext)

  const {
    t: { accessControl: t, deregisterSidenav: sidenavText, routes },
    activeLocale,
  } = useI18n()

  const {
    data: accessControlsData,
    error,
    loading,
  } = useQuery<Query>(SkilavottordAccessControlsByRecyclingPartnerQuery, {
    ssr: false,
  })

  const [createSkilavottordAccessControl] = useMutation(
    CreateSkilavottordAccessControlMutation,
    {
      refetchQueries: [
        {
          query: SkilavottordAccessControlsByRecyclingPartnerQuery,
        },
      ],
    },
  )
  const [updateSkilavottordAccessControl] = useMutation(
    UpdateSkilavottordAccessControlMutation,
    {
      refetchQueries: [
        {
          query: SkilavottordAccessControlsByRecyclingPartnerQuery,
        },
      ],
    },
  )
  const [deleteSkilavottordAccessControl] = useMutation(
    DeleteSkilavottordAccessControlMutation,
    {
      refetchQueries: [
        {
          query: SkilavottordAccessControlsByRecyclingPartnerQuery,
        },
      ],
    },
  )

  const [
    isCreateAccessControlModalVisible,
    setIsCreateAccessControlModalVisible,
  ] = useState(false)
  const [partner, setPartner] = useState<AccessControlType>()

  const isData = !!accessControlsData

  let accessControls =
    accessControlsData?.skilavottordAccessControlsByRecyclingPartner || []

  // Remove the users with municipality role
  accessControls = accessControls.filter(
    (accessCtrl) => accessCtrl.role !== AccessControlRole.municipality,
  )

  const roles = Object.keys(AccessControlRole)
    .filter((role) =>
      !hasDeveloperRole(user?.role) ? role !== Role.developer : role,
    )
    .filter(
      (role) =>
        role === Role.recyclingCompany || role === Role.recyclingCompanyAdmin,
    )
    .map((role) => ({
      label: getRoleTranslation(role as Role, activeLocale),
      value: role,
    }))

  const handleCreateAccessControlCloseModal = () =>
    setIsCreateAccessControlModalVisible(false)

  const handleCreateAccessControlOpenModal = () =>
    setIsCreateAccessControlModalVisible(true)

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
    <AuthGuard
      permission="accessControlCompany"
      loading={loading && !accessControlsData}
    >
      <PartnerPageLayout
        side={
          <Sidenav
            title={sidenavText.title}
            sections={[
              {
                icon: 'car',
                title: `${sidenavText.deregister}`,
                link: `${routes.deregisterVehicle.baseRoute}`,
              },
              {
                icon: 'business',
                title: `${sidenavText.companyInfo}`,
                link: `${routes.companyInfo.baseRoute}`,
              },
              {
                icon: 'lockClosed',
                title: `${sidenavText.accessControl}`,
                link: `${routes.accessControlCompany}`,
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
                {
                  title: 'Ísland.is',
                  href: `${BASE_PATH}${routes.home['recyclingCompany']}`,
                },
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
            <PageHeader info={t.info} title={t.title} />

            <AccessControlCreate
              title={t.modal.titles.add}
              text={t.modal.subtitles.add}
              show={isCreateAccessControlModalVisible}
              onCancel={handleCreateAccessControlCloseModal}
              onSubmit={handleCreateAccessControl}
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
                      <Text variant="eyebrow">{t.tableHeaders.email}</Text>
                    </HeadData>
                    <HeadData>
                      <Text variant="eyebrow">{t.tableHeaders.phone}</Text>
                    </HeadData>
                    <HeadData>
                      <Text variant="eyebrow">{t.tableHeaders.role}</Text>
                    </HeadData>
                    <HeadData>
                      <Text variant="eyebrow">
                        {t.tableHeaders.recyclingLocation}
                      </Text>
                    </HeadData>
                    <HeadData></HeadData>
                  </Row>
                </Head>
                <Body>
                  {accessControls.map((item) => (
                    <Row key={item.nationalId}>
                      <Data>{kennitala.format(item.nationalId)}</Data>
                      <Data>{item.name}</Data>
                      <Data>{item.email}</Data>
                      <Data>{item.phone}</Data>
                      <Data>
                        {getRoleTranslation(
                          item.role as AccessControlRole & Role,
                          activeLocale,
                        )}
                      </Data>
                      <Data>{item.recyclingLocation}</Data>
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
          // recyclingPartners={recyclingPartners}
          roles={roles}
          currentPartner={partner}
        />
      </PartnerPageLayout>
    </AuthGuard>
  )
}

export default AccessControlCompany
