import {
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  getValueViaPath,
} from '@island.is/application/core'
import { buildKeyValueField } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { HealthInsuranceDeclaration } from '../../lib/dataSchema'
import { buildSubmitField } from '@island.is/application/core'
import { ApplicantType } from '../../shared/constants'
import {
  getContinentNameFromCode,
  getCountryNameFromCode,
  getSelectedApplicants,
  hasFamilySelected,
} from '../../utils'
import format from 'date-fns/format'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { removeCountryCode } from '@island.is/application/ui-components'
import * as m from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overview',
  title: m.application.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: m.application.overview.sectionTitle,
      description: m.application.overview.sectionDescription,
      space: 3,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewStudentOrTouristTtile',
          title: m.application.overview.studentOrTouristTitle,
          titleVariant: 'h4',
        }),
        buildKeyValueField({
          label: '',
          value: ({ answers }) =>
            (answers as HealthInsuranceDeclaration)
              .studentOrTouristRadioFieldTourist === ApplicantType.TOURIST
              ? m.application.overview.studentOrTouristTouristText
              : m.application.overview.studentOrTouristStudentText,
        }),
        buildDividerField({}),
        // Applicant Info
        buildDescriptionField({
          id: 'overviewApplicantInfoTitile',
          title: m.application.overview.applicantInfoTitle,
          titleVariant: 'h4',
        }),
        buildKeyValueField({
          label: applicantInformationMessages.labels.name,
          colSpan: '6/12',
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'applicant.name'),
        }),
        buildKeyValueField({
          label: applicantInformationMessages.labels.nationalId,
          colSpan: '6/12',
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'applicant.nationalId'),
        }),
        buildKeyValueField({
          label: applicantInformationMessages.labels.address,
          colSpan: '6/12',
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'applicant.address'),
        }),
        buildKeyValueField({
          label: applicantInformationMessages.labels.postalCode,
          colSpan: '6/12',
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'applicant.postalCode'),
        }),
        buildKeyValueField({
          label: applicantInformationMessages.labels.email,
          colSpan: '6/12',
          value: ({ answers }) =>
            getValueViaPath<string>(answers, 'applicant.email'),
        }),
        buildKeyValueField({
          label: applicantInformationMessages.labels.tel,
          colSpan: '6/12',
          condition: (answers) =>
            !!getValueViaPath<string>(answers, 'applicant.phoneNumber'),
          value: ({ answers }) =>
            formatPhoneNumber(
              removeCountryCode(
                getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
              ),
            ),
        }),
        buildDividerField({}),
        // Applicants table
        buildStaticTableField({
          title: m.application.overview.applicantsTableTitle,
          rows: ({ answers, externalData }) =>
            getSelectedApplicants(answers, externalData),
          header: [
            applicantInformationMessages.labels.name,
            applicantInformationMessages.labels.nationalId,
            'Tengsl',
          ],
        }),
        buildDividerField({
          condition: (answers) => hasFamilySelected(answers),
        }),
        // Date period
        buildDescriptionField({
          id: 'overviewDatePeriodTitle',
          title: m.application.overview.dateTitle,
          titleVariant: 'h4',
        }),
        buildKeyValueField({
          label: '',
          value: ({ answers }) =>
            `${format(
              new Date(
                getValueViaPath<string>(answers, 'period.dateFieldFrom') ?? '',
              ),
              'dd.MM.yyyy',
            )} - ${format(
              new Date(
                getValueViaPath<string>(answers, 'period.dateFieldTo') ?? '',
              ),
              'dd.MM.yyyy',
            )} `,
        }),
        buildDividerField({
          condition: (answers) =>
            getValueViaPath<ApplicantType>(
              answers,
              'studentOrTouristRadioFieldTourist',
            ) === ApplicantType.STUDENT,
        }),
        buildKeyValueField({
          label: m.application.overview.residencyTitle,
          colSpan: '9/12',
          condition: (answers) =>
            getValueViaPath<ApplicantType>(
              answers,
              'studentOrTouristRadioFieldTourist',
            ) === ApplicantType.STUDENT,
          value: ({ answers, externalData }) =>
            getCountryNameFromCode(
              getValueViaPath<string>(answers, 'residencyStudentSelectField') ??
                '',
              externalData,
            ),
        }),
        buildKeyValueField({
          label: m.application.overview.residencyTitle,
          colSpan: '9/12',
          condition: (answers) =>
            getValueViaPath<ApplicantType>(
              answers,
              'studentOrTouristRadioFieldTourist',
            ) === ApplicantType.TOURIST,
          value: ({ answers, externalData }) =>
            getContinentNameFromCode(
              getValueViaPath<string>(answers, 'residencyTouristRadioField') ??
                '',
              externalData,
            ),
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.application.overview.fileUploadListTitle,
          colSpan: '9/12',
          condition: (answers) =>
            getValueViaPath<ApplicantType>(
              answers,
              'studentOrTouristRadioFieldTourist',
            ) === ApplicantType.STUDENT,
          value: ({ answers }) =>
            getValueViaPath<File[]>(
              answers,
              'educationConfirmationFileUploadField',
            )?.map((file) => file.name),
        }),
        buildSubmitField({
          id: 'submit',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.application.overview.submitButtonText,
              type: 'primary',
            },
          ],
          refetchApplicationAfterSubmit: true,
        }),
      ],
    }),
  ],
})
