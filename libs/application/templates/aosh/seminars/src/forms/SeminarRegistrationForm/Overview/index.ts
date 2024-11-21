import {
  buildAlertMessageField,
  buildCompanySearchField,
  buildCustomField,
  buildDescriptionField,
  buildLinkField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { overview, paymentArrangement } from '../../../lib/messages'
import { IndividualOrCompany, PaymentOptions } from '../../../shared/contstants'
import { DefaultEvents, FormValue } from '@island.is/application/types'
import { isIndividual, isCompany } from '../../../utils'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection.multiField',
      title: overview.general.pageTitle,
      children: [
        buildCustomField({
          id: 'overview',
          title: '',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: overview.general.approveButton,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.general.approveButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
