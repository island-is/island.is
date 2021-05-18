import React from 'react'
import { motion } from 'framer-motion'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { CaseGender } from '@island.is/judicial-system/types'

interface Props {
  accusedGender: CaseGender
  accusedPostponedAppealDate?: string
  handleAccusedAppealDismissal?: () => void
}

const AccusedAppealInfo: React.FC<Props> = (props) => {
  const {
    accusedGender,
    accusedPostponedAppealDate,
    handleAccusedAppealDismissal,
  } = props

  const animateInAndOut = {
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
    hidden: { y: 20, opacity: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      key="accusedAppealInfoBox"
      variants={animateInAndOut}
      initial={{ y: 20, opacity: 0 }}
      exit="hidden"
      animate="visible"
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
  )
}

export default AccusedAppealInfo
