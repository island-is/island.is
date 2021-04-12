import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  Application,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { NationalRegistryUser } from '@island.is/api/schema'
import { ExternalData } from '@island.is/application/core'

const fullName = (externalData: ExternalData) => {
  const fullName = (externalData?.nationalRegistry?.data as {
    fullName?: NationalRegistryUser
  })?.fullName
  return fullName ?? ''
}

export const EndorsementApplication: Form = buildForm({
  id: 'Endorse',
  title: m.collectEndorsements.applicationTitle,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: m.collectEndorsements.stepTitle,
      children: [
        buildMultiField({
          id: 'about',
          title: '',
          children: [
            buildCustomField({
              id: 'disclaimer',
              title: '',
              component: 'EndorsementDisclaimer',
            }),
            buildTextField({
              id: 'signature',
              title: m.collectEndorsements.nameInput,
              variant: 'text',
              placeholder: m.collectEndorsements.nameInput,
              backgroundColor: 'blue',
              width: 'half',
              defaultValue: (application: Application) =>
                fullName(application.externalData),
            }),

            buildSubmitField({
              id: 'sign',
              placement: 'footer',
              title: m.collectEndorsements.submitButton,
              actions: [
                {
                  event: 'APPROVE',
                  name: m.collectEndorsements.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'approved',
          title: m.endorsementApproved.title,
          component: 'EndorsementApproved',
        }),
      ],
    }),
  ],
})
