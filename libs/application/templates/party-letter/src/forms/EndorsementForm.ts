import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  buildCheckboxField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  Application,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { NationalRegistryUser } from '@island.is/api/schema'
import Logo from '../assets/Logo'

const fullName = (externalData: Application) => {
  const fullName = (externalData.externalData?.nationalRegistry?.data as {
    fullName?: NationalRegistryUser
  })?.fullName
  return fullName ?? ''
}

export const EndorsementForm: Form = buildForm({
  id: 'Endorsement form',
  title: m.endorsementForm.title,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: m.endorsementForm.stepTitle,
      children: [
        buildMultiField({
          id: 'about',
          title: m.endorsementForm.sectionTitle,
          children: [
            buildCustomField({
              id: 'disclaimer',
              title: '',
              component: 'EndorsementDisclaimer',
            }),
            buildTextField({
              id: 'signature',
              title: m.endorsementForm.nameInput,
              variant: 'text',
              placeholder: m.endorsementForm.nameInput,
              backgroundColor: 'blue',
              width: 'half',
              // TODO: fix this, get name of logged in user
              defaultValue: (application: Application) => fullName(application),
            }),
            buildDescriptionField({
              id: 'firstDescription',
              title: '',
              space: 5,
              description: m.endorsementForm.descriptionPt1,
            }),
            buildDescriptionField({
              id: 'secondDescription',
              title: '',
              space: 4,
              description: m.endorsementForm.descriptionPt2,
            }),
            buildCheckboxField({
              id: 'terms',
              title: '',
              options: [
                { value: 'agree', label: m.endorsementForm.agreeTermsLabel },
              ],
              large: true,
              backgroundColor: 'blue',
              defaultValue: () => '',
            }),

            buildSubmitField({
              id: 'sign',
              placement: 'footer',
              title: m.endorsementForm.submitButton,
              actions: [
                {
                  event: 'APPROVE',
                  name: m.endorsementForm.submitButton,
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
