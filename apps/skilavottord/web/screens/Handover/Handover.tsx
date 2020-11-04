import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { Box, Stack, Text, Button } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Handover.treat'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import CompanyList from './components/CompanyList'
import { Modal } from '@island.is/skilavottord-web/components/Modal/Modal'

const Handover: FC = () => {
  const [showModal, setModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { handover: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const onContinue = () => {
    router.replace(routes.myCars)
  }

  const onCancel = () => {
    setModal(true)
  }

  return (
    <ProcessPageLayout
      sectionType={'citizen'}
      activeSection={1}
      activeCar={id.toString()}
    >
      <Stack space={6}>
        <Stack space={2}>
          <Text variant="h1">{t.title}</Text>
          <Text>{t.info}</Text>
        </Stack>
        <Stack space={2}>
          <Text variant="h3">{t.subTitles.nextStep}</Text>
          <Text>{t.subInfo}</Text>
        </Stack>
        <Stack space={[3, 3, 4, 4]}>
          <Text variant="h3">{t.subTitles.companies}</Text>
          <CompanyList />
        </Stack>
        <Box display="flex" justifyContent="spaceBetween" flexWrap="wrap">
          {isMobile ? (
            <Box paddingBottom={4} className={styles.cancelButtonContainer}>
              <Button
                onClick={onCancel}
                variant="text"
                colorScheme="destructive"
              >
                {t.buttons.cancel}
              </Button>
            </Box>
          ) : (
            <Button
              onClick={onCancel}
              variant="ghost"
              colorScheme="destructive"
            >
              {t.buttons.cancel}
            </Button>
          )}
          <Button onClick={onContinue} fluid={isMobile}>
            {t.buttons.close}
          </Button>
        </Box>
      </Stack>
      <Modal
        show={showModal}
        onCancel={() => setModal(false)}
        onContinue={() => {
          router.replace(routes.myCars)
          setModal(false)
        }}
        title={t.cancelModal.title}
        text={t.cancelModal.info}
        continueButtonText={t.cancelModal.buttons.continue}
        cancelButtonText={t.cancelModal.buttons.cancel}
      />
    </ProcessPageLayout>
  )
}

export default Handover
