import { buildForm, getValueViaPath } from '@island.is/application/core'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { FormModes } from '@island.is/application/types'
import { HeilsugaeslaHofudborgarsvaedisinsLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

export const fullyBookedForm = buildForm({
  id: 'fullyBookedForm',
  mode: FormModes.COMPLETED,
  logo: HeilsugaeslaHofudborgarsvaedisinsLogo,
  children: [
    buildFormConclusionSection({
      sectionTitle: m.fullyBookedForm.sectionTitle,
      tabTitle: m.fullyBookedForm.sectionTitle,
      multiFieldTitle: m.fullyBookedForm.multiFieldTitle,
      alertType: 'error',
      alertTitle: m.fullyBookedForm.alertTitle,
      alertMessage: (application) => {
        const slotsAvailable = getValueViaPath<number>(
          application.externalData,
          'hhCoursesParticipantAvailability.data.slotsAvailable',
        )

        if (
          typeof slotsAvailable === 'number' &&
          Number.isFinite(slotsAvailable)
        ) {
          return {
            ...m.fullyBookedForm.alertMessageWithSlots,
            values: { slotsAvailable },
          }
        }

        return m.fullyBookedForm.alertMessage
      },
      expandableHeader: m.fullyBookedForm.expandableHeader,
      expandableIntro: m.fullyBookedForm.expandableIntro,
      expandableDescription: m.fullyBookedForm.expandableDescription,
      bottomButtonLabel: m.fullyBookedForm.bottomButtonLabel,
      bottomButtonMessage: m.fullyBookedForm.bottomButtonMessage,
      bottomButtonLink: '/umsoknir/hh-namskeid',
    }),
  ],
})
