import React from 'react'
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
import { DateTime } from '@island.is/judicial-system-web/src/shared-components'

interface Props {
  rulingDate: string
  accusedGender: CaseGender
  accusedAppealDecision?: CaseAppealDecision
  prosecutorAppealDecision?: CaseAppealDecision
  handleAccusedAppeal: () => void
  handleProsecutorAppeal: () => void
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
  } = props

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
              <>
                <DateTime
                  name="prosecutorAppealDate"
                  maxDate={new Date()}
                  selectedDate={
                    prosecutorPostponedAppealDate
                      ? new Date(prosecutorPostponedAppealDate)
                      : undefined
                  }
                  onChange={() => console.log('here')}
                  size="sm"
                  blueBox={false}
                />
                <motion.div
                  key="prosecutorAppealButton"
                  className={styles.prosecutorAppealButton}
                  initial={false}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Button onClick={handleAccusedAppeal}>
                    {`${capitalize(
                      formatAccusedByGender(accusedGender),
                    )} kærir úrskurðinn`}
                  </Button>
                </motion.div>
              </>
            )}
        </AnimatePresence>

        <motion.div
          variants={appealDateVariants}
          animate={
            accusedPostponedAppealDate
              ? appealDateVariants.visible
              : appealDateVariants.hidden
          }
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <InfoBox
            text={`${capitalize(
              formatAccusedByGender(accusedGender),
            )} hefur kært úrskurðinn ${formatDate(
              accusedPostponedAppealDate,
              'PPPp',
            )}`}
            fluid
          />
        </motion.div>
      </div>
      <div className={styles.buttonContainer}>
        <AnimatePresence>
          {prosecutorAppealDecision === CaseAppealDecision.POSTPONE &&
            !prosecutorPostponedAppealDate && (
              <motion.div
                key="prosecutorAppealButton"
                className={styles.prosecutorAppealButton}
                initial={false}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Button size="small" onClick={handleProsecutorAppeal}>
                  Sækjandi kærir úrskurðinn
                </Button>
              </motion.div>
            )}
        </AnimatePresence>

        <motion.div
          variants={appealDateVariants}
          animate={
            prosecutorPostponedAppealDate
              ? appealDateVariants.visible
              : appealDateVariants.hidden
          }
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <InfoBox
            text={`Sækjandi hefur kært úrskurðinn ${formatDate(
              prosecutorPostponedAppealDate,
              'PPPp',
            )}`}
            fluid
          />
        </motion.div>
      </div>
    </>
  )
}

export default AppealSection
