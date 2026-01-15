import {
  Application,
  ApplicationEventType,
  ApplicationState,
  calcDifferenceInDate,
  getState,
  Routes,
} from '@island.is/financial-aid/shared/lib'
import { Box, Button, Icon, Text, LinkV2 } from '@island.is/island-ui/core'
import React from 'react'

import * as styles from './ApplicationHeader.css'

import { useRouter } from 'next/router'
import { getTagByState } from '@island.is/financial-aid-web/veita/src/utils/formHelper'

import {
  GeneratedProfile,
  GenerateName,
} from '@island.is/financial-aid-web/veita/src/components'
import { useApplicationState } from '@island.is/financial-aid-web/veita/src/utils/useApplicationState'

interface ApplicantProps {
  application: Application
  onClickApplicationState: () => void
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isPrint?: boolean
}

const ApplicationHeader = ({
  application,
  onClickApplicationState,
  setIsLoading,
  setApplication,
  isPrint = false,
}: ApplicantProps) => {
  const router = useRouter()

  const changeApplicationState = useApplicationState()

  const assignEmployee = async () => {
    setIsLoading(true)

    await changeApplicationState(
      application.id,
      ApplicationEventType.ASSIGNCASE,
      application.state === ApplicationState.NEW
        ? ApplicationState.INPROGRESS
        : application.state,
    )
      .then((updatedApplication) => {
        setApplication(updatedApplication)
        setIsLoading(false)
      })
      .catch(() => {
        // TODO: Error
        setIsLoading(false)
      })
  }

  return (
    <Box className={`contentUp ${styles.widthAlmostFull} `}>
      <Box
        marginBottom={isPrint ? 0 : 3}
        display={isPrint ? 'none' : 'flex'}
        justifyContent="spaceBetween"
        alignItems="center"
        width="full"
      >
        <Button
          colorScheme="default"
          iconType="filled"
          onClick={() => {
            router.back()
          }}
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
        >
          Til baka
        </Button>

        {application.state && (
          <div className={`tags ${getTagByState(application.state)}`}>
            {getState[application.state]}
          </div>
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        width="full"
        paddingY={3}
      >
        <Box display="flex" alignItems="center">
          <Box marginRight={2} display="flex">
            <GeneratedProfile size={48} nationalId={application.nationalId} />
          </Box>

          <Text as="h2" variant="h1">
            {GenerateName(application.nationalId, application.name)}
          </Text>
        </Box>

        {application.state && isPrint && (
          <div className={`tags ${getTagByState(application.state)}`}>
            {getState[application.state]}
          </div>
        )}

        <Box display={isPrint ? 'none' : 'block'}>
          <Button
            colorScheme="default"
            icon="pencil"
            iconType="filled"
            onClick={onClickApplicationState}
            preTextIconType="filled"
            size="small"
            type="button"
            variant="ghost"
          >
            Breyta stöðu
          </Button>
        </Box>
      </Box>

      <Box display="flex" marginBottom={isPrint ? 4 : 8}>
        <Box display={isPrint ? 'none' : 'flex'} marginRight={1}>
          {application.staff?.name &&
            application.state !== ApplicationState.NEW && (
              <>
                <Box marginRight={1}>
                  <Text variant="small" fontWeight="semiBold" color="dark300">
                    Umsjá
                  </Text>
                </Box>
                <Box marginRight={1}>
                  <Text variant="small">{application.staff.name}</Text>
                </Box>
              </>
            )}
          <button onClick={assignEmployee} className={styles.button}>
            Sjá um
          </button>

          <Box>
            <Text variant="small">·</Text>
          </Box>
        </Box>

        <Box marginRight={1}>
          <Text variant="small" fontWeight="semiBold" color="dark300">
            Aldur umsóknar
          </Text>
        </Box>
        <Box>
          <Text variant="small">
            {calcDifferenceInDate(application.created)}
          </Text>
        </Box>
        {!isPrint && (
          <>
            <Box marginX={1}>
              <Text variant="small">·</Text>
            </Box>
            <LinkV2
              href={Routes.printApplicationProfile(application.id)}
              target="_blank"
              className={styles.button}
            >
              <Box marginRight={1} display="flex" alignItems="center">
                <Icon icon="print" type="outline" size="small" />
              </Box>
              <span>Prenta umsókn </span>
            </LinkV2>
          </>
        )}
      </Box>
    </Box>
  )
}

export default ApplicationHeader
