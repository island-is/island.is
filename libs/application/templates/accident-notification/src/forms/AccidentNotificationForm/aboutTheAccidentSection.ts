import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { NO, UPLOAD_ACCEPT, YES, FILE_SIZE_LIMIT } from '../../constants'
import {
  accidentDetails,
  accidentLocation,
  accidentType,
  application,
  companyInfo,
  fatalAccident,
  fatalAccidentAttachment,
  fishingCompanyInfo,
  hindrances,
  injuredPersonInformation,
  locationAndPurpose,
  rescueSquadInfo,
  schoolInfo,
  sportsClubInfo,
  workMachine,
  representativeInfo,
  addDocuments,
  attachments,
  error,
} from '../../lib/messages'
import {
  AgricultureAccidentLocationEnum,
  AttachmentsEnum,
  FishermanWorkplaceAccidentLocationEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  ProfessionalAthleteAccidentLocationEnum,
  RescueWorkAccidentLocationEnum,
  StudiesAccidentLocationEnum,
  StudiesAccidentTypeEnum,
  WorkAccidentTypeEnum,
} from '../../types'
import {
  getAccidentTypeOptions,
  hideLocationAndPurpose,
  isAgricultureAccident,
  isFatalAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isHomeActivitiesAccident,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  isInternshipStudiesAccident,
  isProfessionalAthleteAccident,
  isReportingOnBehalfOfEmployee,
  isReportingOnBehalfOfInjured,
  isRepresentativeOfCompanyOrInstitute,
  isRescueWorkAccident,
  isStudiesAccident,
  isWorkAccident,
} from '../../utils'
import { isHealthInsured } from '../../utils/isHealthInsured'

