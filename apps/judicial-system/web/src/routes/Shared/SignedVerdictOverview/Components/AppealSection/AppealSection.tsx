import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useEffectOnce } from 'react-use'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { signedVerdictOverview } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InfoBox from '@island.is/judicial-system-web/src/components/InfoBox/InfoBox'
import {
  CaseAppealDecision,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { getAppealEndDate } from '@island.is/judicial-system-web/src/utils/stepHelper'

import AccusedAppealDatePicker from '../Accused/AccusedAppealDatePicker'
import AccusedAppealInfo from '../Accused/AccusedAppealInfo'
import ProsecutorAppealDatePicker from '../Prosecutor/ProsecutorAppealDatePicker'
import ProsecutorAppealInfo from '../Prosecutor/ProsecutorAppealInfo'
import * as styles from './AppealSection.css'

interface Props {
  workingCase: Case
  setAccusedAppealDate: (date?: Date) => void
  setProsecutorAppealDate: (date?: Date) => void
  withdrawAccusedAppealDate?: () => void
  withdrawProsecutorAppealDate?: () => void
}

const AppealSection: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {
    workingCase,
    setAccusedAppealDate,
    setProsecutorAppealDate,
    withdrawAccusedAppealDate,
    withdrawProsecutorAppealDate,
  } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const isCourtOfAppeals =
    user?.institution?.type === InstitutionType.COURT_OF_APPEALS

  const [isInitialMount, setIsInitialMount] = useState<boolean>(true)

  useEffectOnce(() => {
    setIsInitialMount(false)
  })

  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h3" as="h3">
          {formatMessage(signedVerdictOverview.sections.appeal.title)}
        </Text>
      </Box>
      {(workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
        workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE) &&
        workingCase.rulingDate &&
        !isCourtOfAppeals && (
          <Box marginBottom={3}>
            <Text>
              {formatMessage(signedVerdictOverview.sections.appeal.deadline, {
                isAppealDeadlineExpired: workingCase.isAppealDeadlineExpired,
                appealDeadline: getAppealEndDate(workingCase.rulingDate),
              })}
            </Text>
          </Box>
        )}
      {workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL && (
        <div className={styles.appealContainer}>
          <BlueBox>
            <InfoBox
              text={formatMessage(
                signedVerdictOverview.sections.appeal.defendantAppealed,
                {
                  rulingDate: `${formatDate(
                    workingCase.rulingDate,
                    'PP',
                  )} kl. ${formatDate(workingCase.rulingDate, 'p')}`,
                },
              )}
              fluid
              light
            />
          </BlueBox>
        </div>
      )}
      {workingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL && (
        <div className={styles.appealContainer}>
          <BlueBox>
            <InfoBox
              text={formatMessage(
                signedVerdictOverview.sections.appeal.prosecutorAppealed,
                {
                  rulingDate: `${formatDate(
                    workingCase.rulingDate,
                    'PP',
                  )} kl. ${formatDate(workingCase.rulingDate, 'p')}`,
                },
              )}
              fluid
              light
            />
          </BlueBox>
        </div>
      )}
      {workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE &&
        (Boolean(workingCase.accusedPostponedAppealDate) ||
          !workingCase.isAppealGracePeriodExpired) && (
          <div className={styles.appealContainer}>
            <BlueBox height={112}>
              <AnimatePresence>
                {!workingCase.accusedPostponedAppealDate &&
                  !workingCase.isAppealGracePeriodExpired && (
                    <AccusedAppealDatePicker
                      workingCase={workingCase}
                      setAccusedAppealDate={setAccusedAppealDate}
                      isInitialMount={isInitialMount}
                    />
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {workingCase.accusedPostponedAppealDate && (
                  <AccusedAppealInfo
                    workingCase={workingCase}
                    withdrawAccusedAppealDate={
                      workingCase.isAppealGracePeriodExpired || isCourtOfAppeals
                        ? undefined
                        : withdrawAccusedAppealDate
                    }
                  />
                )}
              </AnimatePresence>
            </BlueBox>
          </div>
        )}
      {workingCase.prosecutorAppealDecision === CaseAppealDecision.POSTPONE &&
        (Boolean(workingCase.prosecutorPostponedAppealDate) ||
          !workingCase.isAppealGracePeriodExpired) && (
          <div className={styles.appealContainer}>
            <BlueBox height={112}>
              <AnimatePresence>
                {!workingCase.prosecutorPostponedAppealDate &&
                  !workingCase.isAppealGracePeriodExpired && (
                    <ProsecutorAppealDatePicker
                      setProsecutorAppealDate={setProsecutorAppealDate}
                      isInitialMount={isInitialMount}
                    />
                  )}
              </AnimatePresence>
              <AnimatePresence>
                {workingCase.prosecutorPostponedAppealDate && (
                  <ProsecutorAppealInfo
                    prosecutorPostponedAppealDate={
                      workingCase.prosecutorPostponedAppealDate
                    }
                    withdrawProsecutorAppealDate={
                      workingCase.isAppealGracePeriodExpired || isCourtOfAppeals
                        ? undefined
                        : withdrawProsecutorAppealDate
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
