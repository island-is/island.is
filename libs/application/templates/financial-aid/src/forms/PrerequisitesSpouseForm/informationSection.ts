import {
  buildAccordionField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const informationSection = buildSection({
  id: Routes.SPOUSEACCECPTCONTRACT,
  title: m.aboutSpouseForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSEACCECPTCONTRACT,
      title: m.aboutForm.general.pageTitle,
      children: [
        buildDescriptionField({
          id: `${Routes.SPOUSEACCECPTCONTRACT}-description`,
          title: '',
          description: m.aboutSpouseForm.general.description,
          marginBottom: 5,
        }),
        buildAccordionField({
          id: `${Routes.SPOUSEACCECPTCONTRACT}-accordion`,
          title: m.privacyPolicyAccordion.general.sectionTitle,
          accordionItems: [
            {
              itemTitle: m.privacyPolicyAccordion.accordion.title,
              itemContent: m.privacyPolicyAccordion.accordion.about,
            },
          ],
        }),
        buildSubmitField({
          id: 'toDraft',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.aboutForm.goToApplication.button,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
