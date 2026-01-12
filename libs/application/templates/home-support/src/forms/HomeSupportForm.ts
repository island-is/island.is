import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildActionCardListField,
  buildSubmitField,
  buildTextField,
  buildKeyValueField,
  YES,
  NO,
  buildDividerField,
  coreMessages,
  buildAlertMessageField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryIndividual,
  CurrentHealthCenter,
} from '@island.is/application/types'

import {
  applicantInformationMessages,
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import { mapIndividualToActionCard } from '../utils'
import { HomeSupport } from '../lib/dataSchema'
import { formatPhoneNumber } from '@island.is/application/ui-components'

export const HomeSupportForm: Form = buildForm({
  id: 'HomeSupportDraft',
  title: m.application.general.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.infoSectionTitle,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'legalDomicilePersonsSection',
      title: m.application.applicant.legalDomicilePersonsSectionTitle,
      children: [
        buildMultiField({
          id: 'legalDomicilePersonsSection',
          title: m.application.applicant.legalDomicilePersonsSectionSubtitle,
          children: [
            buildActionCardListField({
              id: 'cohabitants',
              doesNotRequireAnswer: true,
              condition: (_, externalData) => {
                const cohabitants = externalData.nationalRegistryCohabitants
                  .data as NationalRegistryIndividual[]
                return cohabitants.length > 0
              },
              items: (application) => {
                const cohabitants = application.externalData
                  .nationalRegistryCohabitants
                  .data as NationalRegistryIndividual[]
                return cohabitants.map((x) => mapIndividualToActionCard(x))
              },
            }),
            buildAlertMessageField({
              id: 'noCohabitants',
              title: m.application.applicant.legalDomicilePersonsNotFoundTitle,
              message:
                m.application.applicant.legalDomicilePersonsNotFoundDescription,
              alertType: 'info',
              condition: (_, externalData) => {
                const cohabitants = externalData.nationalRegistryCohabitants
                  .data as NationalRegistryIndividual[]
                return cohabitants.length === 0
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'contactsSection',
      title: m.application.contacts.sectionTitle,
      children: [
        buildMultiField({
          id: 'contactsMultiField',
          title: m.application.contacts.sectionTitle,
          description: m.application.contacts.sectionDescription,
          children: [
            buildTableRepeaterField({
              id: 'contacts',
              marginTop: 0,
              formTitle: m.application.contacts.formTitle,
              addItemButtonText: m.application.contacts.addContactButton,
              saveItemButtonText: m.application.contacts.saveContactButton,
              fields: {
                name: {
                  component: 'input',
                  label: applicantInformationMessages.labels.name,
                  width: 'half',
                },
                email: {
                  component: 'input',
                  label: applicantInformationMessages.labels.email,
                  type: 'email',
                  width: 'half',
                },
                phone: {
                  component: 'input',
                  label: applicantInformationMessages.labels.tel,
                  type: 'tel',
                  format: '###-####',
                  width: 'half',
                },
                relation: {
                  component: 'input',
                  label: m.application.contacts.relation,
                  width: 'half',
                },
                mainContact: {
                  component: 'checkbox',
                  label: m.application.contacts.markAsMainContact,
                  width: 'full',
                  backgroundColor: 'white',
                  options: [
                    {
                      label: m.application.contacts.markAsMainContact,
                      value: YES,
                    },
                  ],
                },
              },
              table: {
                format: {
                  phone: (value) => formatPhoneNumber(value),
                  mainContact: (value) =>
                    value?.includes(YES)
                      ? coreMessages.radioYes
                      : coreMessages.radioNo,
                },
                header: [
                  applicantInformationMessages.labels.name,
                  applicantInformationMessages.labels.email,
                  applicantInformationMessages.labels.tel,
                  m.application.contacts.relation,
                  m.application.contacts.mainContact,
                ],
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'doctorSection',
      title: m.application.doctor.sectionTitle,
      children: [
        buildMultiField({
          id: 'doctor',
          title: m.application.doctor.sectionTitle,
          children: [
            buildKeyValueField({
              label: ({ externalData }) =>
                (externalData.currentHealthcenter?.data as CurrentHealthCenter)
                  ?.doctor,
              value: ({ externalData }) =>
                (externalData.currentHealthcenter?.data as CurrentHealthCenter)
                  ?.healthCenter,
              condition: (_, externalData) => {
                return !!(
                  externalData.currentHealthcenter?.data as CurrentHealthCenter
                )?.doctor
              },
            }),
            buildKeyValueField({
              label: m.application.doctor.healthCenterText,
              value: ({ externalData }) =>
                (externalData.currentHealthcenter?.data as CurrentHealthCenter)
                  ?.healthCenter,
              condition: (_, externalData) => {
                const data = externalData.currentHealthcenter
                  ?.data as CurrentHealthCenter
                return !data?.doctor && !!data?.healthCenter
              },
            }),
            buildKeyValueField({
              label: '',
              value: m.application.doctor.notFoundText,
              condition: (_, externalData) => {
                const data = externalData.currentHealthcenter
                  ?.data as CurrentHealthCenter
                return !data?.doctor && !data?.healthCenter
              },
            }),
            buildDescriptionField({
              id: 'doctorServiceDescription',
              titleVariant: 'h2',
              title: m.application.doctor.receivesServiceTitle,
              marginTop: 6,
              marginBottom: 2,
              description: '',
            }),
            buildRadioField({
              id: 'receivesDoctorService',
              required: true,
              options: [
                {
                  value: YES,
                  label: m.application.doctor.doesReceiveServiceText,
                },
                {
                  value: NO,
                  label: m.application.doctor.doesNotReceiveServiceText,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'reasonSection',
      title: m.application.reason.sectionTitle,
      children: [
        buildMultiField({
          id: 'reasonSection',
          title: m.application.reason.sectionTitle,
          description: m.application.reason.sectionSubtitle,
          children: [
            buildTextField({
              id: 'reason',
              title: m.application.reason.inputLabel,
              placeholder: m.application.reason.inputPlaceholder,
              rows: 6,
              variant: 'textarea',
            }),
          ],
        }),
      ],
    }),
    // This section is disabled for now, but kept for future implementation
    // When we can fetch this information from insurance data

    /*  buildSection({
      id: 'exemptionSection',
      title: m.application.exemption.sectionTitle,
      children: [
        buildMultiField({
          id: 'exemptionSection',
          title: m.application.exemption.sectionTitle,
          description: m.application.exemption.description,
          children: [
            buildCheckboxField({
              id: 'exemption',
              defaultValue: [],
              options: [
                {
                  label: m.application.exemption.checkboxText,
                  value: YES,
                },
              ],
              title: '',
            }),
          ],
        }),
      ],
    }), */
    buildSection({
      id: 'overview',
      title: m.application.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.application.overview.sectionTitle,
          space: 3,
          description: m.application.overview.sectionDescription,
          children: [
            buildDividerField({}),

            // Applicant
            buildDescriptionField({
              id: 'applicantOverview',
              title: m.application.overview.applicantTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.name,
              colSpan: '6/12',
              value: ({ answers }) => (answers as HomeSupport).applicant.name,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.nationalId,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as HomeSupport).applicant.nationalId,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.email,
              colSpan: '6/12',
              value: ({ answers }) => (answers as HomeSupport).applicant.email,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.tel,
              colSpan: '6/12',
              condition: (answers) =>
                !!(answers as HomeSupport)?.applicant?.phoneNumber,
              value: ({ answers }) =>
                formatPhoneNumber(
                  (answers as HomeSupport).applicant.phoneNumber,
                ),
            }),
            buildDividerField({}),

            // Doctor
            buildDescriptionField({
              id: 'doctorOverview',
              title: m.application.doctor.sectionTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: m.application.overview.receivesDoctorServiceTitle,
              value: ({ answers }) =>
                (answers as HomeSupport).receivesDoctorService === YES
                  ? coreMessages.radioYes
                  : coreMessages.radioNo,
            }),
            buildDividerField({}),

            // Reason
            buildDescriptionField({
              id: 'reasonOverview',
              title: m.application.reason.sectionTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: '',
              value: ({ answers }) => (answers as HomeSupport).reason,
            }),
            buildDividerField({}),

            // Exemption - Disabled for now

            /* buildDescriptionField({
              id: 'exemptionOverview',
              title: m.application.exemption.sectionTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: m.application.overview.exemptionTitle,
              value: ({ answers }) =>
                (answers as HomeSupport).exemption?.includes(YES)
                  ? coreMessages.radioYes
                  : coreMessages.radioNo,
            }), */
            buildSubmitField({
              id: 'submit',
              title: m.application.general.submit,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.application.general.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: m.application.conclusion.alertTitle,
      expandableHeader: m.application.conclusion.expendableHeader,
      expandableDescription: m.application.conclusion.expendableContent,
    }),
  ],
})
