import React from 'react'
import { motion } from 'framer-motion'
import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  withdrawAccusedAppealDate?: () => void
}

const AccusedAppealInfo: React.FC<Props> = (props) => {
  const { workingCase, withdrawAccusedAppealDate } = props

  const isInvestigationCase =
    workingCase.type !== CaseType.CUSTODY &&
    workingCase.type !== CaseType.TRAVEL_BAN

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
          formatAccusedByGender(
            workingCase.accusedGender,
            NounCases.NOMINATIVE,
            isInvestigationCase,
          ),
        )} hefur kært úrskurðinn ${formatDate(
          workingCase.accusedPostponedAppealDate,
          'PPPp',
        )}`}
        onDismiss={withdrawAccusedAppealDate}
        fluid
        light
      />
    </motion.div>
  )
}

export default AccusedAppealInfo
