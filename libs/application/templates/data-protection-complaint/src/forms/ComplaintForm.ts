import {
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
  DefaultEvents,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import { DataProtectionComplaint, OnBehalf } from '../lib/dataSchema'
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
import { externalData } from '../lib/messages/externalData'
import { FILE_SIZE_LIMIT, NO, SubjectOfComplaint, YES } from '../shared'

const yesOption = { value: YES, label: sharedFields.yes }
const noOption = { value: NO, label: sharedFields.no }

export const ComplaintForm: Form = buildForm({
  id: 'DataProtectionComplaintForm',
  title: application.name,
  mode: FormModes.APPLYING,
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
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: externalData.labels.nationalRegistryTitle,
              subTitle: externalData.labels.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: externalData.labels.userProfileTitle,
              subTitle: externalData.labels.userProfileSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'delimitation',
      title: section.delimitation.defaultMessage,
      children: [
        buildSubSection({
          id: 'authoritiesSection',
          title: section.authorities.defaultMessage,
          children: [
            buildMultiField({
              id: 'inCourtProceedingsFields',
              title: delimitation.labels.inCourtProceedings,
              children: [
                buildRadioField({
                  id: 'inCourtProceedings',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField(
                  {
                    component: 'FieldAlertMessage',
                    id: 'inCourtProceedingsAlert',
                    title: errorCards.inCourtProceedingsTitle,
                    description: errorCards.inCourtProceedingsDescription,
                    condition: (formValue) =>
                      formValue.inCourtProceedings === YES,
                  },
                  {
                    links: [
                      {
                        title: 'Frekari upplýsingar',
                        url:
                          'https://www.personuvernd.is/einstaklingar/spurt-og-svarad/allar-spurningar-og-svor/hvad-getur-personuvernd-ekki-gert',
                      },
                    ],
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'mediaSection',
          title: section.media.defaultMessage,
          children: [
            buildMultiField({
              id: 'concernsMediaCoverageFields',
              title: delimitation.labels.concernsMediaCoverage,
              children: [
                buildRadioField({
                  id: 'concernsMediaCoverage',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField(
                  {
                    component: 'FieldAlertMessage',
                    id: 'concernsMediaCoverageAlert',
                    title: errorCards.concernsMediaCoverageTitle,
                    description: errorCards.concernsMediaCoverageDescription,
                    condition: (formValue) =>
                      formValue.concernsMediaCoverage === YES,
                  },
                  {
                    links: [
                      {
                        title: 'Fjölmiðlanefnd',
                        url: 'https://fjolmidlanefnd.is/',
                      },
                      {
                        title: 'Siðanefnd Blaðamannafélags Íslands',
                        url:
                          'https://www.press.is/is/faglegt/sidavefur/sidanefnd',
                      },
                    ],
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'banMarkingSection',
          title: section.banMarking.defaultMessage,
          children: [
            buildMultiField({
              id: 'concernsBanMarkingFields',
              title: delimitation.labels.concernsBanMarking,
              children: [
                buildRadioField({
                  id: 'concernsBanMarking',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField(
                  {
                    component: 'FieldAlertMessage',
                    id: 'concernsBanMarkingAlert',
                    title: errorCards.concernsBanMarkingTitle,
                    description: errorCards.concernsBanMarkingDescription,
                    condition: (formValue) =>
                      formValue.concernsBanMarking === YES,
                  },
                  {
                    links: [
                      {
                        title: 'Póst- og fjarskiptastofnun',
                        url: 'https://www.pfs.is/',
                      },
                      {
                        title: 'Þjóðskrá Íslands',
                        url: 'https://www.skra.is/',
                      },
                    ],
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'libelSection',
          title: section.libel.defaultMessage,
          children: [
            buildMultiField({
              id: 'concernsLibelFields',
              title: delimitation.labels.concernsLibel,
              children: [
                buildRadioField({
                  id: 'concernsLibel',
                  title: '',
                  options: [noOption, yesOption],
                  largeButtons: true,
                  width: 'half',
                }),
                buildCustomField(
                  {
                    component: 'FieldAlertMessage',
                    id: 'concernsLibelAlert',
                    title: errorCards.concernsLibelTitle,
                    description: errorCards.concernsLibelDescription,
                    condition: (formValue) => formValue.concernsLibel === YES,
                  },
                  {
                    links: [
                      {
                        title: 'Nánari uppýsingar',
                        url:
                          'https://www.personuvernd.is/einstaklingar/spurt-og-svarad/allar-spurningar-og-svor/hvad-getur-personuvernd-ekki-gert',
                      },
                    ],
                  },
                ),
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
                  title: '',
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
                  width: 'half',
                }),
                buildCustomField({
                  id: 'onBehalfDescription',
                  title: '',
                  component: 'CompanyDisclaimer',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'applicant',
          title: section.applicant.defaultMessage,
          condition: (formValue) => {
            const onBehalf = (formValue.info as FormValue)?.onBehalf
            return (
              onBehalf === OnBehalf.MYSELF ||
              onBehalf === OnBehalf.MYSELF_AND_OR_OTHERS ||
              onBehalf === OnBehalf.OTHERS
            )
          },
          children: [
            buildMultiField({
              id: 'applicantSection',
              title: info.general.applicantPageTitle,
              description: info.general.applicantPageDescription,
              children: [
                buildTextField({
                  id: 'applicant.name',
                  title: info.labels.name,
                  backgroundColor: 'blue',
                  disabled: true,
                  required: true,
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.nationalRegistry?.data?.fullName,
                }),
                buildTextField({
                  id: 'applicant.nationalId',
                  title: info.labels.nationalId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'blue',
                  disabled: true,
                  required: true,
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.nationalRegistry?.data
                      ?.nationalId,
                }),
                buildTextField({
                  id: 'applicant.address',
                  title: info.labels.address,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.nationalRegistry?.data?.address
                      ?.streetAddress,
                }),
                buildTextField({
                  id: 'applicant.postalCode',
                  title: info.labels.postalCode,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.nationalRegistry?.data?.address
                      ?.postalCode,
                }),
                buildTextField({
                  id: 'applicant.city',
                  title: info.labels.city,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.nationalRegistry?.data?.address
                      ?.city,
                }),
                buildTextField({
                  id: 'applicant.email',
                  title: info.labels.email,
                  width: 'half',
                  variant: 'email',
                  backgroundColor: 'blue',
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.userProfile?.data?.email,
                }),
                buildTextField({
                  id: 'applicant.phoneNumber',
                  title: info.labels.tel,
                  format: '###-####',
                  width: 'half',
                  variant: 'tel',
                  backgroundColor: 'blue',
                  defaultValue: (application: DataProtectionComplaint) =>
                    application.externalData?.userProfile?.data
                      ?.mobilePhoneNumber,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'organizationOrInstitution',
          title: section.organizationOrInstitution.defaultMessage,
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
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'commissions',
          title: section.commissions.defaultMessage,
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
                  component: 'CommissionDocument',
                }),
                buildFileUploadField({
                  id: 'commissions.documents',
                  title: '',
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
      title: section.complaint.defaultMessage,
      children: [
        buildCustomField({
          id: 'complainees',
          title: complaint.general.complaineePageTitle,
          component: 'ComplaineeRepeater',
        }),
        buildSubSection({
          id: 'subjectOfComplaint',
          title: section.subjectOfComplaint,
          children: [
            buildMultiField({
              title: complaint.general.subjectOfComplaintPageTitle,
              description: complaint.general.subjectOfComplaintPageDescription,
              space: 3,
              children: [
                buildCheckboxField({
                  id: 'subjectOfComplaint.values',
                  title: '',
                  options: [
                    {
                      label: complaint.labels.subjectAuthorities,
                      value: SubjectOfComplaint.WITH_AUTHORITIES,
                    },
                    {
                      label: complaint.labels.subjectLackOfEducation,
                      value: SubjectOfComplaint.LACK_OF_EDUCATION,
                    },
                    {
                      label: complaint.labels.subjectSocialMedia,
                      value: SubjectOfComplaint.SOCIAL_MEDIA,
                    },
                    {
                      label: complaint.labels.subjectRequestForAccess,
                      value: SubjectOfComplaint.REQUEST_FOR_ACCESS,
                    },
                    {
                      label: complaint.labels.subjectRightOfObjection,
                      value: SubjectOfComplaint.RIGHTS_OF_OBJECTION,
                    },
                    {
                      label: complaint.labels.subjectEmail,
                      value: SubjectOfComplaint.EMAIL,
                    },
                    {
                      label: complaint.labels.subjectNationalId,
                      value: SubjectOfComplaint.NATIONAL_ID,
                    },
                    {
                      label: complaint.labels.subjectEmailInWorkplace,
                      value: SubjectOfComplaint.EMAIL_IN_WORKPLACE,
                    },
                    {
                      label: complaint.labels.subjectUnauthorizedPublication,
                      value: SubjectOfComplaint.UNAUTHORIZED_PUBLICATION,
                    },
                    {
                      label: complaint.labels.subjectVanskilaskra,
                      value: SubjectOfComplaint.VANSKILASKRA,
                    },
                    {
                      label: complaint.labels.subjectVideoRecording,
                      value: SubjectOfComplaint.VIDEO_RECORDINGS,
                    },
                    {
                      label: complaint.labels.subjectOtherOther,
                      value: SubjectOfComplaint.OTHER,
                    },
                  ],
                  large: true,
                }),
                buildTextField({
                  id: 'subjectOfComplaint.somethingElse',
                  title: complaint.labels.subjectSomethingElse,
                  placeholder: complaint.labels.subjectSomethingElsePlaceholder,
                  backgroundColor: 'blue',
                  condition: (formValue) => {
                    const values =
                      ((formValue.subjectOfComplaint as FormValue)
                        ?.values as string[]) || []
                    return values.includes('other')
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
                  component: 'ComplaintDescription',
                }),
                buildCustomField({
                  id: 'complaint.documentHeading',
                  title: complaint.labels.complaintDescription,
                  component: 'ComplaintDocumentHeading',
                  defaultValue: '',
                }),
                buildFileUploadField({
                  id: 'complaint.documents',
                  title: '',
                  introduction: '',
                  maxSize: FILE_SIZE_LIMIT,
                  uploadHeader: complaint.labels.complaintDocumentsHeader,
                  uploadDescription:
                    complaint.labels.complaintDocumentsDescription,
                  uploadButtonLabel:
                    complaint.labels.complaintDocumentsButtonLabel,
                }),
                buildCustomField({
                  component: 'FieldAlertMessage',
                  id: 'complaintDocumentsInfo',
                  title:
                    complaint.labels.complaintDocumentsInfoAlertMessageTitle,
                  description: complaint.labels.complaintDocumentsInfoLabel,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: overview.general.pageTitle,
          children: [
            buildCustomField({
              id: 'overviewComplaintOverview',
              title: overview.general.pageTitle,
              component: 'ComplaintOverview',
            }),
            buildSubmitField({
              id: 'overview.termsAgreement',
              title: '',
              placement: 'screen',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.labels.termsAgreement,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: section.received,
      children: [
        buildCustomField({
          id: 'confirmationCustomField',
          title: overview.general.confirmationPageTitle,
          component: 'ComplaintConfirmation',
        }),
      ],
    }),
  ],
})
