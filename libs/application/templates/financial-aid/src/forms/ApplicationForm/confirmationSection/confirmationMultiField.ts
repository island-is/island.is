import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildImageField,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import {
  getNextStepsDescription,
  hasIncomeFiles,
  hasSpouse,
} from '../../../lib/utils'
import { Application, FormValue } from '@island.is/application/types'
import { ConfirmationImage } from '../../../assets/ConfirmationImage'
import { getNextPeriod } from '@island.is/financial-aid/shared/lib'

export const confirmationMultiField = buildMultiField({
  id: Routes.CONFIRMATION,
  title: m.confirmation.general.pageTitle,
  children: [
    buildAlertMessageField({
      id: 'confirmationAlert-1',
      title: m.confirmation.alertMessagesInRelationship.success,
      alertType: 'success',
      condition: (answers) => {
        console.log('!!!Hér: ', answers)
        return !hasIncomeFiles(answers)
      },
    }),
    buildAlertMessageField({
      id: 'confirmationAlert-2',
      title: m.confirmation.alertMessages.dataNeeded,
      message: m.confirmation.alertMessages.dataNeededText,
      alertType: 'warning',
      condition: (answers) => {
        return !hasIncomeFiles(answers)
      },
    }),
    buildAlertMessageField({
      id: 'confirmationAlert-3',
      title: m.confirmation.alertMessagesInRelationship.dataNeeded,
      message: (application) => {
        const spouse = getValueViaPath<boolean>(
          application.externalData,
          'sendSpouseEmail.data.success',
        )
        return spouse
          ? m.confirmation.alertMessagesInRelationship.dataNeededText
          : m.confirmation.alertMessagesInRelationship.dataNeededAlternativeText
      },
      alertType: 'warning',
      condition: (answers, externalData) => {
        return hasSpouse(answers, externalData)
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
      description: (application: Application<FormValue>) =>
        getNextStepsDescription(application.answers, application.externalData),
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
      description: (application) => {
        const url = getValueViaPath<string>(
          application.externalData,
          'municipality.data.homepage',
        )
        return {
          ...m.confirmation.links.content,
          values: {
            statusPage:
              typeof window !== 'undefined' ? window.location.href : '',
            homePage: url ?? '',
          },
        }
      },
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
