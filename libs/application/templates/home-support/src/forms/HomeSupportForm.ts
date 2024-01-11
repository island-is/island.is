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
  buildCheckboxField,
  buildDividerField,
  coreMessages,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'

import {
  applicantInformationMessages,
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import { mapIndividualToActionCard } from '../utils'
import { HomeSupport } from '../lib/dataSchema'

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
        buildActionCardListField({
          id: 'cohabitants',
          doesNotRequireAnswer: true,
          title: m.application.applicant.legalDomicilePersonsSectionSubtitle,
          items: (application) => {
            const cohabitants = application.externalData
              .nationalRegistryCohabitants.data as NationalRegistryIndividual[]

            return cohabitants.map((x) => mapIndividualToActionCard(x))
          },
        }),
      ],
    }),
    buildSection({
      id: 'contactsSection',
      title: m.application.contacts.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'contacts',
          title: 'TODO',
          description: 'Here be dragons',
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
              label: 'Mockmundur Testson', // TODO: Get this information from api
              value: 'Teststofnun Mocklands (TSM)',
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
              title: '',
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
    buildSection({
      id: 'exemptionSection',
      title: m.application.exemption.sectionTitle,
      children: [
        buildMultiField({
          id: 'exemptionSection',
          title: m.application.exemption.sectionTitle,
          description: ({ externalData, answers }) => {
            return 'Þú ert með tekjur undir framfærslu o.s.fv...'
          },
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
    }),
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
                (answers as HomeSupport).applicant.phoneNumber,
            }),
            buildDividerField({}),

            // Contacts
            buildDescriptionField({
              id: 'applicantOverview',
              title: m.application.contacts.sectionTitle,
              titleVariant: 'h4',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.name,
              colSpan: '6/12',
              value: 'Mockmundur Testson',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.nationalId,
              colSpan: '6/12',
              value: '1234567890',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.email,
              colSpan: '6/12',
              value: 'test€xamplecom',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.tel,
              colSpan: '6/12',
              value: '888-8888',
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

            // Exemption
            buildDescriptionField({
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
            }),
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
