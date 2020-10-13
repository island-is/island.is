import React, { useState } from 'react'
import {
  Box,
  Stack,
  Text,
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import CompanyList from './components/CompanyList'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { Modal } from '@island.is/skilavottord-web/components/Modal/Modal'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Handover.treat'

const Handover = () => {
  const [showModal, setModal] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const {
    t: { handover: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const onContinue = () => {
    router.replace(routes.myCars)
  }

  const onCancel = () => {
    setModal(true)
  }

  return (
    <ProcessPageLayout activeSection={1} activeCar={id.toString()}>
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
            <div className={styles.cancelButtonContainer}>
              <button onClick={onCancel} className={styles.cancelButton}>
                <Text variant="h5" color="red400">
                  {t.buttons.cancel}
                </Text>
              </button>
            </div>
          ) : (
            <Button variant="redGhost" onClick={onCancel}>
              {t.buttons.cancel}
            </Button>
          )}
          <Button onClick={onContinue} width={isMobile ? 'fluid' : 'normal'}>
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
