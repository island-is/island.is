import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { application, notEligible } from '../lib/messages'

export const NotEligible: Form = buildForm({
  id: 'HomeSupportNotEligible',
  title: application.general.name,
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'notEligible',
      children: [
        buildDescriptionField({
          id: 'notEligibleTitle',
          title: notEligible.sectionTitle,
          description: (application) => {
            const { address } = application.externalData.nationalRegistry
              .data as NationalRegistryIndividual
            return {
              ...notEligible.description,
              values: { locality: address?.locality },
            }
          },
          space: 2,
        }),
      ],
    }),
  ],
})
