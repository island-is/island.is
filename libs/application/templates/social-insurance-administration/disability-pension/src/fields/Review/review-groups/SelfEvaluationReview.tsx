import { coreMessages} from '@island.is/application/core'
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
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

interface SelfEvaluationReviewProps {
  application: Application
  field: Field & { props?: { editable?: boolean } }
  goToScreen?: (id: string) => void
  refetch?: () => void
  errors?: RecordObject
}
export const SelfEvaluationReview: React.FC<SelfEvaluationReviewProps> = ({
  //application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  /* TODO!!!
  type SelfEvaluationAnswers = {
    hadAssistance: boolean
    biggestIssue: string
    children: string
    educationLevel: string
    employmentCapability: string
    employmentImportance: string
    employmentStatus: {
      other: string
      status: string[]
    }
    icelandicCapability: string
    languageSkills: string
    maritalStatus: string
    previousEmployment: {
      when: string
      field: string
      hasEmployment: string
    }
    rehabilitationOrTherapy: string
    residence: string
  }

  const { hadAssistanceForSelfEvaluation, biggestIssue, children, educationLevel, employmentCapability, employmentImportance, employmentStatus, employmentStatusOther, icelandicCapability, language, maritalStatus, previousEmployment, hasHadRehabilitationOrTherapy, residence } = getApplicationAnswers(application.answers)

  const selfEvaluationsAnswers: SelfEvaluationAnswers = {
    hadAssistance: hadAssistanceForSelfEvaluation === YES,
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
    residence,
  }

  const hasSelfEvaluationAnswers = selfEvaluationBackgroundInfo
    ? Object.values(selfEvaluationBackgroundInfo).some((value) => {
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(
            (v) => v !== undefined && v !== null && v !== '',
          )
        }
        return value !== undefined && value !== null && value !== ''
      })
    : false

  const hasCapabilityImpairment = capabilityImpairment
    ? Object.values(capabilityImpairment).some((value) => {
        if (typeof value === 'object' && value !== null) {
          return Object.values(value).some(
            (v) => v !== undefined && v !== null && v !== '',
          )
        }
        return value !== undefined && value !== null && value !== ''
      })
    : false
    */
  return (
    <Box marginBottom={3}>
      <Box marginTop={2} display="flex" justifyContent="spaceBetween">
        <Text variant="h4" as="h3" marginBottom={2}>
          {formatMessage(disabilityPensionFormMessage.selfEvaluation.title)}
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

      <Text></Text>
      <Box marginTop={2}>
        <BulletList>
          {
            /*hasSelfEvaluationAnswers &&*/ <Bullet>
              {formatMessage(
                disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
              )}
            </Bullet>
          }
          {
            /*hasCapabilityImpairment && */ <Bullet>
              {formatMessage(
                disabilityPensionFormMessage.capabilityImpairment.title,
              )}
            </Bullet>
          }
        </BulletList>
      </Box>
    </Box>
  )
}
