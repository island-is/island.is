import React from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'

import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import InfoBox from '@island.is/judicial-system-web/src/components/InfoBox/InfoBox'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
  withdrawAccusedAppealDate?: () => void
}

const AccusedAppealInfo: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { workingCase, withdrawAccusedAppealDate } = props
  const { formatMessage } = useIntl()

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
        text={
          `${capitalize(
            formatMessage(core.defendant, {
              suffix:
                workingCase.defendants && workingCase.defendants?.length > 1
                  ? 'ar'
                  : 'i',
            }),
          )} hefur kært úrskurðinn ${formatDate(
            workingCase.accusedPostponedAppealDate,
            'PPPp',
          )}` || ''
        }
        onDismiss={withdrawAccusedAppealDate}
        fluid
        light
      />
    </motion.div>
  )
}

export default AccusedAppealInfo
