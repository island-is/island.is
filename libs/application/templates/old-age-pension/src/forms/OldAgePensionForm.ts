import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildRepeater,
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
  ApplicationType,
  ConnectedApplications,
  Employment,
  FILE_SIZE_LIMIT,
  HomeAllowanceHousing,
  NO,
  RatioType,
  YES,
} from '../lib/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getYesNOOptions,
  isEarlyRetirement,
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
                  condition: (_, externalData) => {
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
                  condition: (_, externalData) => {
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
                  condition: (_, externalData) => {
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
                  options: getYesNOOptions(),
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
          id: 'employment',
          title: oldAgePensionFormMessage.employer.employerTitle,
          children: [
            buildRadioField({
              id: 'employment.status',
              title:
                oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
              description:
                oldAgePensionFormMessage.employer
                  .selfEmployedOrEmployeeDescription,
              options: [
                {
                  value: Employment.SELFEMPLOYED,
                  label: oldAgePensionFormMessage.employer.selfEmployed,
                },
                {
                  value: Employment.EMPLOYEE,
                  label: oldAgePensionFormMessage.employer.employee,
                },
              ],
              defaultValue: Employment.EMPLOYEE,
              width: 'half',
              largeButtons: true,
            }),
            buildFileUploadField({
              id: 'employment.selfEmployedAttachment',
              title: oldAgePensionFormMessage.fileUpload.selfEmployedTitle,
              description:
                oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload.selfEmployedDescription,
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
                const { employmentStatus } = getApplicationAnswers(answers)

                return employmentStatus === Employment.SELFEMPLOYED
              },
            }),
            buildRepeater({
              id: 'employment.employers',
              title: oldAgePensionFormMessage.employer.employerTitle,
              component: 'EmployersOverview',
              condition: (answers) => {
                const { employmentStatus } = getApplicationAnswers(answers)

                return employmentStatus === Employment.EMPLOYEE
              },
              children: [
                buildMultiField({
                  id: 'addEmployers',
                  title: oldAgePensionFormMessage.employer.registrationTitle,
                  description:
                    oldAgePensionFormMessage.employer.employerDescription,
                  isPartOfRepeater: true,
                  children: [
                    buildTextField({
                      id: 'email',
                      variant: 'email',
                      title: oldAgePensionFormMessage.employer.email,
                    }),
                    buildTextField({
                      id: 'phoneNumber',
                      variant: 'tel',
                      format: '###-####',
                      placeholder: '000-0000',
                      title: oldAgePensionFormMessage.employer.phoneNumber,
                    }),
                    buildRadioField({
                      id: 'ratioType',
                      title: '',
                      width: 'half',
                      space: 3,
                      options: [
                        {
                          value: RatioType.YEARLY,
                          label: oldAgePensionFormMessage.employer.ratioYearly,
                        },
                        {
                          value: RatioType.MONTHLY,
                          label: oldAgePensionFormMessage.employer.ratioMonthly,
                        },
                      ],
                    }),
                    buildTextField({
                      id: 'ratioYearly',
                      description: '',
                      title: oldAgePensionFormMessage.employer.ratio,
                      suffix: '%',
                      condition: (answers) => {
                        const { rawEmployers } = getApplicationAnswers(answers)
                        const currentEmployer =
                          rawEmployers[rawEmployers.length - 1]

                        return currentEmployer.ratioType === RatioType.YEARLY
                      },
                      placeholder: '1%',
                      variant: 'number',
                      width: 'half',
                    }),

                    // buildSelectField({
                    //   id: 'ratio',
                    //   dataTestId: 'employment-ratio',
                    //   title: parentalLeaveFormMessages.employer.ratio,
                    //   placeholder:
                    //     parentalLeaveFormMessages.employer.ratioPlaceholder,
                    //   options: Array(100)
                    //     .fill(undefined)
                    //     .map((_, idx, array) => ({
                    //       value: `${array.length - idx}`,
                    //       label: `${array.length - idx}%`,
                    //     })),
                    // }),
                  ],
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
                buildCustomField(
                  {
                    id: 'period.alert',
                    title: oldAgePensionFormMessage.period.periodAlertTitle,
                    component: 'EarlyRetirementWarning',
                    condition: (answers, externalData) => {
                      return isEarlyRetirement(answers, externalData)
                    },
                  },
                  {
                    descriptionFirstPart:
                      oldAgePensionFormMessage.period
                        .periodAlertDescriptionFirstPart,
                    descriptionSecondPart:
                      oldAgePensionFormMessage.period
                        .periodAlertDescriptionSecondPart,
                    linkName:
                      oldAgePensionFormMessage.period.periodAlertLinkName,
                    url: oldAgePensionFormMessage.period.periodAlertUrl,
                  },
                ),
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
                return isEarlyRetirement(answers, externalData)
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
                const { applicationType } = getApplicationAnswers(answers)

                return applicationType === ApplicationType.FISHERMEN
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
                  options: getYesNOOptions(),
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
      title:
        oldAgePensionFormMessage.connectedApplications
          .connectedApplicationsSection,
      children: [
        buildSubSection({
          id: 'connectedApplicationsSubSection',
          title:
            oldAgePensionFormMessage.connectedApplications
              .connectedApplicationsSection,
          children: [
            buildCheckboxField({
              id: 'connectedApplications',
              title:
                oldAgePensionFormMessage.connectedApplications
                  .connectedApplicationsSection,
              description:
                oldAgePensionFormMessage.connectedApplications
                  .connectedpplicationsSectionDescription,
              large: true,
              doesNotRequireAnswer: true,
              defaultValue: '',
              options: (application) => {
                const { applicationType } = getApplicationAnswers(
                  application.answers,
                )
                return [
                  {
                    label:
                      applicationType === ApplicationType.HALFRETIREMENTPENSION
                        ? oldAgePensionFormMessage.connectedApplications
                            .halfHomeAllowance
                        : oldAgePensionFormMessage.connectedApplications
                            .homeAllowance,
                    value: ConnectedApplications.HOMEALLOWANCE,
                  },
                  {
                    label:
                      oldAgePensionFormMessage.connectedApplications
                        .childPension,
                    value: ConnectedApplications.CHILDPENSION,
                  },
                ]
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'homeAllowanceSection',
          title: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )
            return applicationType === ApplicationType.HALFRETIREMENTPENSION
              ? oldAgePensionFormMessage.connectedApplications.halfHomeAllowance
              : oldAgePensionFormMessage.connectedApplications.homeAllowance
          },
          children: [
            buildMultiField({
              id: 'homeAllowance',
              title: (application) => {
                const { applicationType } = getApplicationAnswers(
                  application.answers,
                )
                return applicationType === ApplicationType.HALFRETIREMENTPENSION
                  ? oldAgePensionFormMessage.connectedApplications
                      .halfHomeAllowance
                  : oldAgePensionFormMessage.connectedApplications.homeAllowance
              },
              description:
                oldAgePensionFormMessage.connectedApplications
                  .homeAllowanceDescription,
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
                    title:
                      oldAgePensionFormMessage.connectedApplications
                        .homeAllowanceAlertTitle,
                    component: 'FieldAlertMessage',
                    description:
                      oldAgePensionFormMessage.connectedApplications
                        .homeAllowanceAlertDescription,
                    condition: (_, externalData) => {
                      return isExistsCohabitantOlderThan25(externalData)
                    },
                  },
                  { type: 'warning' },
                ),
                buildRadioField({
                  id: 'homeAllowance.housing',
                  title:
                    oldAgePensionFormMessage.connectedApplications
                      .homeAllowanceHousing,
                  options: [
                    {
                      value: HomeAllowanceHousing.HOUSEOWNER,
                      label:
                        oldAgePensionFormMessage.connectedApplications
                          .homeAllowanceHousingOwner,
                    },
                    {
                      value: HomeAllowanceHousing.RENTER,
                      label:
                        oldAgePensionFormMessage.connectedApplications
                          .homeAllowanceHousingRenter,
                    },
                  ],
                  width: 'half',
                  required: true,
                }),
                buildRadioField({
                  id: 'homeAllowance.children',
                  title:
                    oldAgePensionFormMessage.connectedApplications
                      .homeAllowanceChildrenBetween18And25,
                  options: getYesNOOptions(),
                  width: 'half',
                  required: true,
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
                const {
                  homeAllowanceHousing,
                  connectedApplications,
                } = getApplicationAnswers(answers)

                return (
                  homeAllowanceHousing === HomeAllowanceHousing.RENTER &&
                  connectedApplications?.includes(
                    ConnectedApplications.HOMEALLOWANCE,
                  )
                )
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
                const {
                  homeAllowanceChildren,
                  connectedApplications,
                } = getApplicationAnswers(answers)

                return (
                  homeAllowanceChildren === YES &&
                  connectedApplications?.includes(
                    ConnectedApplications.HOMEALLOWANCE,
                  )
                )
              },
            }),
          ],
        }),
        buildSubSection({
          id: 'childPensionSection',
          title: oldAgePensionFormMessage.connectedApplications.childPension,
          // viljum við hafa condition-ið á þessu level-i eða neðar?
          condition: (answers) => {
            const { connectedApplications } = getApplicationAnswers(answers)

            return connectedApplications?.includes(
              ConnectedApplications.CHILDPENSION,
            )
          },
          children: [
            buildMultiField({
              id: 'childPension',
              title:
                oldAgePensionFormMessage.connectedApplications.childPension,
              description:
                oldAgePensionFormMessage.connectedApplications
                  .childPensionDescription,
              children: [
                buildCustomField({
                  id: 'childPension.table',
                  title:
                    oldAgePensionFormMessage.connectedApplications
                      .childPensionKidsTitle,
                  description:
                    oldAgePensionFormMessage.connectedApplications
                      .childPensionKidsDescription,
                  component: 'ChildCustodyTable',
                }),
              ],
            }),
            buildFileUploadField({
              id: 'childPension.maintenanceFileupload',
              title: oldAgePensionFormMessage.fileUpload.childPensionTitle,
              description:
                oldAgePensionFormMessage.fileUpload
                  .childPensionMaintenanceDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload
                  .childPensionMaintenanceDescription,
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
              id: 'childPension.notLivesWithApplicantFileupload',
              title: oldAgePensionFormMessage.fileUpload.childPensionTitle,
              description:
                oldAgePensionFormMessage.fileUpload
                  .childPensiontNotLivesWithApplicantDescription,
              introduction:
                oldAgePensionFormMessage.fileUpload
                  .childPensionNotLivesWithApplicantDescription,
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
      ],
    }),
    buildSection({
      id: 'additionalInformation',
      title: oldAgePensionFormMessage.comment.additionalInfoTitle,
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