export const aboutTheAccidentSection = buildSection({
  id: 'accidentType.section',
  title: accidentType.general.sectionTitle,
  children: [
    buildSubSection({
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
              required: true,
            }),
            buildAlertMessageField({
              id: 'timePassedHindranceFielAlertMessage',
              title: hindrances.timePassedHindrance.errorTitle,
              message: hindrances.timePassedHindrance.errorDescription,
              alertType: 'info',
              doesNotRequireAnswer: true,
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
              required: true,
            }),
            buildAlertMessageField({
              id: 'carAccidentHindranceFielAlertMessage',
              title: hindrances.carAccident.errorTitle,
              message: hindrances.carAccident.errorDescription,
              alertType: 'info',
              doesNotRequireAnswer: true,
              condition: (formValue) => formValue.carAccidentHindrance === YES,
            }),
          ],
        }),
      ],
    }),

    buildSubSection({
      id: 'accidentType.section',
      title: accidentType.general.subsectionTitle,
      children: [
        buildRadioField({
          id: 'accidentType.radioButton',
          width: 'half',
          title: accidentType.general.heading,
          description: accidentType.general.description,
          options: (formValue) => getAccidentTypeOptions(formValue.answers),
        }),
      ],
    }),
    buildSubSection({
      id: 'workAccident.subSection',
      title: accidentType.workAccidentType.subSectionTitle,
      condition: (formValue) => isWorkAccident(formValue),
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
                },
                {
                  value: WorkAccidentTypeEnum.FISHERMAN,
                  label: accidentType.workAccidentType.fishermanAccident,
                },
                {
                  value: WorkAccidentTypeEnum.PROFESSIONALATHLETE,
                  label: accidentType.workAccidentType.professionalAthlete,
                },
                {
                  value: WorkAccidentTypeEnum.AGRICULTURE,
                  label: accidentType.workAccidentType.agricultureAccident,
                },
              ],
            }),
            buildAlertMessageField({
              id: 'attachments.injuryCertificate.alert2',
              title: attachments.labels.alertMessage,
              description: accidentType.warning.agricultureAccidentWarning,
              doesNotRequireAnswer: true,
              message: accidentType.warning.agricultureAccidentWarning,
              alertType: 'warning',
              condition: (formValue) => isAgricultureAccident(formValue),
              marginBottom: 5,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'studiesAccident.subSection',
      title: accidentType.workAccidentType.subSectionTitle,
      condition: (formValue) => isStudiesAccident(formValue),
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
                  value: StudiesAccidentTypeEnum.INTERNSHIP,
                  label: accidentType.studiesAccidentType.internship,
                },
                {
                  value: StudiesAccidentTypeEnum.APPRENTICESHIP,
                  label: accidentType.studiesAccidentType.apprenticeship,
                },
                {
                  value: StudiesAccidentTypeEnum.VOCATIONALEDUCATION,
                  label: accidentType.studiesAccidentType.vocationalEducation,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    // Location Subsection
    buildSubSection({
      id: 'location.subSection',
      title: 'Staðsetning',
      children: [
        buildMultiField({
          id: 'sportsClubInfo.employee.field',
          title: sportsClubInfo.employee.title,
          condition: (formValue) => isProfessionalAthleteAccident(formValue),
          children: [
            buildRadioField({
              id: 'onPayRoll.answer',
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

        // Accident location section
        // location of home related accident
        buildMultiField({
          id: 'accidentLocation.homeAccident',
          title: accidentLocation.homeAccidentLocation.title,
          description: accidentLocation.homeAccidentLocation.description,
          condition: (formValue) => isHomeActivitiesAccident(formValue),
          children: [
            buildTextField({
              id: 'homeAccident.address',
              title: accidentLocation.homeAccidentLocation.address,
              backgroundColor: 'blue',
              required: true,
              maxLength: 100,
            }),
            buildTextField({
              id: 'homeAccident.postalCode',
              title: accidentLocation.homeAccidentLocation.postalCode,
              backgroundColor: 'blue',
              width: 'half',
              format: '###',
              required: true,
            }),
            buildTextField({
              id: 'homeAccident.community',
              title: accidentLocation.homeAccidentLocation.community,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              maxLength: 100,
            }),
            buildTextField({
              id: 'homeAccident.moreDetails',
              title: accidentLocation.homeAccidentLocation.moreDetails,
              placeholder:
                accidentLocation.homeAccidentLocation.moreDetailsPlaceholder,
              backgroundColor: 'blue',
              rows: 4,
              variant: 'textarea',
              maxLength: 2000,
            }),
          ],
        }),
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
                  value: GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE,
                  label: accidentLocation.generalWorkAccident.atTheWorkplace,
                },
                {
                  value:
                    GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
                  label:
                    accidentLocation.generalWorkAccident.toOrFromTheWorkplace,
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
                  value: RescueWorkAccidentLocationEnum.DURINGRESCUE,
                  label: accidentLocation.rescueWorkAccident.duringRescue,
                },
                {
                  value: RescueWorkAccidentLocationEnum.TOORFROMRESCUE,
                  label: accidentLocation.rescueWorkAccident.toOrFromRescue,
                },
                {
                  value: RescueWorkAccidentLocationEnum.OTHER,
                  label: accidentLocation.rescueWorkAccident.other,
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
          condition: (formValue) =>
            isStudiesAccident(formValue) &&
            !isInternshipStudiesAccident(formValue),
          children: [
            buildRadioField({
              id: 'accidentLocation.answer',
              title: '',
              options: [
                {
                  value: StudiesAccidentLocationEnum.ATTHESCHOOL,
                  label: accidentLocation.studiesAccidentLocation.atTheSchool,
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
          condition: (formValue) => isProfessionalAthleteAccident(formValue),
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
          condition: (formValue) => isAgricultureAccident(formValue),
          children: [
            buildRadioField({
              id: 'accidentLocation.answer',
              title: '',
              options: [
                {
                  value: AgricultureAccidentLocationEnum.ATTHEWORKPLACE,
                  label: accidentLocation.agricultureAccident.atTheWorkplace,
                },
                {
                  value: AgricultureAccidentLocationEnum.TOORFROMTHEWORKPLACE,
                  label:
                    accidentLocation.agricultureAccident.toOrFromTheWorkplace,
                },
                {
                  value: AgricultureAccidentLocationEnum.OTHER,
                  label: accidentLocation.agricultureAccident.other,
                },
              ],
            }),
          ],
        }),
        // Fisherman information only applicable to fisherman workplace accidents
        buildMultiField({
          id: 'shipLocation.multifield',
          title: accidentLocation.fishermanAccidentLocation.heading,
          description: accidentLocation.fishermanAccidentLocation.description,
          condition: (formValue) => isFishermanAccident(formValue),
          children: [
            buildRadioField({
              id: 'shipLocation.answer',
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
                  label: accidentLocation.fishermanAccidentLocation.inTheHarbor,
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
          id: 'locationAndPurpose',
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
              maxLength: 2000,
            }),
          ],
        }),
      ],
    }),
    // Workmachine information only applicable to generic workplace accidents
    buildSubSection({
      id: 'workMachine.section',
      title: workMachine.general.sectionTitle,
      condition: (formValue) =>
        isGeneralWorkplaceAccident(formValue) ||
        isAgricultureAccident(formValue),
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
              required: true,
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'workMachine.description',
          title: workMachine.general.subSectionTitle,
          condition: (formValue) => formValue.workMachineRadio === YES,
          children: [
            buildTextField({
              id: 'workMachine.desriptionOfMachine',
              title: workMachine.labels.desriptionOfMachine,
              placeholder: workMachine.placeholder.desriptionOfMachine,
              backgroundColor: 'blue',
              rows: 4,
              variant: 'textarea',
              required: true,
              maxLength: 2000,
            }),
          ],
        }),
      ],
    }),
    // Details of the accident
    buildSubSection({
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
              required: true,
              width: 'half',
              format: '##:##',
            }),
            buildAlertMessageField({
              id: 'accidentDetails.notHealthInsuredAlertMessage',
              title: accidentDetails.general.insuranceAlertTitle,
              message: accidentDetails.general.insuranceAlertText,
              width: 'full',
              alertType: 'warning',
              condition: (formValue) => !isHealthInsured(formValue),
              marginBottom: 0,
            }),
            buildTextField({
              id: 'accidentDetails.descriptionOfAccident',
              title: accidentDetails.labels.description,
              placeholder: accidentDetails.placeholder.description,
              backgroundColor: 'blue',
              required: true,
              rows: 10,
              variant: 'textarea',
              maxLength: 2000,
            }),
          ],
        }),
      ],
    }),

    // Injury Certificate and Fatal accident section
    buildSubSection({
      id: 'attachments.section',
      title: attachments.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'attachments',
          title: attachments.general.heading,
          children: [
            buildRadioField({
              id: 'injuryCertificate.answer',
              title: '',
              description: attachments.general.description,
              required: true,
              options: (application) =>
                isRepresentativeOfCompanyOrInstitute(application.answers)
                  ? [
                      {
                        value: AttachmentsEnum.INJURYCERTIFICATE,
                        label: attachments.labels.injuryCertificate,
                      },
                      {
                        value: AttachmentsEnum.SENDCERTIFICATELATER,
                        label: attachments.labels.sendCertificateLater,
                      },
                    ]
                  : [
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
            buildAlertMessageField({
              id: 'attachments.injuryCertificate.alert',
              title: attachments.labels.alertMessage,
              message: attachments.general.alertMessage,
              doesNotRequireAnswer: true,
              condition: (formValue) =>
                getValueViaPath(formValue, 'injuryCertificate.answer') ===
                AttachmentsEnum.SENDCERTIFICATELATER,
              alertType: 'warning',
            }),
          ],
        }),
        buildMultiField({
          id: 'attachments.injuryCertificateFile.subSection',
          title: attachments.general.heading,
          children: [
            buildFileUploadField({
              id: 'attachments.injuryCertificateFile.file',
              title: attachments.general.heading,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText: error.attachmentMaxSizeError,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: injuredPersonInformation.upload.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
          condition: (formValue) =>
            getValueViaPath(formValue, 'injuryCertificate.answer') ===
            AttachmentsEnum.INJURYCERTIFICATE,
        }),
        buildMultiField({
          id: 'fatalAccidentMulti.section',
          title: fatalAccident.general.sectionTitle,
          condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
          children: [
            buildRadioField({
              id: 'wasTheAccidentFatal',
              title: '',
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'fatalAccidentUploadDeathCertificateNowMulti',
          title: fatalAccidentAttachment.labels.title,
          description: fatalAccidentAttachment.labels.description,
          condition: (formValue) =>
            isReportingOnBehalfOfInjured(formValue) &&
            formValue.wasTheAccidentFatal === YES,
          children: [
            buildRadioField({
              id: 'fatalAccidentUploadDeathCertificateNow',
              title: '',
              backgroundColor: 'blue',
              required: true,
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
            buildAlertMessageField({
              id: 'attachments.injuryCertificate.alert',
              title: fatalAccident.alertMessage.title,
              message: fatalAccident.alertMessage.description,
              doesNotRequireAnswer: true,
              alertType: 'warning',
              condition: (formValue) =>
                getValueViaPath(
                  formValue,
                  'fatalAccidentUploadDeathCertificateNow',
                ) === NO,
            }),
          ],
        }),

        buildMultiField({
          id: 'attachments.deathCertificateFile.subSection',
          title: attachments.general.uploadTitle,
          condition: (formValue) =>
            isReportingOnBehalfOfInjured(formValue) &&
            isFatalAccident(formValue) &&
            formValue.fatalAccidentUploadDeathCertificateNow === YES,
          children: [
            buildFileUploadField({
              id: 'attachments.deathCertificateFile.file',
              title: attachments.general.uploadHeader,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText: error.attachmentMaxSizeError,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: attachments.general.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
        }),
        buildMultiField({
          id: 'attachments.additionalFilesMulti',
          title: attachments.general.heading,
          children: [
            buildRadioField({
              id: 'additionalAttachments.answer',
              title: '',
              description: attachments.general.additionalAttachmentDescription,
              required: true,
              options: () => [
                {
                  value: AttachmentsEnum.ADDITIONALNOW,
                  label: attachments.labels.additionalNow,
                },
                {
                  value: AttachmentsEnum.ADDITIONALLATER,
                  label: attachments.labels.additionalLater,
                },
              ],
            }),
            buildAlertMessageField({
              id: 'attachments.injuryCertificate.alert',
              title: attachments.labels.alertMessage,
              message: attachments.general.alertMessage,
              alertType: 'warning',
              doesNotRequireAnswer: true,
              condition: (formValue) =>
                getValueViaPath(formValue, 'additionalAttachments.answer') ===
                AttachmentsEnum.ADDITIONALLATER,
            }),
          ],
        }),
        buildMultiField({
          id: 'attachments.additionalAttachments.subSection',
          title: attachments.general.heading,
          condition: (formValue) =>
            getValueViaPath(formValue, 'additionalAttachments.answer') ===
            AttachmentsEnum.ADDITIONALNOW,
          children: [
            buildFileUploadField({
              id: 'attachments.additionalFiles.file',
              title: attachments.general.heading,
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText: error.attachmentMaxSizeError,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: addDocuments.general.uploadHeader,
              uploadDescription: addDocuments.general.uploadDescription,
              uploadButtonLabel: addDocuments.general.uploadButtonLabel,
              introduction: addDocuments.general.additionalDocumentsDescription,
            }),
          ],
        }),
      ],
    }),

    // Company information if work accident without the injured being a fisherman or in agriculture
    buildSubSection({
      id: 'companyInfo.subSection',
      title: companyInfo.general.title,
      condition: (formValue) =>
        !isAgricultureAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue) &&
        !isHomeActivitiesAccident(formValue) &&
        (isGeneralWorkplaceAccident(formValue) ||
          isInternshipStudiesAccident(formValue)),
      children: [
        buildMultiField({
          id: 'companyInfo',
          title: companyInfo.general.title,
          description: companyInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.name',
              title: companyInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
            }),
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: companyInfo.labels.nationalId,
              backgroundColor: 'blue',
              width: 'half',
              format: '######-####',
              required: true,
            }),
            // buildCheckboxField({
            //   id: 'isRepresentativeOfCompanyOrInstitue',
            //   title: '',
            //   defaultValue: [],
            //   large: false,
            //   backgroundColor: 'white',
            //   options: [
            //     {
            //       value: YES,
            //       label: companyInfo.labels.checkBox,
            //     },
            //   ],
            // }),
            buildDescriptionField({
              id: 'companyInfo.descriptionField',
              description: companyInfo.labels.subDescription,
              space: 'containerGutter',
              titleVariant: 'h5',
              title: companyInfo.labels.descriptionField,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),

            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'representative.name',
              title: representativeInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.nationalId',
              title: representativeInfo.labels.nationalId,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              format: '######-####',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.email',
              title: representativeInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              required: true,
              maxLength: 100,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.phoneNumber',
              title: representativeInfo.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              variant: 'tel',
              width: 'half',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'representativeInfo.custom',
                title: '',
                doesNotRequireAnswer: true,
                component: 'HiddenInformation',
              },
              {
                id: 'representativeInfo',
              },
            ),
          ],
        }),
      ],
    }),
    // School information if school accident
    buildSubSection({
      id: 'schoolInfo.subSection',
      title: schoolInfo.general.title,
      condition: (formValue) =>
        isStudiesAccident(formValue) &&
        !isInternshipStudiesAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          id: 'schoolInfo',
          title: schoolInfo.general.title,
          description: schoolInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.name',
              title: schoolInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
            }),
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: schoolInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
              width: 'half',
            }),
            // buildCheckboxField({
            //   id: 'isRepresentativeOfCompanyOrInstitue',
            //   title: '',
            //   defaultValue: [],
            //   large: false,
            //   backgroundColor: 'white',
            //   options: [
            //     {
            //       value: YES,
            //       label: schoolInfo.labels.checkBox,
            //     },
            //   ],
            // }),
            buildDescriptionField({
              id: 'schoolInfo.descriptionField',
              description: schoolInfo.labels.subDescription,
              space: 'containerGutter',
              titleVariant: 'h5',
              title: schoolInfo.labels.descriptionField,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'representative.name',
              title: representativeInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.nationalId',
              title: representativeInfo.labels.nationalId,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              format: '######-####',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.email',
              title: representativeInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              maxLength: 100,
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.phoneNumber',
              title: representativeInfo.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              variant: 'tel',
              width: 'half',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'schoolInfo.custom',
                title: '',
                doesNotRequireAnswer: true,
                component: 'HiddenInformation',
              },
              {
                id: 'representativeInfo',
              },
            ),
          ],
        }),
      ],
    }),
    // fishery information if fisherman
    buildSubSection({
      id: 'fishingCompanyInfo.subSection',
      title: (application) =>
        isReportingOnBehalfOfEmployee(application.answers)
          ? fishingCompanyInfo.general.informationAboutShipTitle
          : fishingCompanyInfo.general.title,
      condition: (formValue) => isFishermanAccident(formValue),
      children: [
        buildMultiField({
          id: 'fishingShipInfo',
          title: fishingCompanyInfo.general.informationAboutShipTitle,
          description:
            fishingCompanyInfo.general.informationAboutShipDescription,
          children: [
            buildTextField({
              id: 'fishingShipInfo.shipName',
              title: fishingCompanyInfo.labels.shipName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              maxLength: 100,
            }),
            buildTextField({
              id: 'fishingShipInfo.shipCharacters',
              title: fishingCompanyInfo.labels.shipCharacters,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              maxLength: 100,
            }),
            buildTextField({
              id: 'fishingShipInfo.homePort',
              title: fishingCompanyInfo.labels.homePort,
              backgroundColor: 'blue',
              width: 'half',
              maxLength: 100,
            }),
            buildTextField({
              id: 'fishingShipInfo.shipRegisterNumber',
              title: fishingCompanyInfo.labels.shipRegisterNumber,
              backgroundColor: 'blue',
              width: 'half',
              maxLength: 100,
            }),
          ],
        }),
        buildMultiField({
          id: 'fishingCompanyInfo',
          title: fishingCompanyInfo.general.title,
          description: fishingCompanyInfo.general.description,
          condition: (formValue) => !isReportingOnBehalfOfEmployee(formValue),
          children: [
            buildTextField({
              id: 'companyInfo.name',
              title: fishingCompanyInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
            }),
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: fishingCompanyInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
              width: 'half',
            }),
            // buildCheckboxField({
            //   id: 'isRepresentativeOfCompanyOrInstitue',
            //   title: '',
            //   defaultValue: [],
            //   large: false,
            //   backgroundColor: 'white',
            //   options: [
            //     {
            //       value: YES,
            //       label: fishingCompanyInfo.labels.checkBox,
            //     },
            //   ],
            // }),
            buildDescriptionField({
              id: 'fishingCompanyInfo.descriptionField',
              description: fishingCompanyInfo.labels.subDescription,
              space: 'containerGutter',
              titleVariant: 'h5',
              title: fishingCompanyInfo.labels.descriptionField,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'representative.name',
              title: representativeInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.nationalId',
              title: representativeInfo.labels.nationalId,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              format: '######-####',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.email',
              title: representativeInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              maxLength: 100,
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.phoneNumber',
              title: representativeInfo.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              variant: 'tel',
              width: 'half',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'representativeInfo.custom',
                title: '',
                doesNotRequireAnswer: true,
                component: 'HiddenInformation',
              },
              {
                id: 'representativeInfo',
              },
            ),
          ],
        }),
      ],
    }),
    // Sports club information when the injured has a sports related accident
    buildSubSection({
      id: 'sportsClubInfo.subSection',
      title: sportsClubInfo.general.title,
      condition: (formValue) =>
        isProfessionalAthleteAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          id: 'sportsClubInfo',
          title: sportsClubInfo.general.title,
          description: sportsClubInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.name',
              title: sportsClubInfo.labels.name,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              maxLength: 100,
            }),
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: sportsClubInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
              width: 'half',
            }),
            // buildCheckboxField({
            //   id: 'isRepresentativeOfCompanyOrInstitue',
            //   title: '',
            //   defaultValue: [],
            //   large: false,
            //   backgroundColor: 'white',
            //   options: [
            //     {
            //       value: YES,
            //       label: sportsClubInfo.labels.checkBox,
            //     },
            //   ],
            // }),
            buildDescriptionField({
              id: 'sportsClubInfo.descriptionField',
              description: sportsClubInfo.labels.subDescription,
              space: 'containerGutter',
              titleVariant: 'h5',
              title: sportsClubInfo.labels.descriptionField,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'representative.name',
              title: representativeInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.nationalId',
              title: representativeInfo.labels.nationalId,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              format: '######-####',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.email',
              title: representativeInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              maxLength: 100,
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.phoneNumber',
              title: representativeInfo.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              variant: 'tel',
              width: 'half',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'representativeInfo.custom',
                title: '',
                doesNotRequireAnswer: true,
                component: 'HiddenInformation',
              },
              {
                id: 'representativeInfo',
              },
            ),
          ],
        }),
      ],
    }),
    // Rescue squad information when accident is related to rescue squad
    buildSubSection({
      id: 'rescueSquadInfo.subSection',
      title: rescueSquadInfo.general.title,
      condition: (formValue) =>
        isRescueWorkAccident(formValue) &&
        !isReportingOnBehalfOfEmployee(formValue),
      children: [
        buildMultiField({
          id: 'rescueSquad',
          title: rescueSquadInfo.general.title,
          description: rescueSquadInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.name',
              title: rescueSquadInfo.labels.name,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              maxLength: 100,
            }),
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: rescueSquadInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
              width: 'half',
            }),
            // buildCheckboxField({
            //   id: 'isRepresentativeOfCompanyOrInstitue',
            //   title: '',
            //   defaultValue: [],
            //   large: false,
            //   backgroundColor: 'white',
            //   options: [
            //     {
            //       value: YES,
            //       label: rescueSquadInfo.labels.checkBox,
            //     },
            //   ],
            // }),
            buildDescriptionField({
              id: 'rescueSquadInfo.descriptionField',
              description: rescueSquadInfo.labels.subDescription,
              space: 'containerGutter',
              titleVariant: 'h5',
              title: rescueSquadInfo.labels.descriptionField,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.name',
              title: representativeInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              maxLength: 100,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.nationalId',
              title: representativeInfo.labels.nationalId,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              format: '######-####',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.email',
              title: representativeInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              maxLength: 100,
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'representative.phoneNumber',
              title: representativeInfo.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              variant: 'tel',
              width: 'half',
              doesNotRequireAnswer: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'representativeInfo.custom',
                title: '',
                doesNotRequireAnswer: true,
                component: 'HiddenInformation',
              },
              {
                id: 'representativeInfo',
              },
            ),
          ],
        }),
      ],
    }),
  ],
})
