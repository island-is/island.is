import React, { FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { Box, Stack, Text, Button } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './Handover.treat'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import CompanyList from './components/CompanyList'
import { Modal } from '@island.is/skilavottord-web/components/Modal/Modal'
import { useMutation } from '@apollo/client'
import { CREATE_RECYCLING_REQUEST } from '@island.is/skilavottord-web/graphql/mutations/RecyclingRequest'
import { UserContext } from '@island.is/skilavottord-web/context'
import { OutlinedError } from '@island.is/skilavottord-web/components'

const Handover: FC = () => {
  const { user } = useContext(UserContext)
  const [showModal, setModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { handover: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const [setRecyclingRequest, { error: mutationError }] = useMutation(
    CREATE_RECYCLING_REQUEST,
    {
      onError() {
        return mutationError
      },
    },
  )

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  useEffect(() => {
    setRecyclingRequest({
      variables: {
        permno: id,
        nameOfRequestor: user?.name,
        requestType: 'pendingRecycle',
      },
    })
  }, [user, id])

  const onContinue = () => {
    router.replace(routes.myCars)
  }

  const onCancelRecycling = () => {
    setModal(true)
  }

  const onConfirmCancellation = () => {
    setRecyclingRequest({
      variables: {
        permno: id,
        nameOfRequestor: user?.name,
        requestType: 'cancelled',
      },
    }).then(() => {
      setModal(false)
      router.replace(routes.myCars)
    })
  }

  const onCancelCancellation = () => {
    setModal(false)
  }

  if (mutationError) {
    return (
      <ProcessPageLayout
        sectionType={'citizen'}
        activeSection={1}
        activeCar={id.toString()}
      >
        <Stack space={4}>
          <Text variant="h1">{t.titles.error}</Text>
          <OutlinedError
            title={t.error.title}
            message={t.error.message}
            primaryButton={{
              text: `${t.error.primaryButton}`,
              action: () => router.reload(),
            }}
            secondaryButton={{
              text: `${t.error.secondaryButton}`,
              action: () => router.push(routes.myCars),
            }}
          />
        </Stack>
      </ProcessPageLayout>
    )
  }

  return (
    <ProcessPageLayout
      sectionType={'citizen'}
      activeSection={1}
      activeCar={id.toString()}
    >
      <Stack space={6}>
        <Stack space={2}>
          <Text variant="h1">{t.titles.success}</Text>
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
                onClick={onCancelRecycling}
                variant="text"
                colorScheme="destructive"
              >
                {t.buttons.cancel}
              </Button>
            </Box>
          ) : (
            <Button
              onClick={onCancelRecycling}
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
        onContinue={onConfirmCancellation}
        onCancel={onCancelCancellation}
        title={
          mutationError ? t.cancelModal.titles.error : t.cancelModal.titles.info
        }
        text={t.cancelModal.info}
        continueButtonText={t.cancelModal.buttons.continue}
        cancelButtonText={t.cancelModal.buttons.cancel}
        error={mutationError}
        errorText={t.cancelModal.error}
      />
    </ProcessPageLayout>
  )
}

export default Handover
