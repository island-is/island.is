import {
  buildCustomField,
  buildForm,
  buildSection,
  buildSubSection,
  buildMultiField,
  Form,
  buildTextField,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { inReview } from '../lib/messages'
import { UploadAttachmentsInReview } from '../fields/UploadAttachmentsInReview'

export const InReview: Form = buildForm({
  id: 'InReview',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        UploadAttachmentsInReview,
        buildSubSection({
          id: 'reviewStuffSubsection',
          title: 'ReviewStuffDerp',
          children: [
            buildMultiField({
              id: 'reviewStuff',
              title: 'hello',
              children: [
                buildTextField({
                  id: 'ReviewForm.stuff',
                  title: 'DERP',
                  backgroundColor: 'blue',
                  width: 'half',
                  required: true,
                  condition: (formData) => {
                    console.log(formData)
                    return true
                  },
                }),
              ],
            }),
            buildCustomField({
              id: 'ReviewFormDerp.derp',
              title: '',
              component: 'ReviewForm',
            }),
          ],
        }),
      ],
    }),
  ],
})
