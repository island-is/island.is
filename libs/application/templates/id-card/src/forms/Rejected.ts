import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
// import { Logo } from '../../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { reviewRejection } from '../lib/messages'
import { Application } from '@island.is/application/types'
import { Routes } from '../lib/constants'

// Change messages
export const Rejected: Form = buildForm({
  id: 'Rejected',
  // logo: Logo,
  mode: FormModes.REJECTED,
  children: [
    buildFormConclusionSection({
      sectionTitle: reviewRejection.general.sectionTitle,
      multiFieldTitle: reviewRejection.general.sectionTitle,
      alertType: 'error',
      alertTitle: (application: Application) => {
        const childName = getValueViaPath(
          application.answers,
          `${Routes.APPLICATIONINFORMATION}.applicantName`,
          '',
        ) as string
        return {
          ...reviewRejection.general.alertTitle,
          values: { name: childName },
        }
      },
      alertMessage: '',
      expandableHeader: reviewRejection.general.accordionTitle,
      expandableIntro: '',
      expandableDescription: (application: Application) => {
        const guardian = getValueViaPath(
          application.answers,
          `${Routes.FIRSTGUARDIANINFORMATION}.name`,
          '',
        ) as string
        return {
          ...reviewRejection.general.accordionText,
          values: { guardian1: guardian },
        }
      },
      bottomButtonMessage: reviewRejection.general.bottomButtonMessage,
    }),
  ],
})
