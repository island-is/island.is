import {
  buildAccordionField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { DefaultEvents } from '@island.is/application/types'
import { currentMonth } from '@island.is/financial-aid/shared/lib'

export const informationSection = buildSection({
  id: Routes.ACCECPTCONTRACT,
  title: m.aboutForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.ACCECPTCONTRACT,
      title: m.aboutForm.general.pageTitle,
      children: [
        buildDescriptionField({
          id: `${Routes.ACCECPTCONTRACT}-description`,
          title: () => {
            return {
              ...m.aboutForm.general.description,
              values: { currentMonth: currentMonth() },
            }
          },
          titleVariant: 'h5',
          description: m.aboutForm.bulletList.content,
          marginBottom: 5,
        }),
        buildAccordionField({
          id: `${Routes.ACCECPTCONTRACT}-accordion`,
          title: m.privacyPolicyAccordion.general.sectionTitle,
          accordionItems: (application) => {
            const url = getValueViaPath<string>(
              application.externalData,
              'municipality.data.homepage',
            )
            return [
              {
                itemTitle: m.privacyPolicyAccordion.accordion.title,
                itemContent: {
                  ...m.privacyPolicyAccordion.accordion.about,
                  values: {
                    webInfo: url
                      ? `vefsíðunni [${url}](${url})`
                      : 'vefsíðu sveitarfélagsins',
                  },
                },
              },
            ]
          },
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
