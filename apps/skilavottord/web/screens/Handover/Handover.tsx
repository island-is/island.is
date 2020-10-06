import React, { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button } from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import CompanyList from './components/CompanyList'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { Modal } from '@island.is/skilavottord-web/components/Modal/Modal'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Handover.treat'

const Handover = (props) => {
  const { companies, apolloState } = props

  const [showModal, setModal] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const {
    activeLocale,
    t: { handover: t },
  } = useI18n()
  const { makePath } = useRouteNames(activeLocale)

  const router = useRouter()
  const { id } = router.query

  const car = apolloState[`Car:${id}`]

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
    <>
      {car && (
        <ProcessPageLayout activeSection={1} activeCar={id.toString()}>
          <Stack space={6}>
            <Stack space={2}>
              <Typography variant="h1">{t.title}</Typography>
              <Typography variant="p">{t.info}</Typography>
            </Stack>
            <Stack space={[3, 3, 4, 4]}>
              <Typography variant="h3">{t.subTitles.companies}</Typography>
              <CompanyList companies={companies} />
            </Stack>
            <Box display="flex" justifyContent="spaceBetween" flexWrap="wrap">
              {isMobile ? (
                <div className={styles.cancelButtonContainer}>
                  <button onClick={onCancel} className={styles.cancelButton}>
                    <Typography variant="h5" color="red400">
                      {t.buttons.cancel}
                    </Typography>
                  </button>
                </div>
              ) : (
                <Button variant="redGhost" onClick={onCancel}>
                  {t.buttons.cancel}
                </Button>
              )}
              <Button
                variant="normal"
                onClick={onContinue}
                width={isMobile ? 'fluid' : 'normal'}
              >
                {t.buttons.continue}
              </Button>
            </Box>
          </Stack>
          <Modal
            show={showModal}
            onCancel={() => setModal(false)}
            onContinue={() => {
              router.replace(makePath('myCars'))
              setModal(false)
            }}
            title={t.cancelModal.title}
            text={t.cancelModal.info}
            continueButtonText={t.cancelModal.buttons.continue}
            cancelButtonText={t.cancelModal.buttons.cancel}
          />
        </ProcessPageLayout>
      )}
    </>
  )
}

Handover.getInitialProps = () => {
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

export default Handover
