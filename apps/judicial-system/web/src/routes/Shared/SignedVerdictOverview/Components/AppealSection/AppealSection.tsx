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
      <Box marginBottom={2}>
        <Text>{`Kærufrestur rennur út ${getAppealEndDate(rulingDate)}`}</Text>
      </Box>
      {accusedAppealDecision === CaseAppealDecision.POSTPONE && (
        <div className={styles.appealContainer}>
          <BlueBox height={120}>
            <AnimatePresence>
              {!accusedPostponedAppealDate && (
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
                  handleAccusedAppealDismissal={handleAccusedAppealDismissal}
                  accusedPostponedAppealDate={accusedPostponedAppealDate}
                />
              )}
            </AnimatePresence>
          </BlueBox>
        </div>
      )}
      {prosecutorAppealDecision === CaseAppealDecision.POSTPONE && (
        <div className={styles.appealContainer}>
          <BlueBox height={120}>
            <AnimatePresence>
              {!prosecutorPostponedAppealDate && (
                <ProsecutorAppealDatePicker
                  handleProsecutorAppeal={handleProsecutorAppeal}
                  isInitialMount={isInitialMount}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {prosecutorPostponedAppealDate && (
                <ProsecutorAppealInfo
                  prosecutorPostponedAppealDate={prosecutorPostponedAppealDate}
                  handleProsecutorAppealDismissal={
                    handleProsecutorAppealDismissal
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
