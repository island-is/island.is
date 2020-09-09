import React, { FC } from 'react'
import Link from 'next/link'
import {
  Breadcrumbs,
  Typography,
  Box,
  Stack,
  Button,
  ContentBlock,
  BulletList,
  Bullet,
  ArrowLink,
} from '@island.is/island-ui/core'
import { BorderedContent } from '@island.is/island-ui/contentful'
import { PageLayout } from '../Layouts'
import FAQ from './components/FAQ'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { useRouter } from 'next/router'

export const Home: FC = () => {
  const Router = useRouter()
  const { activeLocale, t: { home: t } } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  return (
    <PageLayout>
      <Box paddingBottom={6}>
        <Breadcrumbs>
          <Link href={'./'}>
            <a>Ísland.is</a>
          </Link>
          <span>Recycle your car</span>
        </Breadcrumbs>
      </Box>
      <Box paddingBottom={10}>
        <Stack space={[2, 2]}>
          <Typography variant="h1" as="h1">
            {t.title}
          </Typography>
          <Typography variant="intro">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet
            molestie viverra molestie pharetra vestibulum. Non erat diam, lorem
            malesuada felis nec turpis enim. Maecenas netus sagittis
            pellentesque ultrices est dolor pretium. Aliquam quis rutrum quam
            sed.
          </Typography>
        </Stack>
      </Box>
      <Box paddingBottom={10}>
        <BorderedContent
          showTopContent={true}
          topContent={
            <Box padding={3}>
              <Stack space={[2, 2]}>
                <Typography variant="h2" as="h3">
                  Recycle your car
                </Typography>
                <Typography variant="p" as="p">
                  Login to see all your cars and mark them for recycling
                </Typography>
              </Stack>
            </Box>
          }
          bottomContent={
            <Box padding={3}>
              <Button
                onClick={() => {
                  Router.push({
                    pathname: makePath('myCars')
                  })
                }}
              >
                Log in
              </Button>
            </Box>
          }
        />
      </Box>
      <Box paddingBottom={10}>
        <BorderedContent
          showTopContent={true}
          topContent={
            <Box padding={3}>
              <Stack space={[2, 2]}>
                <Typography variant="h2" as="h3">
                  Find your closes car recyclig company
                </Typography>
                <Typography variant="p" as="p">
                  Here you can find all the connected recyclingcomapnies. Onc
                  you have marked your car for recycling you take to any of
                  these companies for recycling
                </Typography>
              </Stack>
            </Box>
          }
          bottomContent={
            <Box padding={3}>
              <Button
                variant="text"
                onClick={() => {
                  Router.push({
                    pathname: makePath('companies')
                  })
                }}
              >
                <ArrowLink href={''}>
                  Find connected car recycling company
                </ArrowLink>
              </Button>
            </Box>
          }
        />
      </Box>
      <Box paddingBottom={10}>
        <Stack space={2}>
          <Typography variant={'h2'}>How do i recycle my car?</Typography>
          <BulletList type={'ol'}>
            <Bullet> Login to the see all your cars</Bullet>
            <Bullet>Select the one you want to recycle</Bullet>
            <Bullet> Find a car recycling company you like</Bullet>
            <Bullet>
              After you hand over your car to the recycling company, your money
              will be in your account within 2 days.
            </Bullet>
          </BulletList>
        </Stack>
      </Box>
      <Box paddingBottom={10}>
        <FAQ />
      </Box>
    </PageLayout>
  )
}

export default Home
