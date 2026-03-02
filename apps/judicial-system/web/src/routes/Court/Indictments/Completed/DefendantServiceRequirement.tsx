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
  InformationForDefendant as InformationForDefendantEnum,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ServiceRequirement } from '@island.is/judicial-system-web/src/graphql/schema'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { InformationForDefendant } from './InformationForDefendant'
import strings from './Completed.strings'

const AnimatedSection = ({
  children,
  show,
  keyProp,
}: {
  children: React.ReactNode
  show: boolean
  keyProp: string
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key={keyProp}
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
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

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
      <BlueBox className={grid({ gap: 3 })}>
        <div className={grid({ gap: 2 })}>
          <SectionHeading
            title={defendant.name || ''}
            marginBottom={0}
            heading="h4"
            required
          />
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
          <RadioButton
            id={`defendant-${defendant.id}-service-requirement-required`}
            name={`defendant-${defendant.id}-service-requirement`}
            checked={verdict.serviceRequirement === ServiceRequirement.REQUIRED}
            disabled={isSentToPublicProsecutor}
            onChange={() => {
              const serviceInfo = new Set([
                ...(verdict.serviceInformationForDefendant || []),
              ])

              if (verdict.isDefaultJudgement) {
                serviceInfo.add(
                  InformationForDefendantEnum.INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES,
                )
              }

              if (defendant.isDrivingLicenseSuspended) {
                serviceInfo.add(
                  InformationForDefendantEnum.DRIVING_RIGHTS_REVOKED_TRANSLATION,
                )
              }

              setAndSendVerdictToServer(
                {
                  defendantId: defendant.id,
                  caseId: workingCase.id,
                  serviceRequirement: ServiceRequirement.REQUIRED,
                  appealDecision: null,
                  serviceInformationForDefendant: Array.from(serviceInfo),
                },
                setWorkingCase,
              )
            }}
            large
            backgroundColor="white"
            label={formatMessage(strings.serviceRequirementRequired)}
          />
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
            tooltip={formatMessage(
              strings.serviceRequirementNotRequiredTooltip,
            )}
          />
        </div>
        <AnimatedSection
          show={
            !verdict.isDefaultJudgement &&
            verdict.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
          }
          keyProp="verdict-appeal-decision"
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
        </AnimatedSection>
        <AnimatedSection
          show={verdict.serviceRequirement === ServiceRequirement.REQUIRED}
          keyProp="information-for-defendant"
        >
          <InformationForDefendant defendant={defendant} />
        </AnimatedSection>
      </BlueBox>
    </Box>
  )
}
