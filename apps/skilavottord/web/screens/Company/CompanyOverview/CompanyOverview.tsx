import React, { FC, useState } from 'react'
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
import CarsTable from './components/CarsTable'
import Sidenav from '@island.is/skilavottord-web/components/Sidenav/Sidenav'
import { useRouter } from 'next/router'

const CompanyOverview: FC = () => {
  const [value, setValue] = useState('')

  const {
    t: { companyOverview: t, companySide: sideText },
  } = useI18n()
  const router = useRouter()

  return (
    <PartnerPageLayout
      top={
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
              <Button onClick={() => {router.push('./deregister-vehicle/[123]/select')}}>{t.buttons.deregister}</Button>
            </Stack>
            <Text variant="h3">{t.subtitles.history}</Text>
          </Stack>
        </Box>
      }
      bottom={<CarsTable />}
      left={
        <Sidenav
          title="Company name"
          sections={[
            {
              icon: 'car',
              title: `${sideText.deregister}`,
              link: './company-overview',
            },
            {
              icon: 'business',
              title: `${sideText.companyInfo}`,
              link: './company-info',
            },
          ]}
          activeSection={0}
        />
      }
    />
  )
}

export default CompanyOverview
