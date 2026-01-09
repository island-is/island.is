import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'

import { Box, RadioButton } from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import VerdictAppealDecisionChoice from '@island.is/judicial-system-web/src/components/VerdictAppealDecisionChoice/VerdictAppealDecisionChoice'
import {
  Defendant,
  InformationForDefendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'

import strings from './Completed.strings'
import * as styles from './Completed.css'

export const DefendantServiceRequirement = ({
  defendant,
}: {
  defendant: Defendant
}) => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendVerdictToServer } = useVerdict()
  const { verdict } = defendant

  if (!verdict) {
    return null
  }

  // If the case has been sent to the public prosecutor after completion/correction
  // then lock the service requirement choices
  const isSentToPublicProsecutor = Boolean(
    workingCase.indictmentCompletedDate &&
      workingCase.indictmentSentToPublicProsecutorDate &&
      workingCase.indictmentSentToPublicProsecutorDate >
        workingCase.indictmentCompletedDate,
  )

  return (
    <Box component="section">
      <BlueBox>
        <SectionHeading
          title={defendant.name || ''}
          marginBottom={2}
          heading="h4"
        />
        <Box marginBottom={2}>
          <RadioButton
            id={`defendant-${defendant.id}-service-requirement-not-applicable`}
            name={`defendant-${defendant.id}-service-requirement`}
            checked={
              verdict.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
            }
            disabled={isSentToPublicProsecutor}
            onChange={() => {
              setAndSendVerdictToServer(
                {
                  defendantId: defendant.id,
                  caseId: workingCase.id,
                  serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
                  serviceInformationForDefendant: [],
                },
                setWorkingCase,
              )
            }}
            large
            backgroundColor="white"
            label={formatMessage(strings.serviceRequirementNotApplicable)}
          />
        </Box>
        <Box marginBottom={2}>
          <RadioButton
            id={`defendant-${defendant.id}-service-requirement-required`}
            name={`defendant-${defendant.id}-service-requirement`}
            checked={verdict.serviceRequirement === ServiceRequirement.REQUIRED}
            disabled={isSentToPublicProsecutor}
            onChange={() => {
              setAndSendVerdictToServer(
                {
                  defendantId: defendant.id,
                  caseId: workingCase.id,
                  serviceRequirement: ServiceRequirement.REQUIRED,
                  appealDecision: null,
                  ...(verdict.isDefaultJudgement
                    ? {
                        serviceInformationForDefendant: [
                          ...(verdict.serviceInformationForDefendant || []),
                          InformationForDefendant.INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES,
                        ],
                      }
                    : {}),
                },
                setWorkingCase,
              )
            }}
            large
            backgroundColor="white"
            label={formatMessage(strings.serviceRequirementRequired)}
          />
        </Box>
        <RadioButton
          id={`defendant-${defendant.id}-service-requirement-not-required`}
          name={`defendant-${defendant.id}-service-requirement`}
          checked={
            verdict.serviceRequirement === ServiceRequirement.NOT_REQUIRED
          }
          disabled={isSentToPublicProsecutor}
          onChange={() => {
            setAndSendVerdictToServer(
              {
                defendantId: defendant.id,
                caseId: workingCase.id,
                serviceRequirement: ServiceRequirement.NOT_REQUIRED,
                appealDecision: null,
                serviceInformationForDefendant: [],
              },
              setWorkingCase,
            )
          }}
          large
          backgroundColor="white"
          label={formatMessage(strings.serviceRequirementNotRequired)}
          tooltip={formatMessage(strings.serviceRequirementNotRequiredTooltip)}
        />
        <AnimatePresence>
          {!verdict.isDefaultJudgement &&
            verdict.serviceRequirement ===
              ServiceRequirement.NOT_APPLICABLE && (
              <motion.div
                key="verdict-appeal-decision"
                className={styles.motionBox}
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  transition: {
                    opacity: { delay: 0.2 },
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    height: { delay: 0.2 },
                  },
                }}
              >
                <SectionHeading
                  heading="h4"
                  title="Afstaða dómfellda til dóms"
                  marginBottom={2}
                  required
                />
                <VerdictAppealDecisionChoice
                  defendant={defendant}
                  verdict={verdict}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </BlueBox>
    </Box>
  )
}
