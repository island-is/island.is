import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildTitleField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FormValue } from '@island.is/application/types'
import { disabilityPensionFormMessage } from '../../../../lib/messages'
import { SectionRouteEnum } from '../../../../types'
import { getYears } from '../../../../utils/dates'
import {
  mockProfessionCategories,
  mockProfessionJobTitle,
} from '../../../../utils/mockData'

export const previousEmploymentField = buildMultiField({
  id: SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT,
  title: disabilityPensionFormMessage.selfEvaluation.questionFormTitle,
  children: [
    buildRadioField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
      title: disabilityPensionFormMessage.questions.previousEmploymentTitle,
      width: 'half',
      options: [
        {
          value: YES,
          label: socialInsuranceAdministrationMessage.shared.yes,
        },
        {
          value: NO,
          label: socialInsuranceAdministrationMessage.shared.no,
        },
      ],
    }),

    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentWhen,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.when`,
      title: disabilityPensionFormMessage.shared.year,
      width: 'half',
      placeholder: disabilityPensionFormMessage.shared.chooseYear,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      options: () => {
        //TODO: Validate that the user is not selecting more than two years (calculate months as well)
        const years = getYears(20)
        return years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }))
      },
    }),

    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentJob,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.job`,
      title: disabilityPensionFormMessage.questions.profession,
      width: 'full',
      placeholder: disabilityPensionFormMessage.questions.chooseProfession,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      options: () => {
        //TODO: Validate that the user is not selecting more than two years (calculate months as well)
        return mockProfessionJobTitle.map((category) => ({
          value: category.id.toString(),
          label: category.title,
        }))
      },
    }),

    buildTitleField({
      title: disabilityPensionFormMessage.questions.previousEmploymentField,
      titleVariant: 'h5',
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
    }),
    buildSelectField({
      id: `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.field`,
      title: disabilityPensionFormMessage.questions.profession,
      width: 'full',
      placeholder: disabilityPensionFormMessage.questions.chooseProfession,
      condition: (formValue: FormValue) => {
        const hasPreviousEmployment = getValueViaPath<string>(
          formValue,
          `${SectionRouteEnum.BACKGROUND_INFO_PREVIOUS_EMPLOYMENT}.hasEmployment`,
        )
        return hasPreviousEmployment === YES
      },
      options: () => {
        //TODO: Validate that the user is not selecting more than two years (calculate months as well)
        return mockProfessionCategories.map((category) => ({
          value: category.id.toString(),
          label: category.title,
        }))
      },
    }),
  ],
})
