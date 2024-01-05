import React, { FC, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'
import { Query, Role } from '@island.is/skilavottord-web/graphql/schema'

import { RecyclingCompanyImage, RecyclingCompanyForm } from '../components'
import { SkilavottordAllRecyclingPartnersQuery } from '../RecyclingCompanies'

const SkilavottordRecyclingPartnerQuery = gql`
  query SkilavottordRecyclingPartnerQuery($input: RecyclingPartnerInput!) {
    skilavottordRecyclingPartner(input: $input) {
      companyId
      companyName
      nationalId
      email
      address
      postnumber
      city
      website
      phone
      active
    }
  }
`

const UpdateSkilavottordRecyclingPartnerMutation = gql`
  mutation updateSkilavottordRecyclingPartnerMutation(
    $input: UpdateRecyclingPartnerInput!
  ) {
    updateSkilavottordRecyclingPartner(input: $input) {
      companyId
      companyName
      nationalId
      email
      address
      postnumber
      city
      website
      phone
      active
    }
  }
`

const RecyclingCompanyUpdate: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const { id } = router.query
  const { data, error, loading } = useQuery<Query>(
    SkilavottordRecyclingPartnerQuery,
    {
      variables: { input: { companyId: id } },
      ssr: false,
      onCompleted: (data) => {
        reset(data?.skilavottordRecyclingPartner)
      },
    },
  )

  const [updateSkilavottordRecyclingPartner] = useMutation(
    UpdateSkilavottordRecyclingPartnerMutation,
    {
      refetchQueries: [
        {
          query: SkilavottordRecyclingPartnerQuery,
          variables: { input: { companyId: id } },
        },
        {
          query: SkilavottordAllRecyclingPartnersQuery,
        },
      ],
    },
  )

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const {
    t: { recyclingCompanies: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  if (!loading && (!data || error)) {
    return <NotFound />
  }

  const handleUpdateRecyclingPartner = handleSubmit(async (input) => {
    const { errors } = await updateSkilavottordRecyclingPartner({
      variables: { input },
    })
    if (!errors) {
      router.push(routes.recyclingCompanies.baseRoute).then(() => {
        toast.success(t.recyclingCompany.view.updated)
      })
    }
  })

  const handleCancel = () => router.push(routes.recyclingCompanies.baseRoute)

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
              ...(hasPermission('accessControl', user?.role)
                ? {
                    icon: 'lockClosed',
                    title: `${sidenavText.accessControl}`,
                    link: `${routes.accessControl}`,
                  }
                : null),
            } as React.ComponentProps<typeof Sidenav>['sections'][0],
          ].filter(Boolean)}
          activeSection={1}
        />
      }
    >
      <Stack space={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
            {
              title: t.title,
              href: routes.recyclingCompanies.baseRoute,
            },
            {
              title: t.recyclingCompany.view.breadcrumb,
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
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
        >
          <GridRow marginBottom={7}>
            <GridColumn span={['8/8', '6/8', '5/8']} order={[2, 1]}>
              <Text variant="h1" as="h1" marginBottom={4}>
                {t.recyclingCompany.view.title}
              </Text>
              <Text variant="intro"> {t.recyclingCompany.view.info}</Text>
            </GridColumn>
            <GridColumn
              span={['8/8', '2/8']}
              offset={['0', '0', '1/8']}
              order={[1, 2]}
            >
              <Box textAlign={['center', 'right']} padding={[6, 0]}>
                <RecyclingCompanyImage />
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      </Stack>
      <Box marginTop={7}>
        {loading ? (
          <SkeletonLoader width="100%" space={3} repeat={5} height={78} />
        ) : (
          <RecyclingCompanyForm
            onSubmit={handleUpdateRecyclingPartner}
            onCancel={handleCancel}
            control={control}
            errors={errors}
            editView
          />
        )}
      </Box>
    </PartnerPageLayout>
  )
}

export default RecyclingCompanyUpdate
