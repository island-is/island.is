import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import {
  getNextStepsDescription,
  hasIncomeFiles,
  hasSpouse2,
} from '../../../lib/utils'
import { Application, FormValue } from '@island.is/application/types'
import { ConfirmationImage } from '../../../assets/ConfirmationImage'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'

export const confirmationMultiField = buildMultiField({
  id: Routes.CONFIRMATION,
  title: m.confirmation.general.pageTitle, // condition has spouse
  children: [
    buildAlertMessageField({
      id: 'confirmationAlert',
      title: m.confirmation.alertMessagesInRelationship.success,
      alertType: 'success',
      condition: (formValue) => {
        return hasIncomeFiles(formValue)
      },
    }),
    buildAlertMessageField({
      id: 'confirmationAlert',
      title: m.confirmation.alertMessages.dataNeeded,
      message: m.confirmation.alertMessages.dataNeededText,
      alertType: 'warning',
      condition: (formValue) => {
        return !hasIncomeFiles(formValue)
      },
    }),
    buildAlertMessageField({
      id: 'confirmationAlert',
      title: m.confirmation.alertMessagesInRelationship.dataNeeded,
      message: m.confirmation.alertMessagesInRelationship.dataNeededText, // condition for message
      alertType: 'warning',
      condition: (formValue, externalData) => {
        return hasSpouse2(formValue, externalData)
      },
    }),
    buildDescriptionField({
      id: 'confirmationDescription',
      title: m.confirmation.nextSteps.title,
      titleVariant: 'h3',
      marginBottom: 2,
    }),
    buildDescriptionField({
      id: 'confirmationDescription',
      title: '',
      description: (formValue: Application<FormValue>) =>
        getNextStepsDescription(formValue.answers, formValue.externalData),
    }),
    buildDescriptionField({
      id: 'confirmationDescriptionBullets',
      title: '',
      description: () => ({
        ...m.confirmation.nextSteps.content,
        values: { nextMonth: getNextPeriod().month },
      }),
      marginBottom: 5,
    }),
    buildCustomField({
      id: 'confirmation',
      title: '',
      component: 'CopyUrl',
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
})
