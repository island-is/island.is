import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { m } from '../../lib/messages'
import { InaoLogo } from '@island.is/application/assets/institution-logos'

export const done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  logo: InaoLogo,
  children: [
    buildFormConclusionSection({
      alertTitle: m.conclusionAlertTitle,
      alertMessage: (application) => {
        const election = getValueViaPath<string>(
          application.answers,
          'election.genitiveName',
        )
        return {
          ...m.conclusionAlertMessage,
          values: {
            election,
          },
        }
      },
      infoAlertTitle: m.digitalSignatureTitle,
      infoAlertMessage: (application) => {
        const email = getValueViaPath<string>(
          application.answers,
          'about.email',
        )
        return { ...m.digitalSignatureMessage, values: { email } }
      },
      accordion: false,
      sectionTitle: '',
      multiFieldTitle: m.conclusionTabTitle,
      tabTitle: m.conclusionTabTitle,
    }),
  ],
})
