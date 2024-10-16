import {
  buildAccordionField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import * as m from '../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'
import {
  currentMonth,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'

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
          description: (application) => {
            const { externalData } = application
            const spouseName = getValueViaPath<string>(
              externalData,
              'nationalRegistry.data.fullName',
            )
            return {
              ...m.aboutSpouseForm.general.description,
              values: {
                spouseName,
                currentMonth: currentMonth(),
                nextMonth: getNextPeriod().month,
              },
            }
          },
          marginBottom: 5,
        }),
        buildAccordionField({
          id: `${Routes.SPOUSEACCECPTCONTRACT}-accordion`,
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
