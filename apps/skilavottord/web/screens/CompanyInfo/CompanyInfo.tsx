import React, { FC } from 'react'
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

const CompanyInfo: FC = () => {
  const { data, loading, error } = useQuery(GET_RECYCLING_PARTNER, {
    variables: { id: 1 },
  })

  const {
    t: {
      companyInfo: t,
      companySidenav: sidenavText,
      routes,
    },
  } = useI18n()
  const router = useRouter()

  const handleAddLocation = () => {
    router.push(routes.companyInfo.add)
  }

  const handleEditLocation = (id: number) => {
    router.push(routes.companyInfo.edit, `${routes.companyInfo.baseRoute}/edit/${id}`)
  }

  if (error || (loading && !data)) {
    return <Text>No company info available</Text>
  }

  return (
    <PartnerPageLayout
      bottom={
        <Box>
          <Box paddingBottom={6}>
            <Breadcrumbs>
              <Link href={'./'}>
                <a>Ísland.is</a>
              </Link>
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
