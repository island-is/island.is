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
  prosecutorPostponedAppealDate?: string
  handleProsecutorAppealDismissal?: () => void
}

const ProsecutorInfo: React.FC<Props> = (props) => {
  const isPresent = useIsPresent()

  const {
    prosecutorPostponedAppealDate,
    handleProsecutorAppealDismissal,
  } = props

  const appealDateVariants1 = {
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
    hidden: { y: 20, opacity: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      key="prosecutorAppealInfoBox"
      variants={appealDateVariants1}
      initial={{ y: 20, opacity: 0 }}
      exit="hidden"
      animate="visible"
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
  )
}

export default ProsecutorInfo
