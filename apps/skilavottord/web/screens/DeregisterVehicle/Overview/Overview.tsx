import React, { FC, useContext } from 'react'
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
import { Sidenav, CarsTable } from '@island.is/skilavottord-web/components'
import { useRouter } from 'next/router'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { NotFound } from '@island.is/skilavottord-web/components'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { deregisterOverview: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const handleDeregister = () => {
    router.push(routes.deregisterVehicle.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      top={
        <Box>
          <Box paddingBottom={6}>
            <Breadcrumbs>
              <Link href={routes.home['recyclingPartner']}>Ísland.is</Link>
              <span>{t.title}</span>
            </Breadcrumbs>
          </Box>
          <Stack space={6}>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h1">{t.title}</Text>
                <Text variant="intro">{t.info}</Text>
              </Stack>
              <Button onClick={handleDeregister}>{t.buttons.deregister}</Button>
            </Stack>
            <Text variant="h3">{t.subtitles.history}</Text>
          </Stack>
        </Box>
      }
      bottom={<CarsTable titles={t.table} />}
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
          activeSection={0}
        />
      }
    />
  )
}

export default Overview
