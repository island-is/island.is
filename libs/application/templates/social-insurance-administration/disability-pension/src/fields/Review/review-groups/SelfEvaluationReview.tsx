import { coreMessages } from '@island.is/application/core'
import { Application, Field, RecordObject } from '@island.is/application/types'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { SectionRouteEnum } from '../../../types'
import { getApplicationAnswers } from '../../../utils'
import * as m from '../../../lib/messages'

interface SelfEvaluationReviewProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
}
export const SelfEvaluationReview: React.FC<SelfEvaluationReviewProps> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  type SelfEvaluationAnswers = {
    hasAssistance: boolean
    maritalStatus: boolean
    residence: boolean
    children: boolean
    icelandicCapability: boolean
    language: boolean
    employment: boolean
    employmentOther: boolean
    previousEmployment: boolean
    previousEmploymentWhen: boolean
    previousEmploymentProfession: boolean
    previousEmploymentProfessionActivity: boolean
    educationLevel: boolean
    employmentCapability: boolean
    employmentImportance: boolean
    rehabilitationOrTherapy: boolean
    rehabilitationOrTherapyResults: boolean
    rehabilitationOrTherapyDescription: boolean
    biggestIssue: boolean
  }

  const {
    hadAssistanceForSelfEvaluation,
    biggestIssue,
    children,
    educationLevel,
    employmentCapability,
    employmentImportance,
    employmentStatus,
    employmentStatusOther,
    icelandicCapability,
    language,
    maritalStatus,
    previousEmployment,
    hasHadRehabilitationOrTherapy,
    rehabilitationOrTherapyResults,
    rehabilitationOrTherapyDescription,
    residence,
    questionnaire,
  } = getApplicationAnswers(application.answers)

  const selfEvaluationsAnswers: SelfEvaluationAnswers = {
    hasAssistance: hadAssistanceForSelfEvaluation !== undefined,
    maritalStatus: maritalStatus !== undefined,
    residence: residence !== undefined,
    children: children !== undefined,
    icelandicCapability: icelandicCapability !== undefined,
    language: language !== undefined,
    employment: employmentStatus !== undefined && employmentStatus.length > 0,
    employmentOther: employmentStatusOther !== undefined,
    previousEmployment:
      previousEmployment !== undefined &&
      previousEmployment.hasEmployment !== undefined,
    previousEmploymentWhen:
      previousEmployment !== undefined && previousEmployment.when !== undefined,
    previousEmploymentProfession:
      previousEmployment !== undefined && previousEmployment.job !== undefined,
    previousEmploymentProfessionActivity:
      previousEmployment !== undefined &&
      previousEmployment.field !== undefined,
    educationLevel: educationLevel !== undefined,
    employmentCapability: employmentCapability !== undefined,
    employmentImportance: employmentImportance !== undefined,
    rehabilitationOrTherapy: hasHadRehabilitationOrTherapy !== undefined,
    rehabilitationOrTherapyResults:
      rehabilitationOrTherapyResults !== undefined,
    rehabilitationOrTherapyDescription:
      rehabilitationOrTherapyDescription !== undefined,
    biggestIssue: biggestIssue !== undefined,
  }

  const hasSelfEvaluationAnswers = selfEvaluationsAnswers
    ? Object.values(selfEvaluationsAnswers).some((value) => value)
    : false

  const hasCapabilityImpairment = questionnaire.find(
    (question) => question.answer !== undefined,
  )

  return (
    <Box marginBottom={3}>
      <Box marginTop={2} display="flex" justifyContent="spaceBetween">
        <Text variant="h4" as="h3" marginBottom={2}>
          {formatMessage(m.selfEvaluation.title)}
        </Text>
        <Button
          variant="utility"
          icon="pencil"
          onClick={() => {
            goToScreen?.(SectionRouteEnum.SELF_EVALUATION)
          }}
        >
          {formatMessage(coreMessages.buttonEdit)}
        </Button>
      </Box>

      <Text>TODO - hefur umsækjandi svarað aðstoðarsp-urningu</Text>
      <Box marginTop={2}>
        <BulletList>
          {hasSelfEvaluationAnswers && (
            <Bullet>{formatMessage(m.selfEvaluation.questionFormTitle)}</Bullet>
          )}
          {hasCapabilityImpairment && (
            <Bullet>{formatMessage(m.capabilityImpairment.title)}</Bullet>
          )}
        </BulletList>
      </Box>
    </Box>
  )
}
