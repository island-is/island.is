import {
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
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
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { WorkTypeIllustration } from '../assets/WorkTypeIllustration'
import { NO, UPLOAD_ACCEPT, YES } from '../constants'
import { AccidentNotification } from '../lib/dataSchema'
import {
  accidentDetails,
  accidentLocation,
  accidentType,
  applicantInformation,
  application,
  childInCustody,
  companyInfo,
  conclusion,
  externalData,
  fatalAccident,
  fatalAccidentAttachment,
  fishingCompanyInfo,
  fishingLocationAndPurpose,
  hindrances,
  injuredPersonInformation,
  juridicalPerson,
  locationAndPurpose,
  overview,
  powerOfAttorney,
  rescueSquadInfo,
  schoolInfo,
  sportsClubInfo,
  whoIsTheNotificationFor,
  workMachine,
} from '../lib/messages'
import { attachments } from '../lib/messages/attachments'
import {
  AgricultureAccidentLocationEnum,
  AttachmentsEnum,
  DataProviderTypes,
  FishermanWorkplaceAccidentLocationEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  PowerOfAttorneyUploadEnum,
  ProfessionalAthleteAccidentLocationEnum,
  StudiesAccidentLocationEnum,
  StudiesAccidentTypeEnum,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
} from '../types'
import {
  getAccidentTypeOptions,
  hideLocationAndPurpose,
  isAboardShip,
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isHomeActivitiesAccident,
  isLocatedOnShipOther,
  isProfessionalAthleteAccident,
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  isRepresentativeOfCompanyOrInstitute,
  isRescueWorkAccident,
  isStudiesAccident,
  isWorkAccident,
} from '../utils'
import { isHealthInsured } from '../utils/isHealthInsured'
import { isPowerOfAttorney } from '../utils/isPowerOfAttorney'
import { isUploadNow } from '../utils/isUploadNow'

export const AccidentNotificationForm: Form = buildForm({
  id: 'AccidentNotificationForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'AccidentNotificationForm',
      title: externalData.agreementDescription.sectionTitle,
      children: [
        buildMultiField({
          title: externalData.agreementDescription.sectionTitle,
          id: 'agreementDescriptionMultiField',
          children: [
            buildCustomField({
              id: 'agreementDescriptionCustomField',
              title: '',
              component: 'AgreementDescription',
            }),
          ],
        }),
        buildSubSection({
          id: 'AccidentNotificationForm',
          title: externalData.dataProvider.sectionTitle,
          children: [
            buildExternalDataProvider({
              title: externalData.dataProvider.pageTitle,
              id: 'approveExternalData',
              subTitle: externalData.dataProvider.subTitle,
              description: '',
              checkboxLabel: externalData.dataProvider.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.NationalRegistry,
                  title: externalData.nationalRegistry.title,
                  subTitle: externalData.nationalRegistry.description,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: DataProviderTypes.UserProfile,
                  title: externalData.userProfile.title,
                  subTitle: externalData.userProfile.description,
                }),
                buildDataProviderItem({
                  id: 'revAndCustoms',
                  type: '',
                  title: externalData.revAndCustoms.title,
                  subTitle: externalData.revAndCustoms.description,
                }),
                buildDataProviderItem({
                  id: 'notifications',
                  type: '',
                  title: externalData.notifications.title,
                  subTitle: externalData.notifications.description,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'hindrances',
      title: hindrances.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'timePassedHindrancesMultiField',
          title: hindrances.timePassedHindrance.radioFieldTitle,
          children: [
            buildRadioField({
              id: 'timePassedHindrance',
              title: '',
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
              width: 'half',
              largeButtons: true,
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'timePassedHindranceFielAlertMessage',
              title: hindrances.timePassedHindrance.errorTitle,
              description: hindrances.timePassedHindrance.errorDescription,
              condition: (formValue) => formValue.timePassedHindrance === YES,
            }),
          ],
        }),
        buildMultiField({
          id: 'carHindrancesMultiField',
          title: hindrances.carAccident.radioFieldTitle,
          children: [
            buildRadioField({
              title: '',
              id: 'carAccidentHindrance',
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
              width: 'half',
              largeButtons: true,
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'carAccidentHindranceFielAlertMessage',
              title: hindrances.carAccident.errorTitle,
              description: hindrances.carAccident.errorDescription,
              condition: (formValue) => formValue.carAccidentHindrance === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'informationAboutApplicantSection',
      title: applicantInformation.general.title,
      children: [
        buildMultiField({
          id: 'applicant',
          title: applicantInformation.general.title,
          description: applicantInformation.general.description,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: applicantInformation.labels.name,
              backgroundColor: 'white',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.fullName,
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: applicantInformation.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: applicantInformation.labels.address,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.address
                  ?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: applicantInformation.labels.postalCode,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) => {
                return application.externalData?.nationalRegistry?.data?.address
                  ?.postalCode
              },
            }),
            buildTextField({
              id: 'applicant.city',
              title: applicantInformation.labels.city,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.nationalRegistry?.data?.address?.city,
            }),
            buildTextField({
              id: 'applicant.email',
              title: applicantInformation.labels.email,
              width: 'half',
              variant: 'email',
              required: true,
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.userProfile?.data?.email,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: applicantInformation.labels.tel,
              format: '###-####',
              width: 'half',
              variant: 'tel',
              defaultValue: (application: AccidentNotification) =>
                application.externalData?.userProfile?.data?.mobilePhoneNumber,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'whoIsTheNotificationFor.section',
      title: whoIsTheNotificationFor.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'whoIsTheNotificationFor',
          title: whoIsTheNotificationFor.general.heading,
          description: whoIsTheNotificationFor.general.description,
          children: [
            buildRadioField({
              id: 'whoIsTheNotificationFor.answer',
              title: '',
              options: [
                {
                  value: WhoIsTheNotificationForEnum.ME,
                  label: whoIsTheNotificationFor.labels.me,
                },
                {
                  value: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
                  label: whoIsTheNotificationFor.labels.powerOfAttorney,
                },
                {
                  value: WhoIsTheNotificationForEnum.JURIDICALPERSON,
                  label: whoIsTheNotificationFor.labels.juridicalPerson,
                },
                {
                  value: WhoIsTheNotificationForEnum.CHILDINCUSTODY,
                  label: whoIsTheNotificationFor.labels.childInCustody,
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'injuredPersonInformation.section',
          title: injuredPersonInformation.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'injuredPersonInformation',
              title: injuredPersonInformation.general.heading,
              description: (formValue) =>
                isReportingOnBehalfOfEmployee(formValue.answers)
                  ? injuredPersonInformation.general.juridicalDescription
                  : injuredPersonInformation.general.description,
              children: [
                buildTextField({
                  id: 'injuredPersonInformation.name',
                  title: injuredPersonInformation.labels.name,
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'injuredPersonInformation.nationalId',
                  title: injuredPersonInformation.labels.nationalId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'blue',
                  required: true,
                }),
                buildTextField({
                  id: 'injuredPersonInformation.email',
                  title: injuredPersonInformation.labels.email,
                  backgroundColor: 'blue',
                  width: 'half',
                  variant: 'email',
                  required: true,
                }),
                buildTextField({
                  id: 'injuredPersonInformation.phoneNumber',
                  title: injuredPersonInformation.labels.tel,
                  backgroundColor: 'blue',
                  format: '###-####',
                  width: 'half',
                  variant: 'tel',
                  required: true,
                }),
              ],
            }),
          ],
          condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
        }),
        buildSubSection({
          id: 'juridicalPerson.company',
          title: juridicalPerson.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'juridicalPerson.company',
              title: juridicalPerson.general.title,
              description: juridicalPerson.general.description,
              children: [
                buildTextField({
                  id: 'juridicalPerson.companyName',
                  backgroundColor: 'blue',
                  title: juridicalPerson.labels.companyName,
                  width: 'half',
                  required: true,
                }),
                buildTextField({
                  id: 'juridicalPerson.companyNationalId',
                  backgroundColor: 'blue',
                  title: juridicalPerson.labels.companyNationalId,
                  format: '######-####',
                  width: 'half',
                  required: true,
                }),
                buildCheckboxField({
                  id: 'juridicalPerson.companyConfirmation',
                  title: '',
                  options: [
                    {
                      value: YES,
                      label: juridicalPerson.labels.confirmation,
                    },
                  ],
                }),
              ],
            }),
          ],
          condition: (formValue) => isReportingOnBehalfOfEmployee(formValue),
        }),
        buildSubSection({
          id: 'powerOfAttorney.type.section',
          title: powerOfAttorney.type.sectionTitle,
          children: [
            buildMultiField({
              id: 'powerOfAttorney.type.multifield',
              title: powerOfAttorney.type.heading,
              description: powerOfAttorney.type.description,
              children: [
                buildRadioField({
                  id: 'powerOfAttorney.type',
                  title: '',
                  options: [
                    {
                      value: PowerOfAttorneyUploadEnum.UPLOADNOW,
                      label: powerOfAttorney.labels.uploadNow,
                    },
                    {
                      value: PowerOfAttorneyUploadEnum.UPLOADLATER,
                      label: powerOfAttorney.labels.uploadLater,
                    },
                    {
                      value: PowerOfAttorneyUploadEnum.FORCHILDINCUSTODY,
                      label: powerOfAttorney.labels.forChildInCustody,
                    },
                  ],
                }),
              ],
            }),
          ],
          condition: (formValue) => isPowerOfAttorney(formValue),
        }),
        buildSubSection({
          id: 'childInCustody.section',
          title: childInCustody.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'childInCustody.fields',
              title: childInCustody.general.screenTitle,
              description: childInCustody.general.screenDescription,
              children: [
                buildTextField({
                  id: 'childInCustody.name',
                  backgroundColor: 'blue',
                  title: childInCustody.labels.name,
                  width: 'half',
                  required: true,
                }),
                buildTextField({
                  id: 'childInCustody.nationalId',
                  backgroundColor: 'blue',
                  title: childInCustody.labels.nationalId,
                  format: '######-####',
                  width: 'half',
                  required: true,
                }),
                buildTextField({
                  id: 'childInCustody.email',
                  backgroundColor: 'blue',
                  title: childInCustody.labels.email,
                  variant: 'email',
                  width: 'half',
                }),
                buildTextField({
                  id: 'childInCustody.phoneNumber',
                  backgroundColor: 'blue',
                  variant: 'tel',
                  title: childInCustody.labels.tel,
                  format: '###-####',
                  width: 'half',
                }),
              ],
            }),
          ],
          condition: (answers) => isReportingOnBehalfOfChild(answers),
        }),
        buildSubSection({
          id: 'powerOfAttorney.upload.section',
          title: powerOfAttorney.upload.sectionTitle,
          children: [
            buildMultiField({
              id: 'powerOfAttorney',
              title: powerOfAttorney.upload.heading,
              description: powerOfAttorney.upload.description,
              children: [
                buildFileUploadField({
                  id: 'attachments.powerOfAttorneyFile',
                  title: '',
                  introduction: '',
                  uploadAccept: UPLOAD_ACCEPT,
                  uploadHeader: powerOfAttorney.upload.uploadHeader,
                  uploadDescription: powerOfAttorney.upload.uploadDescription,
                  uploadButtonLabel: powerOfAttorney.upload.uploadButtonLabel,
                }),
              ],
            }),
          ],
          condition: (formValue) => isUploadNow(formValue),
        }),
      ],
    }),
    buildSection({
      id: 'fatalAccident.section',
      title: fatalAccident.general.sectionTitle,
      condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
      children: [
        buildRadioField({
          id: 'wasTheAccidentFatal',
          title: fatalAccident.labels.title,
          backgroundColor: 'blue',
          width: 'half',
          options: [
            { value: YES, label: application.general.yesOptionLabel },
            { value: NO, label: application.general.noOptionLabel },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'fatalAccidentAttachment.section',
      title: fatalAccidentAttachment.general.sectionTitle,
      condition: (formValue) =>
        isReportingOnBehalfOfInjured(formValue) &&
        formValue.wasTheAccidentFatal === YES,
      children: [
        buildRadioField({
          id: 'fatalAccidentUploadDeathCertificateNow',
          title: fatalAccidentAttachment.labels.title,
          description: fatalAccidentAttachment.labels.description,
          backgroundColor: 'blue',
          options: [
            {
              value: YES,
              label: fatalAccidentAttachment.options.addAttachmentsNow,
            },
            {
              value: NO,
              label: fatalAccidentAttachment.options.addAttachmentsLater,
            },
          ],
        }),
        buildSubSection({
          id: 'attachments.deathCertificateFile.subSection',
          title: attachments.general.uploadTitle,
          children: [
            buildFileUploadField({
              id: 'attachments.deathCertificateFile',
              title: attachments.general.uploadHeader,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: attachments.general.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
          condition: (formValue) =>
            isReportingOnBehalfOfInjured(formValue) &&
            formValue.wasTheAccidentFatal === YES &&
            formValue.fatalAccidentUploadDeathCertificateNow === YES,
        }),
      ],
    }),

    buildSection({
      id: 'accidentType.section',
      title: accidentType.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'accidentType.section',
          title: accidentType.general.heading,
          description: accidentType.general.description,
          children: [
            buildRadioField({
              id: 'accidentType.radioButton',
              width: 'half',
              title: '',
              options: (app) => getAccidentTypeOptions(app.answers),
            }),
          ],
        }),
        buildSubSection({
          id: 'workAccident.subSection',
          title: accidentType.workAccidentType.subSectionTitle,
          children: [
            buildMultiField({
              id: 'workAccident.section',
              title: accidentType.workAccidentType.heading,
              description: accidentType.workAccidentType.description,
              children: [
                buildRadioField({
                  id: 'workAccident.type',
                  width: 'half',
                  title: '',
                  options: [
                    {
                      value: WorkAccidentTypeEnum.GENERAL,
                      label: accidentType.workAccidentType.generalWorkAccident,
                      illustration: WorkTypeIllustration,
                    },
                    {
                      value: WorkAccidentTypeEnum.FISHERMAN,
                      label: accidentType.workAccidentType.fishermanAccident,
                      illustration: WorkTypeIllustration,
                    },
                    {
                      value: WorkAccidentTypeEnum.PROFESSIONALATHLETE,
                      label: accidentType.workAccidentType.professionalAthlete,
                      illustration: WorkTypeIllustration,
                    },
                    {
                      value: WorkAccidentTypeEnum.AGRICULTURE,
                      label: accidentType.workAccidentType.agricultureAccident,
                      illustration: WorkTypeIllustration,
                    },
                  ],
                }),
                buildCustomField(
                  {
                    id: 'attachments.injuryCertificate.alert',
                    title: attachments.labels.alertMessage,
                    description:
                      accidentType.warning.agricultureAccidentWarning,
                    component: 'FieldAlertMessage',
                    condition: (formValue) => isAgricultureAccident(formValue),
                  },
                  { type: 'warning' },
                ),
              ],
            }),
          ],
          condition: (formValue) => isWorkAccident(formValue),
        }),
        buildSubSection({
          id: 'studiesAccident.subSection',
          title: accidentType.workAccidentType.subSectionTitle,
          children: [
            buildMultiField({
              id: 'studiesAccident.section',
              title: accidentType.studiesAccidentType.heading,
              description: accidentType.studiesAccidentType.description,
              children: [
                buildRadioField({
                  id: 'studiesAccident.type',
                  title: '',
                  options: [
                    {
                      value: StudiesAccidentTypeEnum.APPRENTICESHIP,
                      label: accidentType.studiesAccidentType.apprenticeship,
                    },
                    {
                      value: StudiesAccidentTypeEnum.INTERNSHIP,
                      label: accidentType.studiesAccidentType.internship,
                    },
                    {
                      value: StudiesAccidentTypeEnum.VOCATIONALEDUCATION,
                      label:
                        accidentType.studiesAccidentType.vocationalEducation,
                    },
                  ],
                }),
              ],
            }),
          ],
          condition: (formValue) => isStudiesAccident(formValue),
        }),
      ],
    }),

    // Location and purpose of the injured when the accident occured, relevant to all cases except home activites
    buildSection({
      title: locationAndPurpose.general.title,
      condition: (formValue) => !isHomeActivitiesAccident(formValue),
      children: [
        // Sports club employee hindrance
        buildSubSection({
          id: 'sportsClubInfo.employee.section',
          title: sportsClubInfo.employee.sectionTitle,
          condition: (formValue) => isProfessionalAthleteAccident(formValue),
          children: [
            buildMultiField({
              id: 'sportsClubInfo.employee.field',
              title: sportsClubInfo.employee.title,
              children: [
                buildRadioField({
                  id: 'sportsClubInfo.employee.radioButton',
                  width: 'half',
                  title: '',
                  options: [
                    {
                      value: YES,
                      label: application.general.yesOptionLabel,
                    },
                    {
                      value: NO,
                      label: application.general.noOptionLabel,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),

        // Accident location section
        buildSubSection({
          id: 'accidentLocation',
          title: accidentLocation.general.sectionTitle,
          children: [
            // location of general work related accident
            buildMultiField({
              id: 'accidentLocation.generalWorkAccident',
              title: accidentLocation.general.heading,
              description: accidentLocation.general.description,
              condition: (formValue) => isGeneralWorkplaceAccident(formValue),
              children: [
                buildRadioField({
                  id: 'accidentLocation.answer',
                  title: '',
                  options: [
                    {
                      value:
                        GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE,
                      label:
                        accidentLocation.generalWorkAccident.atTheWorkplace,
                    },
                    {
                      value:
                        GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
                      label:
                        accidentLocation.generalWorkAccident
                          .toOrFromTheWorkplace,
                    },
                    {
                      value: GeneralWorkplaceAccidentLocationEnum.OTHER,
                      label: accidentLocation.generalWorkAccident.other,
                    },
                  ],
                }),
              ],
            }),
            // location of rescue work related accident
            buildMultiField({
              id: 'accidentLocation.rescueWorkAccident',
              title: accidentLocation.general.heading,
              description: accidentLocation.rescueWorkAccident.description,
              condition: (formValue) => {
                return isRescueWorkAccident(formValue)
              },
              children: [
                buildRadioField({
                  id: 'accidentLocation.answer',
                  title: '',
                  options: [
                    {
                      value:
                        GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE,
                      label:
                        accidentLocation.generalWorkAccident.atTheWorkplace,
                    },
                    {
                      value:
                        GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
                      label:
                        accidentLocation.generalWorkAccident
                          .toOrFromTheWorkplace,
                    },
                    {
                      value: GeneralWorkplaceAccidentLocationEnum.OTHER,
                      label: accidentLocation.generalWorkAccident.other,
                    },
                  ],
                }),
              ],
            }),
            // location of studies related accident
            buildMultiField({
              id: 'accidentLocation.studiesAccident',
              title: accidentLocation.studiesAccidentLocation.heading,
              description: accidentLocation.studiesAccidentLocation.description,
              condition: (formValue) => isStudiesAccident(formValue),
              children: [
                buildRadioField({
                  id: 'accidentLocation.answer',
                  title: '',
                  options: [
                    {
                      value: StudiesAccidentLocationEnum.ATTHESCHOOL,
                      label:
                        accidentLocation.studiesAccidentLocation.atTheSchool,
                    },
                    {
                      value: StudiesAccidentLocationEnum.OTHER,
                      label: accidentLocation.studiesAccidentLocation.other,
                    },
                  ],
                }),
              ],
            }),
            // location of fisherman related accident
            buildMultiField({
              id: 'accidentLocation.fishermanAccident',
              title: accidentLocation.general.heading,
              description: accidentLocation.general.description,
              condition: (formValue) => isFishermanAccident(formValue),
              children: [
                buildRadioField({
                  id: 'accidentLocation.answer',
                  title: '',
                  options: [
                    {
                      value: FishermanWorkplaceAccidentLocationEnum.ONTHESHIP,
                      label: accidentLocation.fishermanAccident.onTheShip,
                    },
                    {
                      value:
                        FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
                      label:
                        accidentLocation.fishermanAccident.toOrFromTheWorkplace,
                    },
                    {
                      value: FishermanWorkplaceAccidentLocationEnum.OTHER,
                      label: accidentLocation.fishermanAccident.other,
                    },
                  ],
                }),
              ],
            }),
            // location of sports related accident
            buildMultiField({
              id: 'accidentLocation.professionalAthleteAccident',
              title: accidentLocation.general.heading,
              description: accidentLocation.general.description,
              condition: (formValue) =>
                isProfessionalAthleteAccident(formValue) &&
                !isHomeActivitiesAccident(formValue),
              children: [
                buildRadioField({
                  id: 'accidentLocation.answer',
                  title: '',
                  options: [
                    {
                      value:
                        ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES,
                      label:
                        accidentLocation.professionalAthleteAccident
                          .atTheClubsSportsFacilites,
                    },
                    {
                      value:
                        ProfessionalAthleteAccidentLocationEnum.TOORFROMTHESPORTCLUBSFACILITES,
                      label:
                        accidentLocation.professionalAthleteAccident
                          .toOrFromTheSportsFacilites,
                    },
                    {
                      value: ProfessionalAthleteAccidentLocationEnum.OTHER,
                      label: accidentLocation.professionalAthleteAccident.other,
                    },
                  ],
                }),
              ],
            }),
            // location of agriculture related accident
            buildMultiField({
              id: 'accidentLocation.agricultureAccident',
              title: accidentLocation.general.heading,
              description: accidentLocation.general.description,
              children: [
                buildRadioField({
                  id: 'accidentLocation.answer',
                  title: '',
                  options: [
                    {
                      value: AgricultureAccidentLocationEnum.ATTHEWORKPLACE,
                      label:
                        accidentLocation.agricultureAccident.atTheWorkplace,
                    },
                    {
                      value:
                        AgricultureAccidentLocationEnum.TOORFROMTHEWORKPLACE,
                      label:
                        accidentLocation.agricultureAccident
                          .toOrFromTheWorkplace,
                    },
                    {
                      value: AgricultureAccidentLocationEnum.OTHER,
                      label: accidentLocation.agricultureAccident.other,
                    },
                  ],
                }),
              ],
              condition: (formValue) => isAgricultureAccident(formValue),
            }),
          ],
        }),
        // Fisherman information only applicable to fisherman workplace accidents
        // that happen aboard a ship.
        buildSubSection({
          id: 'fishermanLocation.section',
          title: accidentLocation.fishermanAccidentLocation.heading,
          condition: (formValue) => isAboardShip(formValue),
          children: [
            buildMultiField({
              id: 'fishermanLocation.multifield',
              title: accidentLocation.fishermanAccidentLocation.heading,
              description:
                accidentLocation.fishermanAccidentLocation.description,
              children: [
                buildRadioField({
                  id: 'fishermanLocation.answer',
                  title: '',
                  backgroundColor: 'blue',
                  options: [
                    {
                      value:
                        FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING,
                      label:
                        accidentLocation.fishermanAccidentLocation.whileSailing,
                    },
                    {
                      value: FishermanWorkplaceAccidentShipLocationEnum.HARBOR,
                      label:
                        accidentLocation.fishermanAccidentLocation.inTheHarbor,
                    },
                    {
                      value: FishermanWorkplaceAccidentShipLocationEnum.OTHER,
                      label: accidentLocation.fishermanAccidentLocation.other,
                    },
                  ],
                }),
              ],
            }),
            buildMultiField({
              id: 'fishermanLocation.other',
              title: fishingLocationAndPurpose.general.title,
              description: fishingLocationAndPurpose.general.description,
              condition: (formValue) => isLocatedOnShipOther(formValue),
              children: [
                buildTextField({
                  id: 'fishermanLocation.locationAndPurpose.location',
                  title: fishingLocationAndPurpose.labels.location,
                  backgroundColor: 'blue',
                }),
                buildTextField({
                  id: 'fishermanLocation.locationAndPurpose.purpose',
                  title: fishingLocationAndPurpose.labels.purpose,
                  backgroundColor: 'blue',
                  rows: 6,
                  variant: 'textarea',
                  placeholder: fishingLocationAndPurpose.placeholder.purpose,
                }),
              ],
            }),
          ],
        }),
        buildMultiField({
          title: locationAndPurpose.general.title,
          description: locationAndPurpose.general.description,
          condition: (formValue) =>
            !isFishermanAccident(formValue) &&
            !hideLocationAndPurpose(formValue),
          children: [
            buildTextField({
              id: 'locationAndPurpose.location',
              title: locationAndPurpose.labels.location,
              backgroundColor: 'blue',
              variant: 'textarea',
              required: true,
              rows: 4,
            }),
            buildTextField({
              id: 'locationAndPurpose.purpose',
              title: locationAndPurpose.labels.purpose,
              backgroundColor: 'blue',
              variant: 'textarea',
              required: true,
              rows: 6,
            }),
          ],
        }),
      ],
    }),
    // Workmachine information only applicable to generic workplace accidents
    buildSection({
      id: 'workMachine.section',
      title: workMachine.general.sectionTitle,
      condition: (formValue) => isGeneralWorkplaceAccident(formValue),
      children: [
        buildMultiField({
          id: 'workMachine',
          title: workMachine.general.workMachineRadioTitle,
          description: '',
          children: [
            buildRadioField({
              id: 'workMachineRadio',
              title: '',
              backgroundColor: 'blue',
              width: 'half',
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'workMachine.subSection',
          title: workMachine.general.subSectionTitle,
          condition: (formValue) => formValue.workMachineRadio === YES,
          children: [
            buildMultiField({
              title: workMachine.general.subSectionTitle,
              children: [
                buildTextField({
                  id: 'workMachine.desriptionOfMachine',
                  title: workMachine.labels.desriptionOfMachine,
                  placeholder: workMachine.placeholder.desriptionOfMachine,
                  backgroundColor: 'blue',
                  rows: 4,
                  variant: 'textarea',
                  required: true,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Details of the accident
    buildSection({
      id: 'accidentDetails.section',
      title: accidentDetails.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'accidentDetails',
          title: accidentDetails.general.sectionTitle,
          description: accidentDetails.general.description,
          children: [
            buildCustomField({
              id: 'accidentDetails.dateOfAccident',
              title: accidentDetails.labels.date,
              component: 'DateOfAccident',
              width: 'half',
            }),
            buildTextField({
              id: 'accidentDetails.timeOfAccident',
              title: accidentDetails.labels.time,
              placeholder: accidentDetails.placeholder.time,
              backgroundColor: 'blue',
              width: 'half',
              format: '##:##',
            }),
            buildCustomField(
              {
                id: 'accidentDetails.notHealthInsuredAlertMessage',
                title: accidentDetails.general.insuranceAlertTitle,
                component: 'FieldAlertMessage',
                description: accidentDetails.general.insuranceAlertText,
                width: 'full',
                condition: (formValue) => !isHealthInsured(formValue),
              },
              { type: 'warning', marginBottom: 0, marginTop: 2 },
            ),
            buildTextField({
              id: 'accidentDetails.descriptionOfAccident',
              title: accidentDetails.labels.description,
              placeholder: accidentDetails.placeholder.description,
              backgroundColor: 'blue',
              rows: 10,
              variant: 'textarea',
            }),
          ],
        }),
      ],
    }),
    // Attachments section files are optional at this point
    buildSection({
      id: 'attachments.section',
      title: attachments.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'attachments',
          title: attachments.general.heading,
          children: [
            buildRadioField({
              id: 'attachments.injuryCertificate',
              title: '',
              description: attachments.general.description,
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
              options: [
                {
                  value: AttachmentsEnum.INJURYCERTIFICATE,
                  label: attachments.labels.injuryCertificate,
                },
                {
                  value: AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
                  label: attachments.labels.hospitalSendsCertificate,
                },
                {
                  value: AttachmentsEnum.SENDCERTIFICATELATER,
                  label: attachments.labels.sendCertificateLater,
                },
              ],
            }),
            buildRadioField({
              id: 'attachments.injuryCertificate',
              title: '',
              description: attachments.general.description,
              condition: (formValue) =>
                isRepresentativeOfCompanyOrInstitute(formValue),
              options: [
                {
                  value: AttachmentsEnum.INJURYCERTIFICATE,
                  label: attachments.labels.injuryCertificate,
                },
                {
                  value: AttachmentsEnum.HOSPITALSENDSCERTIFICATE,
                  label: attachments.labels.hospitalSendsCertificate,
                },
                {
                  value: AttachmentsEnum.INJUREDSENDSCERTIFICATE,
                  label: attachments.labels.injuredSendsCertificate,
                },
                {
                  value: AttachmentsEnum.SENDCERTIFICATELATER,
                  label: attachments.labels.sendCertificateLater,
                },
              ],
            }),
            buildCustomField(
              {
                id: 'attachments.injuryCertificate.alert',
                title: attachments.labels.alertMessage,
                description: attachments.general.alertMessage,
                component: 'FieldAlertMessage',
                condition: (formValue) =>
                  (formValue as {
                    attachments: { injuryCertificate: AttachmentsEnum }
                  }).attachments?.injuryCertificate ===
                  AttachmentsEnum.SENDCERTIFICATELATER,
              },
              { type: 'warning' },
            ),
          ],
        }),
        buildSubSection({
          id: 'attachments.injuryCertificateFile.section',
          title: attachments.general.uploadTitle,
          children: [
            buildFileUploadField({
              id: 'attachments.injuryCertificateFile',
              title: attachments.general.uploadHeader,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: injuredPersonInformation.upload.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
          condition: (formValue) =>
            (formValue as {
              attachments: { injuryCertificate: AttachmentsEnum }
            }).attachments?.injuryCertificate ===
            AttachmentsEnum.INJURYCERTIFICATE,
        }),
      ],
    }),
    // Company information if work accident without the injured being a fisherman
    buildSection({
      title: companyInfo.general.title,
      condition: (formValue) =>
        isGeneralWorkplaceAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          title: companyInfo.general.title,
          description: companyInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: companyInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'companyInfo.companyName',
              title: companyInfo.labels.companyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: companyInfo.labels.checkBox,
                },
              ],
            }),
            buildDescriptionField({
              id: 'companyInfo.descriptionField',
              description: '',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: companyInfo.labels.descriptionField,
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'companyInfo.name',
              title: companyInfo.labels.name,
              backgroundColor: 'blue',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'companyInfo.email',
              title: companyInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'companyInfo.phoneNumber',
              title: companyInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
          ],
        }),
      ],
    }),
    // School information if school accident
    buildSection({
      title: schoolInfo.general.title,
      condition: (formValue) =>
        isStudiesAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          title: schoolInfo.general.title,
          description: schoolInfo.general.description,
          children: [
            buildTextField({
              id: 'schoolInfo.nationalRegistrationId',
              title: schoolInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'schoolInfo.companyName',
              title: schoolInfo.labels.companyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: schoolInfo.labels.checkBox,
                },
              ],
            }),
            buildDescriptionField({
              id: 'schoolInfo.descriptionField',
              description: '',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: schoolInfo.labels.descriptionField,
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'schoolInfo.name',
              title: schoolInfo.labels.name,
              backgroundColor: 'blue',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'schoolInfo.email',
              title: schoolInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'schoolInfo.phoneNumber',
              title: schoolInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
          ],
        }),
      ],
    }),
    // fishery information if fisherman
    buildSection({
      title: fishingCompanyInfo.general.title,
      condition: (formValue) =>
        isFishermanAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          title: fishingCompanyInfo.general.title,
          description: fishingCompanyInfo.general.description,
          children: [
            buildTextField({
              id: 'fishingCompanyInfo.nationalRegistrationId',
              title: fishingCompanyInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'fishingCompanyInfo.companyName',
              title: fishingCompanyInfo.labels.companyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: fishingCompanyInfo.labels.checkBox,
                },
              ],
            }),
            buildDescriptionField({
              id: 'fishingCompanyInfo.descriptionField',
              description: '',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: fishingCompanyInfo.labels.descriptionField,
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'fishingCompanyInfo.name',
              title: fishingCompanyInfo.labels.name,
              backgroundColor: 'blue',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'fishingCompanyInfo.email',
              title: fishingCompanyInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'fishingCompanyInfo.phoneNumber',
              title: fishingCompanyInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
          ],
        }),
      ],
    }),
    // Sports club information when the injured has a sports related accident
    buildSection({
      title: sportsClubInfo.general.title,
      condition: (formValue) =>
        isProfessionalAthleteAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          title: sportsClubInfo.general.title,
          description: sportsClubInfo.general.description,
          children: [
            buildTextField({
              id: 'sportsClubInfo.nationalRegistrationId',
              title: sportsClubInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'sportsClubInfo.companyName',
              title: sportsClubInfo.labels.companyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: sportsClubInfo.labels.checkBox,
                },
              ],
            }),
            buildDescriptionField({
              id: 'sportsClubInfo.descriptionField',
              description: '',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: sportsClubInfo.labels.descriptionField,
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'sportsClubInfo.name',
              title: sportsClubInfo.labels.name,
              backgroundColor: 'blue',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'sportsClubInfo.email',
              title: sportsClubInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'sportsClubInfo.phoneNumber',
              title: sportsClubInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
          ],
        }),
      ],
    }),
    // Rescue squad information when accident is related to rescue squad
    buildSection({
      title: rescueSquadInfo.general.title,
      condition: (formValue) =>
        isRescueWorkAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          title: rescueSquadInfo.general.title,
          description: rescueSquadInfo.general.description,
          children: [
            buildTextField({
              id: 'rescueSquadInfo.nationalRegistrationId',
              title: rescueSquadInfo.labels.nationalId,
              backgroundColor: 'blue',
              width: 'half',
              format: '######-####',
              required: true,
            }),
            buildTextField({
              id: 'rescueSquadInfo.companyName',
              title: rescueSquadInfo.labels.companyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: rescueSquadInfo.labels.checkBox,
                },
              ],
            }),
            buildDescriptionField({
              id: 'rescueSquadInfo.descriptionField',
              description: '',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: rescueSquadInfo.labels.descriptionField,
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'rescueSquadInfo.name',
              title: rescueSquadInfo.labels.name,
              backgroundColor: 'blue',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'rescueSquadInfo.email',
              title: rescueSquadInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'rescueSquadInfo.phoneNumber',
              title: rescueSquadInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              condition: (formValue) =>
                !isRepresentativeOfCompanyOrInstitute(formValue),
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'overview.section',
      title: overview.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'overview.multifield',
          title: overview.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'overview',
              title: overview.general.sectionTitle,
              component: 'FormOverview',
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.labels.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'conclusion.section',
      title: conclusion.general.title,
      children: [
        buildCustomField({
          id: 'conclusion.information',
          title: conclusion.general.title,
          component: 'FormConclusion',
        }),
      ],
    }),
  ],
})
