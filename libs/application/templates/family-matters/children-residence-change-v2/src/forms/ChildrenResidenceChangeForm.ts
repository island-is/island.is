import {
  buildForm,
  buildSection,
  buildCustomField,
  buildSubSection,
  buildMultiField,
  buildSubmitField,
  buildRadioField,
  buildDescriptionField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { selectDurationInputs } from '../fields/Duration'
import { confirmContractIds } from '../fields/Overview'
import { contactInfoIds } from '../fields/ContactInfo'
import * as m from '../lib/messages'
import { Answers } from '../types'

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
  logo: DistrictCommissionersLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'backgroundInformation',
      title: m.section.backgroundInformation,
      children: [
        buildSubSection({
          id: 'selectChildInCustody',
          title: m.selectChildren.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectedChildren',
              title: m.selectChildren.general.pageTitle,
              component: 'SelectChildren',
            }),
          ],
        }),
        buildSubSection({
          id: 'contact',
          title: m.contactInfo.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'contactInfo',
              title: m.contactInfo.general.pageTitle,
              childInputIds: contactInfoIds,
              component: 'ContactInfo',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'arrangement',
      title: m.section.arrangement,
      children: [
        buildSubSection({
          id: 'residenceChangeReason',
          title: m.reason.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReason',
              title: m.reason.general.pageTitle,
              component: 'Reason',
            }),
          ],
        }),
        buildSubSection({
          id: 'confirmResidenceChangeInfo',
          title: m.newResidence.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'confirmResidenceChangeInfo',
              title: m.newResidence.general.pageTitle,
              component: 'ChangeInformation',
            }),
          ],
        }),
        buildSubSection({
          id: 'childSupportPayments',
          title: m.childSupportPayments.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'childSupportPaymentsMultiField',
              title: m.childSupportPayments.general.sectionTitle,
              description: m.childSupportPayments.general.description,
              children: [
                buildRadioField({
                  id: 'selectChildSupportPayment',
                  backgroundColor: 'white',
                  required: true,
                  options: [
                    {
                      label: m.childSupportPayments.radioAgreement.title,
                      value: 'agreement',
                      subLabel:
                        m.childSupportPayments.radioAgreement.description,
                    },
                    {
                      label: m.childSupportPayments.radioChildSupport.title,
                      value: 'childSupport',
                      subLabel:
                        m.childSupportPayments.radioChildSupport.description,
                    },
                  ],
                }),
                buildAlertMessageField({
                  id: 'alert',
                  message: m.childSupportPayments.general.alert,
                  alertType: 'info',
                  condition: (values) =>
                    (values as unknown as Answers).selectChildSupportPayment ===
                    'agreement',
                }),
                buildDescriptionField({
                  id: 'infoText',
                  space: 2,
                  description: m.childSupportPayments.general.infoText,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'duration',
          title: m.duration.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectDuration',
              title: m.duration.general.pageTitle,
              childInputIds: selectDurationInputs,
              component: 'Duration',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveTerms',
      title: m.section.effect,
      children: [
        buildSubSection({
          id: 'approveTerms',
          title: m.terms.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'approveTerms',
              title: m.terms.general.pageTitle,
              component: 'Terms',
            }),
          ],
        }),
        buildSubSection({
          id: 'approveChildSupportTerms',
          title: m.childSupport.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'approveChildSupportTerms',
              title: m.childSupport.general.pageTitle,
              component: 'ChildSupport',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.section.overview,
      children: [
        buildMultiField({
          id: 'confirmContract',
          title: m.contract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'confirmContract',
              title: m.contract.general.pageTitle,
              childInputIds: confirmContractIds,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assign',
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: m.application.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
