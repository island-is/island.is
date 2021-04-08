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

export const ReviewApplication: Form = buildForm({
  id: 'Collect signatures',
  title: m.collectSignatures.applicationTitle,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: m.collectSignatures.stepTitle,
      children: [
        buildMultiField({
          id: 'about',
          title: '',
          children: [
            buildCustomField({
              id: 'disclaimer',
              title: '',
              component: 'SignatureDisclaimer',
            }),
            buildTextField({
              id: 'signature',
              title: m.collectSignatures.nameInput,
              variant: 'text',
              placeholder: m.collectSignatures.nameInput,
              backgroundColor: 'blue',
              width: 'half',
              defaultValue: (application: Application) =>
                fullName(application.externalData),
            }),

            buildSubmitField({
              id: 'sign',
              placement: 'footer',
              title: m.collectSignatures.submitButton,
              actions: [
                {
                  event: 'APPROVE',
                  name: m.collectSignatures.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'disclaimer',
          title: '',
          component: 'SignedConclusion',
        }),
      ],
    }),
  ],
})
