import {
  buildCheckboxField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { externalData, terms } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const Terms = buildForm({
  id: 'TermsDraft',
  logo: DirectorateOfLabourLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'termsSection',
      tabTitle: terms.pageTitle,
      children: [
        buildMultiField({
          id: 'termsMultiField',
          title: terms.pageTitle,
          children: [
            buildDescriptionField({
              id: 'termsTitle',
              title: terms.subTitle,
              titleVariant: 'h5',
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'termsDescription',
              description: terms.description,
              marginBottom: 2,
            }),
            buildCheckboxField({
              id: 'approveTerms',
              required: true,
              options: [
                {
                  value: 'terms',
                  label: terms.checkboxText,
                },
              ],
            }),
            buildSubmitField({
              id: 'submitTerms',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: externalData.dataProvider.buttonApprove,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
