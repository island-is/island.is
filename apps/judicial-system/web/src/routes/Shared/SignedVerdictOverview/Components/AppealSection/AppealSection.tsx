import React, { useState } from 'react'
import { motion, AnimatePresence, useIsPresent } from 'framer-motion'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseGender,
} from '@island.is/judicial-system/types'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import * as styles from './AppealSection.treat'
import {
  BlueBox,
  DateTime,
} from '@island.is/judicial-system-web/src/shared-components'
import Accused from '../Accused/Accused'
import AccusedInfo from '../Accused/AccusedInfo'

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
  const [prosecutorAppealDate, setProsecutorAppealDate] = useState<Date>()
  const [accusedRemoved, setAccusedRemoved] = useState<boolean>()
  const [accusedInfoRemoved, setAccusedInfoRemoved] = useState<boolean>()

  const isPresent = useIsPresent()

  const appealDateVariants1 = {
    visible: { y: 0, opacity: 1, transition: { duration: 2, delay: 2 } },
    hidden: { y: 20, opacity: 0, transition: { duration: 2 } },
  }

  const handleAccusedRemoved = () => {
    setAccusedRemoved(true)
  }
  const handleAccusedInfoRemoved = () => {
    setAccusedInfoRemoved(true)
  }

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
      <div className={styles.buttonContainer}>
        <BlueBox height={112}>
          <AnimatePresence exitBeforeEnter>
            {accusedAppealDecision === CaseAppealDecision.POSTPONE &&
              !accusedPostponedAppealDate && (
                <Accused
                  handleAccusedAppeal={handleAccusedAppeal}
                  accusedGender={accusedGender}
                  handleAccusedRemoved={handleAccusedRemoved}
                />
              )}
          </AnimatePresence>

          <AnimatePresence>
            {accusedAppealDecision === CaseAppealDecision.POSTPONE &&
              accusedPostponedAppealDate && (
                <AccusedInfo
                  accusedGender={accusedGender}
                  handleAccusedAppealDismissal={handleAccusedAppealDismissal}
                  accusedPostponedAppealDate={accusedPostponedAppealDate}
                  handleAccusedInfoRemoved={handleAccusedInfoRemoved}
                />
              )}
          </AnimatePresence>
        </BlueBox>
      </div>

      <div className={styles.buttonContainer}>
        <BlueBox height={112}>
          <AnimatePresence exitBeforeEnter>
            {prosecutorAppealDecision === CaseAppealDecision.POSTPONE &&
              !prosecutorPostponedAppealDate && (
                <motion.div
                  key="prosecutorAppealDatepicker"
                  className={styles.accusedAppealDatepicker}
                  initial={false}
                  exit={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.appealInnerWrapper}>
                    <DateTime
                      name="prosecutorAppealDate"
                      maxDate={new Date()}
                      selectedDate={
                        prosecutorPostponedAppealDate
                          ? new Date(prosecutorPostponedAppealDate)
                          : undefined
                      }
                      onChange={(date) => setProsecutorAppealDate(date)}
                      size="sm"
                      blueBox={false}
                    />
                    <Button
                      onClick={() =>
                        handleProsecutorAppeal(prosecutorAppealDate)
                      }
                      disabled={!Boolean(prosecutorAppealDate)}
                    >
                      Sækjandi kærir
                    </Button>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          <AnimatePresence exitBeforeEnter>
            {prosecutorAppealDecision === CaseAppealDecision.POSTPONE &&
              prosecutorPostponedAppealDate && (
                <motion.div
                  key="prosecutorAppealInfoBox"
                  initial={{ y: 50, opacity: 0 }}
                  exit={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <InfoBox
                    text={`Sækjandi hefur kært úrskurðinn ${formatDate(
                      prosecutorPostponedAppealDate,
                      'PPPp',
                    )}`}
                    onDismiss={handleProsecutorAppealDismissal}
                    fluid
                    light
                  />
                </motion.div>
              )}
          </AnimatePresence>
        </BlueBox>
      </div>
    </>
  )
}

export default AppealSection
