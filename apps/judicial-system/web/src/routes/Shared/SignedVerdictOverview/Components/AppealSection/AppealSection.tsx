import React, { useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { CaseGender } from '@island.is/judicial-system/types'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import * as styles from './AppealSection.treat'

interface Props {
  rulingDate: string
  accusedGender: CaseGender
  handleAccusedAppeal: () => void
  handleProsecutorAppeal: () => void
  accusedPostponedAppealDate?: string
  prosecutorPostponedAppealDate?: string
}

const AppealSection: React.FC<Props> = (props) => {
  const {
    rulingDate,
    accusedGender,
    accusedPostponedAppealDate,
    prosecutorPostponedAppealDate,
    handleAccusedAppeal,
    handleProsecutorAppeal,
  } = props
  const variants = { a: { y: 0, opacity: 1 }, b: { y: 60, opacity: 0 } }

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
          {!accusedPostponedAppealDate && (
            <motion.div
              key="prosecutorAppealButton"
              className={styles.prosecutorAppealButton}
              initial={false}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Button size="small" onClick={handleAccusedAppeal}>
                {`${capitalize(
                  formatAccusedByGender(accusedGender),
                )} kærir úrskurðinn`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={variants}
          // initial={{ y: 60, opacity: 0 }}
          animate={accusedPostponedAppealDate ? variants.a : variants.b}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <InfoBox
            text={`${capitalize(
              formatAccusedByGender(accusedGender),
            )} hefur kært úrskurðinn ${formatDate(
              accusedPostponedAppealDate,
              'PPPp',
            )}`}
          />
        </motion.div>
      </div>
      <div className={styles.buttonContainer}>
        <AnimatePresence>
          {!prosecutorPostponedAppealDate && (
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
          variants={variants}
          animate={prosecutorPostponedAppealDate ? variants.a : variants.b}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <InfoBox
            text={`Sækjandi hefur kært úrskurðinn ${formatDate(
              prosecutorPostponedAppealDate,
              'PPPp',
            )}`}
          />
        </motion.div>
      </div>
    </>
  )
}

export default AppealSection
