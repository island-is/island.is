import React, { FC } from 'react'
import Link from 'next/link'
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

const companyInfo = [
  {
    name: 'Hringrás (Reykjavik)',
    address: 'Klettagarðar 9, 105 Reykjavík',
    phone: '+354 555 1900',
    website: 'www.hringras.is',
  },
  {
    name: 'Hringrás (Akureyri)',
    address: 'Ægisnesi 1, 105 Akureyri',
    phone: '+354 555 1900',
    website: 'www.hringras.is',
  },
]

const CompanyInfo: FC = () => {
  const {
    t: { companyInfo: t, companySidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const handleDeregister = () => {
    router.push(routes.deregisterVehicle.select)
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
          <Stack space={6}>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">{t.title}</Text>
                <Text variant="intro">{t.info}</Text>
              </Stack>
            </Stack>
            <Text variant="h3">{t.subtitles.companyLocation}</Text>
            <Box>
              {companyInfo.map((company, index) => (
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
                        <Button variant="ghost">{t.buttons.edit}</Button>
                      </Box>
                    </Box>
                  }
                />
              ))}
            </Box>
            <Button onClick={handleDeregister}>{t.buttons.add}</Button>
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
