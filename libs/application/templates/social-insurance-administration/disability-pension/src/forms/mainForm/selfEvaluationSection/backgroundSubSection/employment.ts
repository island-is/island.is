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
  title: disabilityPensionFormMessage.questions.employmentStatusTitle,
  children: [
    buildCheckboxField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_EMPLOYMENT}.status`,
      width: 'full',
      options: [
        {
          value: EmploymentStatusEnum.neverEmployed,
          label: disabilityPensionFormMessage.questions.employmentStatusNeverEmployed,
        },
        {
          value: EmploymentStatusEnum.selfEmployed,
          label: disabilityPensionFormMessage.questions.employmentStatusSelfEmployed,
        },
        {
          value: EmploymentStatusEnum.fullTimeEmployee,
          label: disabilityPensionFormMessage.questions.employmentStatusFullTimeEmployee,
        },
        {
          value: EmploymentStatusEnum.partTimeEmployee,
          label: disabilityPensionFormMessage.questions.employmentStatusPartTimeEmployee,
        },
        {
          value: EmploymentStatusEnum.inEducation,
          label: disabilityPensionFormMessage.questions.employmentStatusInEducation,
        },
        {
          value: EmploymentStatusEnum.jobSeekingRegistered,
          label: disabilityPensionFormMessage.questions.employmentStatusJobSeekingRegistered,
        },
        {
          value: EmploymentStatusEnum.jobSeekingNotRegistered,
          label: disabilityPensionFormMessage.questions.employmentStatusJobSeekingNotRegistered,
        },
        {
          value: EmploymentStatusEnum.voluntaryWork,
          label: disabilityPensionFormMessage.questions.employmentStatusVoluntaryWork,
        },
        {
          value: EmploymentStatusEnum.noParticipationHealthDisability,
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
