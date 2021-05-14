import InfoBox from '@island.is/judicial-system-web/src/shared-components/InfoBox/InfoBox'
import {
  capitalize,
  formatAccusedByGender,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { CaseGender } from '@island.is/judicial-system/types'
import { motion, useIsPresent } from 'framer-motion'
import React, { useEffect } from 'react'

interface Props {
  accusedGender: CaseGender
  accusedPostponedAppealDate?: string
  handleAccusedAppealDismissal?: () => void
  handleAccusedInfoRemoved: () => void
}

const AccusedInfo: React.FC<Props> = (props) => {
  const isPresent = useIsPresent()

  const {
    accusedGender,
    accusedPostponedAppealDate,
    handleAccusedAppealDismissal,
    handleAccusedInfoRemoved,
  } = props
  const appealDateVariants1 = {
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
    hidden: { y: 20, opacity: 0, transition: { duration: 0.4 } },
  }
  useEffect(() => {
    console.log(isPresent)
    !isPresent &&
      setTimeout(() => {
        handleAccusedInfoRemoved()
      }, 1000)
  }, [isPresent])

  return (
    <motion.div
      key="accusedAppealInfoBox"
      variants={appealDateVariants1}
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

export default AccusedInfo
