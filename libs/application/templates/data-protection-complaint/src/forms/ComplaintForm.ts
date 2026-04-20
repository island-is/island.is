import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import { OnBehalf } from '../lib/dataSchema'
import {
  application,
  complaint,
  delimitation,
  errorCards,
  info,
  overview,
  section,
  sharedFields,
} from '../lib/messages'
import { confirmation } from '../lib/messages/confirmation'
import { externalData } from '../lib/messages/externalData'
import {
  FILE_SIZE_LIMIT,
  SubjectOfComplaint,
  SubmittedApplicationData,
} from '../shared'

const yesOption = { value: YES, label: sharedFields.yes }
const noOption = { value: NO, label: sharedFields.no }

export const ComplaintForm: Form = buildForm({
  id: 'DataProtectionComplaintForm',
  title: application.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
      title: section.externalData,
      children: [
        buildExternalDataProvider({
          title: externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.general.subTitle,
          description: externalData.general.description,
          checkboxLabel: externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryV3UserApi,
              title: externalData.labels.nationalRegistryTitle,
              subTitle: externalData.labels.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.labels.userProfileTitle,
              subTitle: externalData.labels.userProfileSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'delimitation',
      title: section.delimitation,
      children: [
        buildSubSection({
          id: 'authoritiesSection',
          title: section.authorities,
          children: [
            buildMultiField({
              id: 'inCourtProceedingsFields',
              title: delimitation.labels.inCourtProceedings,
              children: [
                buildRadioField({
                  id: 'inCourtProceedings',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  required: true,
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'inCourtProceedingsAlert',
                  title: errorCards.inCourtProceedingsTitle,
                  message: errorCards.inCourtProceedingsDescription,
                  alertType: 'info',
                  doesNotRequireAnswer: true,
                  links: [
                    {
                      title: delimitation.links.inCourtProceedingsTitle,
                      url: delimitation.links.inCourtProceedingsUrl,
                      isExternal: true,
                    },
                  ],
                  condition: (formValue) =>
                    formValue.inCourtProceedings === YES,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'mediaSection',
          title: section.media,
          children: [
            buildMultiField({
              id: 'concernsMediaCoverageFields',
              title: delimitation.labels.concernsMediaCoverage,
              children: [
                buildRadioField({
                  id: 'concernsMediaCoverage',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  required: true,
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'concernsMediaCoverageAlert',
                  title: errorCards.concernsMediaCoverageTitle,
                  message: errorCards.concernsMediaCoverageDescription,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  condition: (formValue) =>
                    formValue.concernsMediaCoverage === YES,
                  links: [
                    {
                      title: delimitation.links.concernsMediaCoverageFirstTitle,
                      url: delimitation.links.concernsMediaCoverageFirstUrl,
                      isExternal: true,
                    },
                    {
                      title:
                        delimitation.links.concernsMediaCoverageSecondTitle,
                      url: delimitation.links.concernsMediaCoverageSecondUrl,
                      isExternal: true,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'banMarkingSection',
          title: section.banMarking,
          children: [
            buildMultiField({
              id: 'concernsBanMarkingFields',
              title: delimitation.labels.concernsBanMarking,
              children: [
                buildRadioField({
                  id: 'concernsBanMarking',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  required: true,
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'concernsBanMarkingAlert',
                  title: errorCards.concernsBanMarkingTitle,
                  message: errorCards.concernsBanMarkingDescription,
                  alertType: 'info',
                  doesNotRequireAnswer: true,
                  condition: (formValue) =>
                    formValue.concernsBanMarking === YES,
                  links: [
                    {
                      title: delimitation.links.concernsBanMarkingFirstTitle,
                      url: delimitation.links.concernsBanMarkingFirstUrl,
                      isExternal: true,
                    },
                    {
                      title: delimitation.links.concernsBanMarkingSecondTitle,
                      url: delimitation.links.concernsBanMarkingSecondUrl,
                      isExternal: true,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'libelSection',
          title: section.libel,
          children: [
            buildMultiField({
              id: 'concernsLibelFields',
              title: delimitation.labels.concernsLibel,
              children: [
                buildRadioField({
                  id: 'concernsLibel',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  required: true,
                  width: 'half',
                }),
                buildAlertMessageField({
                  id: 'concernsLibelAlert',
                  title: errorCards.concernsLibelTitle,
                  message: errorCards.concernsLibelDescription,
                  alertType: 'info',
                  doesNotRequireAnswer: true,
                  condition: (formValue) => formValue.concernsLibel === YES,
                  links: [
                    {
                      title: delimitation.links.concernsLibelTitle,
                      url: delimitation.links.concernsLibelUrl,
                      isExternal: true,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'agreementSection',
          title: section.agreement,
          children: [
            buildCustomField({
              id: 'agreementSectionDescription',
              title: section.agreement,
              doesNotRequireAnswer: true,
              component: 'AgreementDescription',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: section.info,
      children: [
        buildSubSection({
          id: 'onBehalf',
          title: section.onBehalf,
          children: [
            buildMultiField({
              id: 'onBehalfFields',
              title: info.general.pageTitle,
              description: info.general.description,
              children: [
                buildRadioField({
                  id: 'info.onBehalf',
                  options: [
                    { value: OnBehalf.MYSELF, label: info.labels.myself },
                    {
                      value: OnBehalf.MYSELF_AND_OR_OTHERS,
                      label: info.labels.myselfAndOrOthers,
                    },
                    { value: OnBehalf.OTHERS, label: info.labels.others },
                    {
                      value: OnBehalf.ORGANIZATION_OR_INSTITUTION,
                      label: info.labels.organizationInstitution,
                    },
                  ],
                  largeButtons: true,
                  required: true,
                  width: 'half',
                }),
                buildCustomField({
                  id: 'onBehalfDescription',
                  doesNotRequireAnswer: true,
                  component: 'CompanyDisclaimer',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'applicant',
          title: section.applicant,
          condition: (formValue) => {
            const onBehalf = (formValue.info as FormValue)?.onBehalf
            return (
              onBehalf === OnBehalf.MYSELF ||
              onBehalf === OnBehalf.MYSELF_AND_OR_OTHERS ||
              onBehalf === OnBehalf.OTHERS
            )
          },
          children: [applicantInformationMultiField()],
        }),
        buildSubSection({
          id: 'organizationOrInstitution',
          title: section.organizationOrInstitution,
          condition: (formValue) =>
            (formValue.info as FormValue)?.onBehalf ===
            OnBehalf.ORGANIZATION_OR_INSTITUTION,
          children: [
            buildMultiField({
              id: 'organizationOrInstitutionSection',
              title: info.general.organizationOrInstitutionPageTitle,
              description:
                info.general.organizationOrInstitutionPageDescription,
              children: [
                buildTextField({
                  id: 'organizationOrInstitution.name',
                  title: info.labels.organizationOrInstitutionName,
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'organizationOrInstitution.nationalId',
                  title: info.labels.nationalId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'organizationOrInstitution.address',
                  title: info.labels.address,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'organizationOrInstitution.postalCode',
                  title: info.labels.postalCode,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'organizationOrInstitution.city',
                  title: info.labels.city,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'organizationOrInstitution.email',
                  title: info.labels.email,
                  width: 'half',
                  variant: 'email',
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.phoneNumber',
                  title: info.labels.tel,
                  format: '###-####',
                  width: 'half',
                  variant: 'tel',
                  backgroundColor: 'blue',
                }),
                buildCustomField({
                  id: 'contactTitle',
                  title: info.labels.contactTitle,
                  component: 'FieldLabel',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.contactName',
                  title: info.labels.contactName,
                  backgroundColor: 'blue',
                  width: 'half',
                }),
                buildTextField({
                  id: 'organizationOrInstitution.contactEmail',
                  title: info.labels.email,
                  backgroundColor: 'blue',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'commissions',
          title: section.commissions,
          condition: (formValue) => {
            const onBehalf = (formValue.info as FormValue)?.onBehalf
            return (
              onBehalf === OnBehalf.MYSELF_AND_OR_OTHERS ||
              onBehalf === OnBehalf.OTHERS
            )
          },
          children: [
            buildMultiField({
              id: 'comissionsSection',
              title: info.general.commissionsPageTitle,
              children: [
                buildCustomField({
                  id: 'commissions.commissionDocument',
                  title: info.labels.commissionsPerson,
                  doesNotRequireAnswer: true,
                  component: 'CommissionDocument',
                }),
                buildFileUploadField({
                  id: 'commissions.documents',
                  introduction: '',
                  maxSize: FILE_SIZE_LIMIT,
                  uploadHeader: info.labels.commissionsDocumentsHeader,
                  uploadDescription:
                    info.labels.commissionsDocumentsDescription,
                  uploadButtonLabel:
                    info.labels.commissionsDocumentsButtonLabel,
                }),
                buildCustomField({
                  id: 'commissions.persons',
                  title: info.labels.commissionsPerson,
                  component: 'CommissionFieldRepeater',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'complaint',
      title: section.complaint,
      children: [
        buildCustomField({
          id: 'complainees',
          title: complaint.general.complaineePageTitle,
          component: 'ComplaineeRepeater',
        }),
        buildSubSection({
          id: 'subjectOfComplaintSection',
          title: section.subjectOfComplaint,
          children: [
            buildMultiField({
              title: complaint.general.subjectOfComplaintPageTitle,
              description: complaint.general.subjectOfComplaintPageDescription,
              space: 3,
              children: [
                buildCheckboxField({
                  id: 'subjectOfComplaint.values',
                  options: [
                    {
                      label:
                        complaint.labels[SubjectOfComplaint.WITH_AUTHORITIES],
                      value: SubjectOfComplaint.WITH_AUTHORITIES,
                    },
                    {
                      label:
                        complaint.labels[SubjectOfComplaint.LACK_OF_EDUCATION],
                      value: SubjectOfComplaint.LACK_OF_EDUCATION,
                    },
                    {
                      label: complaint.labels[SubjectOfComplaint.SOCIAL_MEDIA],
                      value: SubjectOfComplaint.SOCIAL_MEDIA,
                    },
                    {
                      label:
                        complaint.labels[SubjectOfComplaint.REQUEST_FOR_ACCESS],
                      value: SubjectOfComplaint.REQUEST_FOR_ACCESS,
                    },
                    {
                      label:
                        complaint.labels[
                          SubjectOfComplaint.RIGHTS_OF_OBJECTION
                        ],
                      value: SubjectOfComplaint.RIGHTS_OF_OBJECTION,
                    },
                    {
                      label: complaint.labels[SubjectOfComplaint.EMAIL],
                      value: SubjectOfComplaint.EMAIL,
                    },
                    {
                      label: complaint.labels[SubjectOfComplaint.NATIONAL_ID],
                      value: SubjectOfComplaint.NATIONAL_ID,
                    },
                    {
                      label:
                        complaint.labels[SubjectOfComplaint.EMAIL_IN_WORKPLACE],
                      value: SubjectOfComplaint.EMAIL_IN_WORKPLACE,
                    },
                    {
                      label:
                        complaint.labels[
                          SubjectOfComplaint.UNAUTHORIZED_PUBLICATION
                        ],
                      value: SubjectOfComplaint.UNAUTHORIZED_PUBLICATION,
                    },
                    {
                      label: complaint.labels[SubjectOfComplaint.VANSKILASKRA],
                      value: SubjectOfComplaint.VANSKILASKRA,
                    },
                    {
                      label:
                        complaint.labels[SubjectOfComplaint.VIDEO_RECORDINGS],
                      value: SubjectOfComplaint.VIDEO_RECORDINGS,
                    },
                    {
                      label: complaint.labels[SubjectOfComplaint.OTHER],
                      value: SubjectOfComplaint.OTHER,
                    },
                  ],
                }),
                buildTextField({
                  id: 'subjectOfComplaint.somethingElse',
                  title: complaint.labels.subjectSomethingElse,
                  placeholder: complaint.labels.subjectSomethingElsePlaceholder,
                  required: true,
                  condition: (formValue) => {
                    const value = getValueViaPath(
                      formValue,
                      'subjectOfComplaint.values',
                    ) as SubjectOfComplaint[] | undefined

                    return value?.includes(SubjectOfComplaint.OTHER) ?? false
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'complaint',
          title: section.complaint,
          children: [
            buildMultiField({
              id: 'complaintDescription',
              title: complaint.general.complaintPageTitle,
              description: complaint.general.complaintPageDescription,
              space: 3,
              children: [
                buildCustomField({
                  id: 'complaint.description',
                  title: complaint.labels.complaintDescription,
                  doesNotRequireAnswer: true,
                  component: 'ComplaintDescription',
                }),
                buildCustomField({
                  id: 'complaint.documentHeading',
                  title: complaint.labels.complaintDescription,
                  doesNotRequireAnswer: true,
                  component: 'ComplaintDocumentHeading',
                  defaultValue: '',
                }),
                buildFileUploadField({
                  id: 'complaint.documents',
                  introduction: '',
                  maxSize: FILE_SIZE_LIMIT,
                  uploadHeader: complaint.labels.complaintDocumentsHeader,
                  uploadDescription:
                    complaint.labels.complaintDocumentsDescription,
                  uploadButtonLabel:
                    complaint.labels.complaintDocumentsButtonLabel,
                }),
                buildAlertMessageField({
                  id: 'complaintDocumentsInfo',
                  doesNotRequireAnswer: true,
                  title:
                    complaint.labels.complaintDocumentsInfoAlertMessageTitle,
                  message: complaint.labels.complaintDocumentsInfoLabel,
                  alertType: 'info',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSection',
      title: section.overview,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: overview.general.pageTitle,
          children: [
            buildCustomField({
              id: 'overview',
              title: overview.general.pageTitle,
              doesNotRequireAnswer: true,
              component: 'ComplaintOverview',
            }),
            buildSubmitField({
              id: 'overview.sendApplication',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.labels.sendApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: confirmation.labels.alertTitle,
      expandableHeader: confirmation.labels.expandableHeader,
      expandableDescription: confirmation.labels.description,
      conclusionLinkS3FileKey: (application) => {
        const submitData = application.externalData
          .sendApplication as SubmittedApplicationData

        return submitData.data?.applicationPdfKey ?? ''
      },
      conclusionLinkLabel: confirmation.labels.pdfLink,
    }),
  ],
})
