import {
  buildAccordionField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { aboutSpouseForm } from '../../lib/messages'
import {
  currentMonth,
  getNextPeriod,
} from '@island.is/financial-aid/shared/lib'

export const spouseAcceptContract = buildSection({
  id: Routes.SPOUSEACCECPTCONTRACT,
  title: m.aboutSpouseForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.SPOUSEACCECPTCONTRACT,
      title: m.aboutForm.general.pageTitle,
      children: [
        buildDescriptionField({
          id: Routes.SPOUSEACCECPTCONTRACT,
          marginBottom: [4],
          description: (application, locale) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'nationalRegistry.data.fullName',
            )
            return {
              ...aboutSpouseForm.general.description,
              values: {
                spouseName: name,
                currentMonth: currentMonth(locale),
                nextMonth: getNextPeriod(locale).month,
              },
            }
          },
        }),
        buildAccordionField({
          id: Routes.SPOUSEACCECPTCONTRACT,
          title: m.privacyPolicyAccordion.general.sectionTitle,
          accordionItems: (application) => {
            const url = getValueViaPath<string>(
              application.externalData,
              'municipality.data.homepage',
            )
            return [
              {
                itemTitle: m.privacyPolicyAccordion.accordion.title,
                itemContent: url
                  ? {
                      ...m.privacyPolicyAccordion.accordion.aboutWithHomePage,
                      values: { homePageNameUrl: url },
                    }
                  : m.privacyPolicyAccordion.accordion.aboutWithoutHomePage,
              },
            ]
          },
        }),
        buildSubmitField({
          id: 'toDraft',
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
