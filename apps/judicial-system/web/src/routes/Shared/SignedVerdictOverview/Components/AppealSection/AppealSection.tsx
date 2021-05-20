import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Box, Text } from '@island.is/island-ui/core'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  CaseAppealDecision,
  CaseGender,
} from '@island.is/judicial-system/types'
import * as styles from './AppealSection.treat'
import { BlueBox } from '@island.is/judicial-system-web/src/shared-components'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import AccusedAppealInfo from '../Accused/AccusedAppealInfo'
import ProsecutorAppealInfo from '../Prosecutor/ProsecutorAppealInfo'
import AccusedAppealDatePicker from '../Accused/AccusedAppealDatePicker'
import { useEffectOnce } from 'react-use'
import ProsecutorAppealDatePicker from '../Prosecutor/ProsecutorAppealDatePicker'

interface Props {
  rulingDate: string
  accusedGender: CaseGender
  accusedAppealDecision?: CaseAppealDecision
  prosecutorAppealDecision?: CaseAppealDecision
  handleAccusedAppeal: (date?: Date) => void
  handleProsecutorAppeal: (date?: Date) => void
  handleAccusedAppealDismissal?: () => void
  handleProsecutorAppealDismissal?: () => void
  accusedPostponedAppealDate?: string
  prosecutorPostponedAppealDate?: string
  isAppealDeadlineExpired: boolean
  isAppealGracePeriodExpired: boolean
}

const AppealSection: React.FC<Props> = (props) => {
  const {
    rulingDate,
    accusedGender,
    accusedAppealDecision,
    prosecutorAppealDecision,
    accusedPostponedAppealDate,
    prosecutorPostponedAppealDate,
    handleAccusedAppeal,
    handleProsecutorAppeal,
    handleAccusedAppealDismissal,
    handleProsecutorAppealDismissal,
    isAppealDeadlineExpired,
    isAppealGracePeriodExpired,
  } = props

  const [isInitialMount, setIsInitialMount] = useState<boolean>(true)

  useEffectOnce(() => {
    setIsInitialMount(false)
  })

  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h3" as="h3">
          Ákvörðun um kæru
        </Text>
      </Box>
      {!isAppealDeadlineExpired && (
        <Box marginBottom={2}>
          <Text>{`Kærufrestur rennur út ${getAppealEndDate(rulingDate)}`}</Text>
        </Box>
      )}
      {isAppealDeadlineExpired && (
        <div className={styles.appealContainer}>
          <BlueBox>
            <InfoBox
              text={`Kærufrestur rann út ${getAppealEndDate(rulingDate)}`}
              fluid
              light
            />
          </BlueBox>
        </div>
      )}
      {accusedAppealDecision === CaseAppealDecision.POSTPONE &&
        (Boolean(accusedPostponedAppealDate) ||
          !isAppealGracePeriodExpired) && (
          <div className={styles.appealContainer}>
            <BlueBox height={112}>
              <AnimatePresence>
                {!Boolean(accusedPostponedAppealDate) &&
                  !isAppealGracePeriodExpired && (
                    <AccusedAppealDatePicker
                      handleAccusedAppeal={handleAccusedAppeal}
                      accusedGender={accusedGender}
                      isInitialMount={isInitialMount}
                    />
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {accusedPostponedAppealDate && (
                  <AccusedAppealInfo
                    accusedGender={accusedGender}
                    handleAccusedAppealDismissal={
                      isAppealGracePeriodExpired
                        ? undefined
                        : handleAccusedAppealDismissal
                    }
                    accusedPostponedAppealDate={accusedPostponedAppealDate}
                  />
                )}
              </AnimatePresence>
            </BlueBox>
          </div>
        )}
      {prosecutorAppealDecision === CaseAppealDecision.POSTPONE &&
        (Boolean(prosecutorPostponedAppealDate) ||
          !isAppealGracePeriodExpired) && (
          <div className={styles.appealContainer}>
            <BlueBox height={112}>
              <AnimatePresence>
                {!prosecutorPostponedAppealDate &&
                  !isAppealGracePeriodExpired && (
                    <ProsecutorAppealDatePicker
                      handleProsecutorAppeal={handleProsecutorAppeal}
                      isInitialMount={isInitialMount}
                    />
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {prosecutorPostponedAppealDate && (
                  <ProsecutorAppealInfo
                    prosecutorPostponedAppealDate={
                      prosecutorPostponedAppealDate
                    }
                    handleProsecutorAppealDismissal={
                      isAppealGracePeriodExpired
                        ? undefined
                        : handleProsecutorAppealDismissal
                    }
                  />
                )}
              </AnimatePresence>
            </BlueBox>
          </div>
        )}
    </>
  )
}

export default AppealSection
