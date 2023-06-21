import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import { UserProfile } from '@island.is/api/schema'

import * as kennitala from 'kennitala'

import Logo from '../assets/Logo'
import { oldAgePensionFormMessage } from '../lib/messages'
import {
  ConnectedApplications,
  earlyRetirementMaxAge,
  earlyRetirementMinAge,
  FILE_SIZE_LIMIT,
  HomeAllowanceHousing,
  NO,
  YES,
} from '../lib/constants'
import {
  getAgeBetweenTwoDates,
  getApplicationAnswers,
  getApplicationExternalData,
  isExistsCohabitantOlderThan25,
} from '../lib/oldAgePensionUtils'

export const OldAgePensionForm: Form = buildForm({
  id: 'OldAgePensionDraft',
  title: oldAgePensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'applicant',
      title: oldAgePensionFormMessage.applicant.applicantSection,
      children: [
        // buildSubSection({
        //   id: 'connectedApplications.childSupport',
        //   title: oldAgePensionFormMessage.shared.relatedApplicationsSection,
        //   children: [
        //     buildCheckboxField({
        //       id: 'connectedApplications',
        //       title: oldAgePensionFormMessage.shared.relatedApplicationsSection,
        //       description: oldAgePensionFormMessage.shared.relatedApplicationsSectionDescription,
        //       large: true,
        //       doesNotRequireAnswer: true,
        //       defaultValue: '',
        //       options: [
        //         {
        //           label: oldAgePensionFormMessage.shared.homeAllowance,
        //           value: connectedApplications.HOMEALLOWANCE,
        //         },
        //         {
        //           label: oldAgePensionFormMessage.shared.childSupport,
        //           value: connectedApplications.CHILDSUPPORT,
        //         },
        //       ],
        //     }),
        //   ],
        // }),
        buildSubSection({
          id: 'info',
          title:
            oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title:
                oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle,
              description:
                oldAgePensionFormMessage.applicant
                  .applicantInfoSubSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.name',
                  title: oldAgePensionFormMessage.applicant.applicantInfoName,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry.fullName
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.ID',
                  title: oldAgePensionFormMessage.applicant.applicantInfoId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    kennitala.format(application.applicant),
                }),
                buildTextField({
                  id: 'applicantInfo.address',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoAddress,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.streetAddress
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.postcode',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoPostalcode,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.postalCode
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.municipality',
                  title:
                    oldAgePensionFormMessage.applicant
                      .applicantInfoMunicipality,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.locality
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.email',
                  title: oldAgePensionFormMessage.applicant.applicantInfoEmail,
                  width: 'half',
                  variant: 'email',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.email
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoPhonenumber,
                  width: 'half',
                  placeholder: '000-0000',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.mobilePhoneNumber
                  },
                }),
                buildDescriptionField({
                  id: 'applicantInfo.descriptionField',
                  space: 'containerGutter',
                  titleVariant: 'h5',
                  title:
                    oldAgePensionFormMessage.applicant
                      .applicantInfoMaritalTitle,
                  condition: (answers, externalData) => {
                    const { hasSpouse } = getApplicationExternalData(
                      externalData,
                    )
                    if (hasSpouse) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.maritalStatus',
                  title:
                    oldAgePensionFormMessage.applicant
                      .applicantInfoMaritalStatus,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.maritalStatus
                  },
                  condition: (answers, externalData) => {
                    const { maritalStatus } = getApplicationExternalData(
                      externalData,
                    )
                    if (maritalStatus) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseName',
                  title:
                    oldAgePensionFormMessage.applicant.applicantInfoSpouseName,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.name
                  },
                  condition: (answers, externalData) => {
                    const { spouseName } = getApplicationExternalData(
                      externalData,
                    )
                    if (spouseName) return true
                    return false
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseID',
                  title: oldAgePensionFormMessage.applicant.applicantInfoId,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.nationalId
                  },
                  condition: (answers, externalData) => {
                    const { spouseNationalId } = getApplicationExternalData(
                      externalData,
                    )
                    if (spouseNationalId) return true
                    return false
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'residence',
          title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
          children: [
            buildMultiField({
              id: 'residenceHistory',
              title: oldAgePensionFormMessage.residence.residenceHistoryTitle,
              description:
                oldAgePensionFormMessage.residence.residenceHistoryDescription,
              children: [
                buildCustomField({
                  id: 'residenceHistory.table',
                  doesNotRequireAnswer: true,
                  title: '',
                  component: 'ResidenceHistoryTable',
                  condition: (answers, externalData) => {
                    const { residenceHistory } = getApplicationExternalData(
                      externalData,
                    )
                    // if no residence history returned, dont show the table
                    if (residenceHistory.length === 0) return false
                    return true
                  },
                }),
                buildRadioField({
                  id: 'residenceHistory.question',
                  title:
                    oldAgePensionFormMessage.residence.residenceHistoryQuestion,
                  options: [
                    { value: YES, label: oldAgePensionFormMessage.shared.yes },
                    { value: NO, label: oldAgePensionFormMessage.shared.no },
                  ],
                  width: 'half',
                  largeButtons: true,
                  // condition: (answers, externalData) => {
                  //   const { residenceHistory } = getApplicationExternalData(
                  //     externalData,
                  //   )
                  //   // check if no res history or?? or if only res history is iceland?
                  //   if (residenceHistory.length === 0) return true
                  //   return false
                  // },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'periodSection',
          title: oldAgePensionFormMessage.period.periodTitle,
          children: [
            // Period is from 65 year old birthday or last 2 years if applicant is 67+
            //           to 6 month ahead
            buildMultiField({
              id: 'periodField',
              title: oldAgePensionFormMessage.period.periodTitle,
              description: oldAgePensionFormMessage.period.periodDescription,
              children: [
                buildCustomField({
                  id: 'period',
                  component: 'Period',
                  title: oldAgePensionFormMessage.period.periodTitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'fileUploadEarlyPenFisher',
          title: oldAgePensionFormMessage.fileUpload.title,
          children: [
            buildFileUploadField({
              id: 'fileUploadEarlyPenFisher.earlyRetirement',
              title: oldAgePensionFormMessage.fileUpload.earlyRetirementTitle,
              description:
                oldAgePensionFormMessage.fileUpload.earlyRetirementDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.earlyRetirementDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              condition: (answers, externalData) => {
                const { applicantNationalId } = getApplicationExternalData(
                  externalData,
                )
                const { selectedMonth, selectedYear } = getApplicationAnswers(
                  answers,
                )

                const dateOfBirth = kennitala.info(applicantNationalId).birthday
                const dateOfBirth00 = new Date(
                  dateOfBirth.getFullYear(),
                  dateOfBirth.getMonth(),
                )
                const selectedDate = new Date(+selectedYear, +selectedMonth)

                const age = getAgeBetweenTwoDates(selectedDate, dateOfBirth00)

                return (
                  age >= earlyRetirementMinAge && age <= earlyRetirementMaxAge
                )
              },
            }),
            buildFileUploadField({
              id: 'fileUploadEarlyPenFisher.pension',
              title: oldAgePensionFormMessage.fileUpload.pensionFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.pensionFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.pensionFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
            }),
            buildFileUploadField({
              id: 'fileUploadEarlyPenFisher.fishermen',
              title: oldAgePensionFormMessage.fileUpload.fishermenFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.fishermenFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              condition: (answers) => {
                const { isFishermen } = getApplicationAnswers(answers)

                return isFishermen === YES
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'onePaymentPerYear',
          title:
            oldAgePensionFormMessage.onePaymentPerYear.onePaymentPerYearTitle,
          children: [
            buildMultiField({
              id: 'onePaymentPerYear',
              title:
                oldAgePensionFormMessage.onePaymentPerYear
                  .onePaymentPerYearTitle,
              children: [
                buildRadioField({
                  id: 'onePaymentPerYear.question',
                  title: '',
                  description:
                    oldAgePensionFormMessage.onePaymentPerYear
                      .onePaymentPerYearDescription,
                  options: [
                    {
                      value: YES,
                      label: oldAgePensionFormMessage.shared.yes,
                    },
                    {
                      value: NO,
                      label: oldAgePensionFormMessage.shared.no,
                    },
                  ],
                  defaultValue: NO,
                  width: 'half',
                }),
                buildCustomField(
                  {
                    id: 'onePaymentPerYear.alert',
                    title:
                      oldAgePensionFormMessage.onePaymentPerYear
                        .onePaymentPerYearAlertTitle,
                    component: 'FieldAlertMessage',
                    description:
                      oldAgePensionFormMessage.onePaymentPerYear
                        .onePaymentPerYearAlertDescription,
                    condition: (answers) => {
                      const { onePaymentPerYear } = getApplicationAnswers(
                        answers,
                      )

                      return onePaymentPerYear === YES
                    },
                  },
                  { type: 'warning' },
                ),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'connectedApplicationsSection',
      title: oldAgePensionFormMessage.review.confirmSectionTitle,
      children: [
        buildSubSection({
          id: 'connectedApplicationsSubSection',
          title:
            oldAgePensionFormMessage.connectedApplications
              .relatedApplicationsSection,
          children: [
            buildCheckboxField({
              id: 'connectedApplications',
              title:
                oldAgePensionFormMessage.connectedApplications
                  .relatedApplicationsSection,
              description:
                oldAgePensionFormMessage.connectedApplications
                  .relatedApplicationsSectionDescription,
              large: true,
              doesNotRequireAnswer: true,
              defaultValue: '',
              options: [
                {
                  label: oldAgePensionFormMessage.shared.homeAllowance,
                  value: ConnectedApplications.HOMEALLOWANCE,
                },
                {
                  label:
                    oldAgePensionFormMessage.connectedApplications.childSupport,
                  value: ConnectedApplications.CHILDSUPPORT,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'homeAllowanceSection',
          title: oldAgePensionFormMessage.shared.homeAllowance,
          children: [
            buildMultiField({
              id: 'homeAllowance',
              title: oldAgePensionFormMessage.shared.homeAllowance,
              description: oldAgePensionFormMessage.homeAllowance.description,
              condition: (answers) => {
                const { connectedApplications } = getApplicationAnswers(answers)

                return connectedApplications?.includes(
                  ConnectedApplications.HOMEALLOWANCE,
                )
              },
              children: [
                buildCustomField(
                  {
                    id: 'homeAllowance.alert',
                    title: oldAgePensionFormMessage.homeAllowance.alertTitle,
                    component: 'FieldAlertMessage',
                    description:
                      oldAgePensionFormMessage.homeAllowance.alertDescription,
                    condition: (_, externalData) => {
                      return isExistsCohabitantOlderThan25(externalData)
                    },
                  },
                  { type: 'warning' },
                ),
                buildRadioField({
                  id: 'homeAllowance.housing',
                  title: oldAgePensionFormMessage.homeAllowance.housing,
                  options: [
                    {
                      value: HomeAllowanceHousing.HOUSEOWNER,
                      label:
                        oldAgePensionFormMessage.homeAllowance.housingOwner,
                    },
                    {
                      value: HomeAllowanceHousing.RENTER,
                      label:
                        oldAgePensionFormMessage.homeAllowance.housingRenter,
                    },
                  ],
                  width: 'half',
                }),
                buildRadioField({
                  id: 'homeAllowance.children',
                  title:
                    oldAgePensionFormMessage.homeAllowance
                      .childrenBetween18And25,
                  options: [
                    {
                      value: YES,
                      label: oldAgePensionFormMessage.shared.yes,
                    },
                    {
                      value: NO,
                      label: oldAgePensionFormMessage.shared.no,
                    },
                  ],
                  width: 'half',
                }),
              ],
            }),
            buildFileUploadField({
              id: 'fileUploadHomeAllowance.leaseAgreement',
              title: oldAgePensionFormMessage.fileUpload.homeAllowanceTitle,
              description:
                oldAgePensionFormMessage.fileUpload.homeAllowanceLeaseAgreement,
              introduction:
                oldAgePensionFormMessage.fileUpload.homeAllowanceLeaseAgreement,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              condition: (answers) => {
                const { homeAllowanceHousing } = getApplicationAnswers(answers)

                return homeAllowanceHousing === HomeAllowanceHousing.RENTER
              },
            }),
            buildFileUploadField({
              id: 'fileUploadHomeAllowance.schoolConfirmation',
              title: oldAgePensionFormMessage.fileUpload.homeAllowanceTitle,
              description:
                oldAgePensionFormMessage.fileUpload
                  .homeAllowanceSchoolConfirmation,
              introduction:
                oldAgePensionFormMessage.fileUpload
                  .homeAllowanceSchoolConfirmation,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
              condition: (answers) => {
                const { homeAllowanceChildren } = getApplicationAnswers(answers)

                return homeAllowanceChildren === YES
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: oldAgePensionFormMessage.review.confirmSectionTitle,
      children: [
        buildSubSection({
          id: 'fileUploadAdditionalFiles',
          title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFiles.additionalDocuments',
              title: oldAgePensionFormMessage.fileUpload.additionalFileTitle,
              description:
                oldAgePensionFormMessage.fileUpload.additionalFileDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.additionalFileDescription,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                oldAgePensionFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                oldAgePensionFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                oldAgePensionFormMessage.fileUpload.attachmentButton,
            }),
          ],
        }),
        buildSubSection({
          id: 'commentSection',
          title: oldAgePensionFormMessage.comment.commentSection,
          children: [
            buildTextField({
              id: 'comment',
              title: oldAgePensionFormMessage.comment.commentSection,
              variant: 'textarea',
              rows: 10,
              description: oldAgePensionFormMessage.comment.description,
              placeholder: oldAgePensionFormMessage.comment.placeholder,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: oldAgePensionFormMessage.review.confirmSectionTitle,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirm',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmScreen',
                    title: oldAgePensionFormMessage.review.confirmTitle,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: oldAgePensionFormMessage.review.confirmTitle,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: oldAgePensionFormMessage.review.confirmTitle,
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: 'Takk vantar texta',
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
