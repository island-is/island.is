import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { applicationMessages as m } from '../../lib/messages'
import { hasNoOvernightStays } from '../../utils/homeLodgings'

const hasOvernightStays = (answers: FormValue) => !hasNoOvernightStays(answers)

const propertySummary = (id: string) =>
  buildCustomField({
    id,
    component: 'PropertySummary',
    doesNotRequireAnswer: true,
  })

export const overnightStayRegistrationSection = buildSection({
  id: 'overnightStayRegistration',
  title: m.overnightStaySectionTitle,
  children: [
    buildSubSection({
      id: 'periodSubSection',
      title: m.periodSubsectionTitle,
      children: [
        buildMultiField({
          id: 'periodFields',
          title: m.overnightStaySectionTitle,
          description: m.overnightStaySectionDescription,
          children: [
            propertySummary('periodPropertySummary'),
            buildCheckboxField({
              id: 'noOvernightStays',
              large: false,
              backgroundColor: 'white',
              marginBottom: 3,
              options: [
                {
                  value: 'true',
                  label: m.noOvernightStaysLabel,
                },
              ],
            }),
            buildCustomField({
              id: 'overnightDates',
              component: 'OvernightStayCalendar',
              childInputIds: ['overnightDates'],
              condition: hasOvernightStays,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'priceSubSection',
      title: m.priceSubsectionTitle,
      condition: hasOvernightStays,
      children: [
        buildMultiField({
          id: 'priceFields',
          title: m.overnightStaySectionTitle,
          description: m.overnightStaySectionDescription,
          children: [
            propertySummary('pricePropertySummary'),
            buildCustomField({
              id: 'pricing',
              component: 'Pricing',
              childInputIds: [
                'pricing.method',
                'pricing.monthlyAmounts',
                'pricing.perVisitAmounts',
              ],
              doesNotRequireAnswer: true,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'commentsSubSection',
      title: m.commentsTitle,
      children: [
        buildMultiField({
          id: 'commentsFields',
          title: m.overnightStaySectionTitle,
          description: m.overnightStaySectionDescription,
          children: [
            propertySummary('commentsPropertySummary'),
            buildDescriptionField({
              id: 'commentsDescription',
              title: m.commentsTitle,
              titleVariant: 'h4',
              description: m.commentsDescription,
            }),
            buildTextField({
              id: 'comments',
              title: m.commentsInputTitle,
              variant: 'textarea',
              rows: 6,
              required: false,
            }),
          ],
        }),
      ],
    }),
  ],
})
