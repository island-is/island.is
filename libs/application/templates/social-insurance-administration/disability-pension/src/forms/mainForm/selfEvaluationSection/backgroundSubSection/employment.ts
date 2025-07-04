import {
  buildMultiField,
  buildCheckboxField,
  buildTextField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { EmploymentStatusEnum, SectionRouteEnum } from '../../../../types'

export const employmentField =
  buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  description: disabilityPensionFormMessage.selfEvaluation.questionFormDescription,
  children: [
    buildCheckboxField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
      width: 'full',
      options: [
        {
          value: EmploymentStatusEnum.NEVER_EMPLOYED,
          label: disabilityPensionFormMessage.questions.employmentStatusNeverEmployed,
        },
        {
          value: EmploymentStatusEnum.SELF_EMPLOYED,
          label: disabilityPensionFormMessage.questions.employmentStatusSelfEmployed,
        },
        {
          value: EmploymentStatusEnum.FULL_TIME_EMPLOYEE,
          label: disabilityPensionFormMessage.questions.employmentStatusFullTimeEmployee,
        },
        {
          value: EmploymentStatusEnum.PART_TIME_EMPLOYEE,
          label: disabilityPensionFormMessage.questions.employmentStatusPartTimeEmployee,
        },
        {
          value: EmploymentStatusEnum.IN_EDUCATION,
          label: disabilityPensionFormMessage.questions.employmentStatusInEducation,
        },
        {
          value: EmploymentStatusEnum.JOB_SEEKING_REGISTERED,
          label: disabilityPensionFormMessage.questions.employmentStatusJobSeekingRegistered,
        },
        {
          value: EmploymentStatusEnum.JOB_SEEKING_NOT_REGISTERED,
          label: disabilityPensionFormMessage.questions.employmentStatusJobSeekingNotRegistered,
        },
        {
          value: EmploymentStatusEnum.VOLUNTARY_WORK,
          label: disabilityPensionFormMessage.questions.employmentStatusVoluntaryWork,
        },
        {
          value: EmploymentStatusEnum.NO_PARTICIPATION_HEALTH_DISABILITY,
          label: disabilityPensionFormMessage.questions.employmentStatusNoParticipationHealthDisability,
        },
      ]
    }),
    buildTextField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.other`,
      title: disabilityPensionFormMessage.questions.employmentStatusOther,
      variant: 'textarea',
      rows: 3,
    }),
  ],
})
