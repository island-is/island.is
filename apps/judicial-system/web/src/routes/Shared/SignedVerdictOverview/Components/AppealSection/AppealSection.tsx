import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [accusedAppealDate, setAccusedAppealDate] = useState<Date>()
  const [prosecutorAppealDate, setProsecutorAppealDate] = useState<Date>()

  const appealDateVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: 60, opacity: 0 },
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
        <AnimatePresence>
          {accusedAppealDecision === CaseAppealDecision.POSTPONE &&
            !accusedPostponedAppealDate && (
              <motion.div
                key="accusedAppealDatepicker"
                className={styles.accusedAppealDatepicker}
                initial={false}
                exit={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <BlueBox>
                  <div className={styles.appealInnerWrapper}>
                    <DateTime
                      name="accusedAppealDate"
                      maxDate={new Date()}
                      selectedDate={
                        accusedPostponedAppealDate
                          ? new Date(accusedPostponedAppealDate)
                          : undefined
                      }
                      onChange={(date) => setAccusedAppealDate(date)}
                      size="sm"
                      blueBox={false}
                    />
                    <Button
                      onClick={() => handleAccusedAppeal(accusedAppealDate)}
                      disabled={!Boolean(accusedAppealDate)}
                    >
                      {`${capitalize(
                        formatAccusedByGender(accusedGender),
                      )} kærir`}
                    </Button>
                  </div>
                </BlueBox>
              </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
          {accusedAppealDecision === CaseAppealDecision.POSTPONE &&
            accusedPostponedAppealDate && (
              <motion.div
                key="accusedAppealInfoBox"
                //  variants={appealDateVariants}
                initial={{ y: 50, opacity: 0 }}
                exit={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <InfoBox
                  text={`${capitalize(
                    formatAccusedByGender(accusedGender),
                  )} hefur kært úrskurðinn ${formatDate(
                    accusedPostponedAppealDate,
                    'PPPp',
                  )}`}
                  onDismiss={handleAccusedAppealDismissal}
                  fluid
                  light
                />
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default AppealSection
