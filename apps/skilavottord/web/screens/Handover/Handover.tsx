import React, { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Icon,
  Inline,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '../Layouts'
import CompanyList from './components/CompanyList'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { Modal } from '@island.is/skilavottord-web/components/Modal/Modal'

const Handover = (props) => {
  const { companies, car } = props

  const [showModal, setModal] = useState(false)

  const {
    activeLocale,
    t: { handover: t },
  } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  const router = useRouter()

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: makePath('myCars'),
      })
    }
  }, [car])

  const onContinue = () => {
    router.replace(makePath('myCars'))
  }

  const onCancel = () => {
    setModal(true)
  }

  return (
    <ProcessPageLayout>
      <Stack space={3}>
        <Typography variant="h1">{t.title}</Typography>
        <Stack space={4}>
          <Stack space={2}>
            <Typography variant="h3">{t.subTitles.recycle}</Typography>
            <Typography variant="p">{t.info}</Typography>
          </Stack>
          <Typography variant="h3">{t.subTitles.companies}</Typography>
          <CompanyList companies={companies} />
          <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
            <Button variant="redGhost" onClick={onCancel}>
              {t.buttons.cancel}
            </Button>
            <Button variant="normal" onClick={onContinue}>
              {t.buttons.continue}
            </Button>
          </Box>
        </Stack>
      </Stack>
      <Modal
        show={showModal}
        onCancel={() => setModal(false)}
        onContinue={() => {
          router.replace(makePath('myCars'))
          setModal(false)
        }}
      />
    </ProcessPageLayout>
  )
}

Handover.getInitialProps = (ctx) => {
  const { apolloClient, query } = ctx
  const {
    cache: {
      data: { data },
    },
  } = apolloClient

  const car = data[`Car:${query.id}`]

  const companies = [
    {
      name: 'Company 1',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 2',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
    {
      name: 'Company 3',
      address: 'Address',
      phone: '01234',
      website: 'http://www.some-company.is',
    },
  ]

  return { car, companies }
}

export default Handover
