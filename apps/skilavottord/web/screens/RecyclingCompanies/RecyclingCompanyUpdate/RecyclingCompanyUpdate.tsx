import { useMutation, useQuery } from '@apollo/client'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  Box,
  Breadcrumbs,
  SkeletonLoader,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import {
  hasMunicipalityRole,
  hasPermission,
} from '@island.is/skilavottord-web/auth/utils'
import { NotFound } from '@island.is/skilavottord-web/components'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { UserContext } from '@island.is/skilavottord-web/context'
import { Query, Role } from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'

import NavigationLinks from '@island.is/skilavottord-web/components/NavigationLinks/NavigationLinks'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'

import { RecyclingCompanyForm } from '../components'
import {
  SkilavottordRecyclingPartnersQuery,
  SkilavottordRecyclingPartnerQuery,
  UpdateSkilavottordRecyclingPartnerMutation,
} from '@island.is/skilavottord-web/graphql/queries'

const RecyclingCompanyUpdate: FC<React.PropsWithChildren<unknown>> = () => {
  const methods = useForm({
    mode: 'onChange',
  })

  const {
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods

  const {
    t: { recyclingCompanies: t, municipalities: mt, routes },
  } = useI18n()
  const { user } = useContext(UserContext)
  const router = useRouter()
  const { id } = router.query

  const isMunicipalityPage = router.route === routes.municipalities.edit

  // Show only recycling companies for the municipality
  let partnerId = null
  if (hasMunicipalityRole(user?.role)) {
    partnerId = user?.partnerId
  }

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
          query: SkilavottordRecyclingPartnersQuery,
          variables: {
            isMunicipalityPage: isMunicipalityPage,
            municipalityId: partnerId,
          },
        },
      ],
    },
  )

  let breadcrumbTitle = t.title
  let title = t.recyclingCompany.view.title
  let info = t.recyclingCompany.view.info
  let activeSection = 2
  let route = routes.recyclingCompanies.baseRoute

  useEffect(() => {
    setValue('isMunicipality', isMunicipalityPage)
  }, [isMunicipalityPage, setValue])

  // If coming from municipality page
  if (isMunicipalityPage) {
    activeSection = 1
    breadcrumbTitle = mt.title
    title = mt.municipality.view.title
    info = mt.municipality.view.info
    route = routes.municipalities.baseRoute
  }

  if (!user) {
    return null
  } else if (!hasPermission('recyclingCompanies', user?.role as Role)) {
    return <NotFound />
  }

  if (!loading && (!data || error)) {
    return <NotFound />
  }

  const navigateToBaseRoute = () => {
    const route = isMunicipalityPage
      ? routes.municipalities.baseRoute
      : routes.recyclingCompanies.baseRoute
    return router.push(route)
  }

  const handleUpdateRecyclingPartner = handleSubmit(async (input) => {
    // Not needed to be sent to the backend, causes error if it is sent
    delete input.__typename

    const municipalityId = input.municipalityId
    input.municipalityId =
      typeof municipalityId === 'object' && municipalityId?.value
        ? municipalityId.value
        : (municipalityId as string) || ''

    const { errors } = await updateSkilavottordRecyclingPartner({
      variables: { input },
    })
    if (!errors) {
      navigateToBaseRoute().then(() => {
        toast.success(t.recyclingCompany.view.updated)
      })
    }
  })

  const handleCancel = () => {
    navigateToBaseRoute()
  }

  return (
    <PartnerPageLayout side={<NavigationLinks activeSection={activeSection} />}>
      <Stack space={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
            {
              title: breadcrumbTitle,
              href: route,
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
        <PageHeader title={title} info={info} />
      </Stack>
      <Box marginTop={7}>
        {loading ? (
          <SkeletonLoader width="100%" space={3} repeat={5} height={78} />
        ) : (
          <FormProvider {...methods}>
            <RecyclingCompanyForm
              onSubmit={handleUpdateRecyclingPartner}
              onCancel={handleCancel}
              errors={errors}
              editView
              isMunicipalityPage={isMunicipalityPage}
            />
          </FormProvider>
        )}
      </Box>
    </PartnerPageLayout>
  )
}

export default RecyclingCompanyUpdate
