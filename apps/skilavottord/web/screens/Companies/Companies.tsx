import React, { useState } from 'react'
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
import * as styles from './Companies.treat'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { Modal } from '@island.is/skilavottord-web/components/Modal/Modal'

const RecyclingCompanies = (props) => {
  console.log(props)
  const { companies } = props

  const [showModal, setModal] = useState(false)

  const {
    activeLocale,
    t: { companies: t },
  } = useI18n()
  const { makePath } = useRouteNames(activeLocale)
  const Router = useRouter()

  const onContinue = () => {
    Router.push(makePath('myCars'))
  }

  const onCancel = () => {
    setModal(true)
  }

  return (
    <ProcessPageLayout>
      <Stack space={3}>
        <Inline space={2}>
          <Box className={styles.iconWrapper}>
            <Icon type="check" color="white" />
          </Box>
          <Typography variant="h1">{t.title}</Typography>
        </Inline>
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
          Router.push(makePath('myCars'))
          setModal(false)
        }}
      />
    </ProcessPageLayout>
  )
}

RecyclingCompanies.getInitialProps = () => {
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

  return { companies }
}

export default RecyclingCompanies
