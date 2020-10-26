import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import {
  Box,
  Stack,
  Text,
  Breadcrumbs,
  Button,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { useRouter } from 'next/router'
import { CompanyListItem } from '../Handover/components'
import { GET_RECYCLING_PARTNER } from '@island.is/skilavottord-web/graphql/queries'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { Unauthorized } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'

const CompanyInfo: FC = () => {
  const { user } = useContext(UserContext)
  const { data, loading, error } = useQuery(GET_RECYCLING_PARTNER, {
    variables: { id: 1 },
  })

  const {
    t: { companyInfo: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const handleAddLocation = () => {
    router.push(routes.companyInfo.add)
  }

  const handleEditLocation = (id: number) => {
    router.push(
      routes.companyInfo.edit,
      `${routes.companyInfo.baseRoute}/edit/${id}`,
    )
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    console.log(user?.role, 'is not allowed to view this page')
    return <Unauthorized />
  }

  return (
    <PartnerPageLayout
      bottom={
        <Box>
          <Box paddingBottom={6}>
            <Breadcrumbs>
              <Link href={routes.home['recyclingPartner']}>Ísland.is</Link>
              <span>{t.title}</span>
            </Breadcrumbs>
          </Box>
          <Stack space={4}>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">{t.title}</Text>
                <Text variant="intro">{t.info}</Text>
              </Stack>
            </Stack>
            <Text variant="h3">{t.subtitles.companyLocation}</Text>
            {error || (loading && !data) ? (
              <Text>{t.error}</Text>
            ) : (
              <Box>
                {[data?.getRecyclingPartner].map((company, index) => (
                  <CompanyListItem
                    key={index}
                    {...company}
                    buttons={
                      <Box display="flex">
                        <Box paddingX={2}>
                          <Button variant="ghost" colorScheme="destructive">
                            {t.buttons.delete}
                          </Button>
                        </Box>
                        <Box paddingX={2}>
                          <Button
                            variant="ghost"
                            onClick={() => handleEditLocation(company.id)}
                          >
                            {t.buttons.edit}
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                ))}
              </Box>
            )}
            <Button onClick={handleAddLocation}>{t.buttons.add}</Button>
          </Stack>
        </Box>
      }
      left={
        <Sidenav
          title="Company name"
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
          ]}
          activeSection={1}
        />
      }
    />
  )
}

export default CompanyInfo
