import {
  buildAlertMessageField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { ConfirmationImage } from '../../assets/ConfirmationImage'
import { Application, FormValue } from '@island.is/application/types'
import {
  getSpouseNextStepsDescription,
  hasSpouseIncomeFiles,
} from '../../lib/utils'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'

export const spouseConfirmationSection = buildSection({
  id: Routes.SPOUSECONFIRMATION,
  title: m.confirmation.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSECONFIRMATION,
      title: m.confirmation.general.pageTitle,
      children: [
        buildAlertMessageField({
          id: 'confirmationAlert',
          title: m.confirmation.alertMessages.success,
          alertType: 'success',
          condition: (formValue) => {
            return hasSpouseIncomeFiles(formValue)
          },
        }),
        buildAlertMessageField({
          id: 'confirmationAlert',
          title: m.confirmation.alertMessages.dataNeeded,
          message: m.confirmation.alertMessages.dataNeededText,
          alertType: 'warning',
          condition: (formValue) => {
            return !hasSpouseIncomeFiles(formValue)
          },
        }),
        buildDescriptionField({
          id: 'confirmationDescription',
          title: m.confirmation.nextSteps.title,
          titleVariant: 'h3',
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'confirmationDescriptionFirstBullet',
          title: '',
          description: (formValue: Application<FormValue>) =>
            getSpouseNextStepsDescription(
              formValue.answers,
              formValue.externalData,
            ),
        }),
        buildDescriptionField({
          id: 'confirmationDescriptionBullets',
          title: '',
          description: () => {
            return {
              ...m.confirmation.nextSteps.content,
              values: {
                nextMonth: getNextPeriod().month,
              },
            }
          },
          marginBottom: 5,
        }),
        buildDescriptionField({
          id: 'confirmationLinks',
          title: m.confirmation.links.title,
          titleVariant: 'h3',
          description: m.confirmation.links.content,
          marginTop: 5,
          marginBottom: 5,
        }),
        buildImageField({
          id: 'confirmationImage',
          title: '',
          image: ConfirmationImage,
          marginBottom: 5,
        }),
      ],
    }),
  ],
})
