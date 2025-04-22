import { useMutation } from '@apollo/client'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useContext } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Box, Breadcrumbs, Stack, toast } from '@island.is/island-ui/core'
import {
  hasMunicipalityRole,
  Page,
} from '@island.is/skilavottord-web/auth/utils'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { UserContext } from '@island.is/skilavottord-web/context'
import { useI18n } from '@island.is/skilavottord-web/i18n'

import AuthGuard from '@island.is/skilavottord-web/components/AuthGuard/AuthGuard'
import NavigationLinks from '@island.is/skilavottord-web/components/NavigationLinks/NavigationLinks'
import PageHeader from '@island.is/skilavottord-web/components/PageHeader/PageHeader'
import {
  CreateSkilavottordRecyclingPartnerMutation,
  SkilavottordRecyclingPartnersQuery,
} from '@island.is/skilavottord-web/graphql'
import { RecyclingCompanyForm } from '../components'

type FormData = {
  municipalityId?: string | { value?: string }
  isMunicipality?: boolean
  active?: boolean
}

const RecyclingCompanyCreate: FC<React.PropsWithChildren<unknown>> = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const {
    t: { recyclingCompanies: t, municipalities: mt, routes },
  } = useI18n()

  let breadcrumbTitle = t.title
  let title = t.recyclingCompany.add.title
  let info = t.recyclingCompany.add.info
  let activeSection = 2
  let route = routes.recyclingCompanies.baseRoute
  let permission = 'recyclingCompanies' as Page

  const isMunicipalityPage = router.route === routes.municipalities.add

  // Show only recycling companies for the municipality
  let partnerId = ''
  if (hasMunicipalityRole(user?.role)) {
    partnerId = user?.partnerId || ''
  }

  // If coming from municipality page
  if (isMunicipalityPage) {
    activeSection = 1
    breadcrumbTitle = mt.title
    title = mt.municipality.add.title
    info = mt.municipality.add.info
    route = routes.municipalities.baseRoute
    permission = 'municipalities'
  }

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: isMunicipalityPage
      ? { isMunicipality: isMunicipalityPage, active: false }
      : {
          isMunicipality: isMunicipalityPage,
          municipalityId: partnerId,
          active: false,
        },
  })

  const {
    handleSubmit,
    formState: { errors },
  } = methods

  const [createSkilavottordRecyclingPartner] = useMutation(
    CreateSkilavottordRecyclingPartnerMutation,
    {
      onError: (_) => {
        // Hide Runtime error message. The error message is already shown to the user in toast.
      },
      refetchQueries: [
        {
          query: SkilavottordRecyclingPartnersQuery,
          variables: { isMunicipalityPage, municipalityId: partnerId },
        },
      ],
    },
  )

  const handleCreateRecyclingPartner = handleSubmit(async (input: FormData) => {
    if (typeof input.municipalityId !== 'string') {
      input.municipalityId = input.municipalityId?.value || ''
    }

    const { errors } = await createSkilavottordRecyclingPartner({
      variables: {
        input: {
          ...input,
          active: !!input.active,
          isMunicipality: !!input.isMunicipality,
        },
      },
    })
    if (!errors) {
      if (isMunicipalityPage) {
        router.push(routes.municipalities.baseRoute).then(() => {
          toast.success(t.recyclingCompany.add.added)
        })
      } else {
        router.push(routes.recyclingCompanies.baseRoute).then(() => {
          toast.success(t.recyclingCompany.add.added)
        })
      }
    }
  })

  const handleCancel = () => {
    if (isMunicipalityPage) {
      router.push(routes.municipalities.baseRoute)
    } else {
      router.push(routes.recyclingCompanies.baseRoute)
    }
  }

  return (
    <AuthGuard permission={permission}>
      <PartnerPageLayout
        side={<NavigationLinks activeSection={activeSection} />}
      >
        <Stack space={4}>
          <Breadcrumbs
            items={[
              { title: 'Ísland.is', href: routes.home['recyclingCompany'] },
              {
                title: breadcrumbTitle,
                href: route,
              },
              {
                title: t.recyclingCompany.add.breadcrumb,
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
          <FormProvider {...methods}>
            <RecyclingCompanyForm
              onSubmit={handleCreateRecyclingPartner}
              onCancel={handleCancel}
              errors={errors}
              isMunicipalityPage={isMunicipalityPage}
            />
          </FormProvider>
        </Box>
      </PartnerPageLayout>
    </AuthGuard>
  )
}
export default RecyclingCompanyCreate
