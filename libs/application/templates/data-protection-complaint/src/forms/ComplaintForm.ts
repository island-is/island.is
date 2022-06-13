import {
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
  SharedDataProviders,
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
import { FILE_SIZE_LIMIT, NO, YES } from '../shared'

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
              provider: SharedDataProviders.nationalRegistryProvider,
              title: externalData.labels.nationalRegistryTitle,
              subTitle: externalData.labels.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              provider: SharedDataProviders.userProfileProvider,
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
                    doesNotRequireAnswer: true,
                    condition: (formValue) =>
                      formValue.inCourtProceedings === YES,
                  },
                  {
                    links: [
                      {
                        title: delimitation.links.inCourtProceedingsTitle,
                        url: delimitation.links.inCourtProceedingsUrl,
                        isExternal: true,
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
          title: section.media,
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
                    doesNotRequireAnswer: true,
                    condition: (formValue) =>
                      formValue.concernsMediaCoverage === YES,
                  },
                  {
                    links: [
                      {
                        title:
                          delimitation.links.concernsMediaCoverageFirstTitle,
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
                  },
                ),
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
                    doesNotRequireAnswer: true,
                    condition: (formValue) =>
                      formValue.concernsBanMarking === YES,
                  },
                  {
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
                  },
                ),
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
                    doesNotRequireAnswer: true,
                    condition: (formValue) => formValue.concernsLibel === YES,
                  },
                  {
                    links: [
                      {
                        title: delimitation.links.concernsLibelTitle,
                        url: delimitation.links.concernsLibelUrl,
                        isExternal: true,
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
          children: [
            buildMultiField({
              id: 'applicantSection',
              title: info.general.applicantPageTitle,
              description: info.general.applicantPageDescription,
              children: [
                buildTextField({
                  id: 'applicant.name',
                  title: info.labels.name,
                  backgroundColor: 'white',
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
                  backgroundColor: 'white',
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
                  defaultValue: (application: DataProtectionComplaint) => {
                    const phoneNumber =
                      application.externalData?.userProfile?.data
                        ?.mobilePhoneNumber
                    if (phoneNumber?.startsWith('+')) {
                      const splitNumber = phoneNumber.split('-')
                      if (splitNumber.length === 3) {
                        return `${splitNumber[1]}${splitNumber[2]}`
                      } else if (splitNumber.length === 2) {
                        return `${splitNumber[1]}`
                      }
                    }
                    return phoneNumber
                  },
                }),
              ],
            }),
          ],
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
      title: section.complaint,
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
                buildCustomField({
                  component: 'ReasonsForComplaint',
                  id: 'subjectOfComplaint.checkboxAndInput',
                  title: '',
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
                  doesNotRequireAnswer: true,
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
              doesNotRequireAnswer: true,
              component: 'ComplaintOverview',
            }),
            buildSubmitField({
              id: 'overview.sendApplication',
              title: '',
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
