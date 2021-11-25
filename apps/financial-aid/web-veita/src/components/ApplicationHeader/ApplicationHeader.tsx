import {
  Application,
  ApplicationEventType,
  getState,
} from '@island.is/financial-aid/shared/lib'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import React from 'react'

import * as styles from './ApplicationHeader.css'

import { useRouter } from 'next/router'
import {
  calcDifferenceInDate,
  getTagByState,
} from '@island.is/financial-aid-web/veita/src/utils/formHelper'

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
}

const ApplicationHeader = ({
  application,
  onClickApplicationState,
  setIsLoading,
  setApplication,
}: ApplicantProps) => {
  const router = useRouter()

  const changeApplicationState = useApplicationState()

  const assignEmployee = async () => {
    setIsLoading(true)

    await changeApplicationState(
      application.id,
      application.state,
      ApplicationEventType.ASSIGNCASE,
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
        marginBottom={3}
        display="flex"
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
          <Box marginRight={2}>
            <GeneratedProfile size={48} nationalId={application.nationalId} />
          </Box>

          <Text as="h2" variant="h1">
            {GenerateName(application.nationalId)}
          </Text>
        </Box>

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

      <Divider />

      <Box display="flex" marginBottom={8} marginTop={4}>
        {application.staff?.name && (
          <Box display="flex" marginRight={1}>
            <Box marginRight={1}>
              <Text variant="small" fontWeight="semiBold" color="dark300">
                Umsjá
              </Text>
            </Box>
            <Box marginRight={1}>
              <Text variant="small">{application.staff.name}</Text>
            </Box>
            <button onClick={assignEmployee} className={styles.button}>
              Sjá um
            </button>
            <Text variant="small">·</Text>
          </Box>
        )}
        <Box marginRight={1}>
          <Text variant="small" fontWeight="semiBold" color="dark300">
            Aldur umsóknar
          </Text>
        </Box>
        <Text variant="small">{calcDifferenceInDate(application.created)}</Text>
      </Box>
    </Box>
  )
}

export default ApplicationHeader
