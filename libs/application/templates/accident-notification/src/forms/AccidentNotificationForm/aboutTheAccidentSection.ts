import {
  buildCheckboxField,
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
import { WorkTypeIllustration } from '../../assets/WorkTypeIllustration'
import { NO, UPLOAD_ACCEPT, YES } from '../../constants'
import {
  accidentDetails,
  accidentLocation,
  accidentType,
  application,
  companyInfo,
  fatalAccident,
  fatalAccidentAttachment,
  fishingCompanyInfo,
  fishingLocationAndPurpose,
  hindrances,
  injuredPersonInformation,
  locationAndPurpose,
  rescueSquadInfo,
  schoolInfo,
  sportsClubInfo,
  workMachine,
} from '../../lib/messages'
import { attachments } from '../../lib/messages/attachments'
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
  isAboardShip,
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isHomeActivitiesAccident,
  isInjuredAndRepresentativeOfCompanyOrInstitute,
  isInternshipStudiesAccident,
  isLocatedOnShipOther,
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

    buildSubSection({
      id: 'accidentType.section',
      title: 'Aðstæður slyss',
      children: [
        buildRadioField({
          id: 'accidentType.radioButton',
          width: 'half',
          title: accidentType.general.heading,
          description: accidentType.general.description,
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
                description: accidentType.warning.agricultureAccidentWarning,
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
      condition: (formValue) => isStudiesAccident(formValue),
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
            }),
            buildTextField({
              id: 'homeAccident.postalCode',
              title: accidentLocation.homeAccidentLocation.postalCode,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'homeAccident.community',
              title: accidentLocation.homeAccidentLocation.community,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'homeAccident.moreDetails',
              title: accidentLocation.homeAccidentLocation.moreDetails,
              placeholder:
                accidentLocation.homeAccidentLocation.moreDetailsPlaceholder,
              backgroundColor: 'blue',
              rows: 4,
              variant: 'textarea',
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
          condition: (formValue) => isAgricultureAccident(formValue),
        }),
        // Fisherman information only applicable to fisherman workplace accidents
        // that happen aboard a ship.
        buildMultiField({
          id: 'fishermanLocation.multifield',
          title: accidentLocation.fishermanAccidentLocation.heading,
          condition: (formValue) => isAboardShip(formValue),

          description: accidentLocation.fishermanAccidentLocation.description,
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
          id: 'fishermanLocation.other',
          title: fishingLocationAndPurpose.general.title,
          description: fishingLocationAndPurpose.general.description,
          condition: (formValue) => isLocatedOnShipOther(formValue),
          children: [
            buildTextField({
              id: 'fishermanLocation.locationAndPurpose.location',
              title: fishingLocationAndPurpose.labels.location,
              backgroundColor: 'blue',
              variant: 'textarea',
              required: true,
              rows: 4,
            }),
          ],
        }),
        buildMultiField({
          id: 'locationAndPurpose',
          title: locationAndPurpose.general.title,
          description: locationAndPurpose.general.description,
          condition: (formValue) =>
            !isFishermanAccident(formValue) &&
            !hideLocationAndPurpose(formValue) &&
            !isHomeActivitiesAccident(formValue),
          children: [
            buildTextField({
              id: 'locationAndPurpose.location',
              title: locationAndPurpose.labels.location,
              backgroundColor: 'blue',
              variant: 'textarea',
              required: true,
              rows: 4,
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
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
            }),
          ],
        }),
        buildMultiField({
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
              required: true,
              rows: 10,
              variant: 'textarea',
            }),
          ],
        }),
      ],
    }),

    // Attachments section files are optional at this point
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
              options: (application) =>
                isRepresentativeOfCompanyOrInstitute(application.answers)
                  ? [
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
        buildFileUploadField({
          id: 'attachments.injuryCertificateFile.file',
          title: attachments.general.heading,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: injuredPersonInformation.upload.uploadHeader,
          uploadDescription: attachments.general.uploadDescription,
          uploadButtonLabel: attachments.general.uploadButtonLabel,
          introduction: attachments.general.uploadIntroduction,
          condition: (formValue) =>
            (formValue as {
              injuryCertificate: { answer: AttachmentsEnum }
            }).injuryCertificate?.answer === AttachmentsEnum.INJURYCERTIFICATE,
        }),
      ],
    }),

    // Fatal accident section
    buildSubSection({
      id: 'fatalAccident.section',
      title: fatalAccidentAttachment.general.sectionTitle,
      condition: (formValue) => isReportingOnBehalfOfInjured(formValue),
      children: [
        buildMultiField({
          id: 'fatalAccidentMulti.section',
          title: fatalAccident.general.sectionTitle,
          children: [
            buildRadioField({
              id: 'wasTheAccidentFatal',
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
        buildMultiField({
          id: 'fatalAccidentUploadDeathCertificateNowMulti',
          title: fatalAccidentAttachment.labels.title,
          description: fatalAccidentAttachment.labels.description,
          condition: (formValue) => formValue.wasTheAccidentFatal === YES,
          children: [
            buildRadioField({
              id: 'fatalAccidentUploadDeathCertificateNow',
              title: '',
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
            buildCustomField(
              {
                id: 'attachments.injuryCertificate.alert',
                title: fatalAccident.alertMessage.title,
                description: fatalAccident.alertMessage.description,
                component: 'FieldAlertMessage',
                condition: (formValue) =>
                  getValueViaPath(
                    formValue,
                    'fatalAccidentUploadDeathCertificateNow',
                  ) === NO,
              },
              { type: 'warning' },
            ),
          ],
        }),

        buildMultiField({
          id: 'attachments.deathCertificateFile.subSection',
          title: attachments.general.uploadTitle,
          children: [
            buildFileUploadField({
              id: 'attachments.deathCertificateFile.file',
              title: attachments.general.uploadHeader,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: attachments.general.uploadHeader,
              uploadDescription: attachments.general.uploadDescription,
              uploadButtonLabel: attachments.general.uploadButtonLabel,
              introduction: attachments.general.uploadIntroduction,
            }),
          ],
          condition: (formValue) =>
            formValue.wasTheAccidentFatal === YES &&
            formValue.fatalAccidentUploadDeathCertificateNow === YES,
        }),
      ],
    }),

    // Company information if work accident without the injured being a fisherman
    buildSubSection({
      id: 'companyInfo.subSection',
      title: companyInfo.general.title,
      condition: (formValue) =>
        (isGeneralWorkplaceAccident(formValue) &&
          !isReportingOnBehalfOfEmployee(formValue)) ||
        (isInternshipStudiesAccident(formValue) &&
          !isReportingOnBehalfOfEmployee(formValue)),
      children: [
        buildMultiField({
          id: 'companyInfo',
          title: companyInfo.general.title,
          description: companyInfo.general.description,
          children: [
            buildTextField({
              id: 'companyInfo.nationalRegistrationId',
              title: companyInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              large: false,
              backgroundColor: 'white',
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
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'companyInfo.name',
              title: companyInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'companyInfo.email',
              title: companyInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'companyInfo.phoneNumber',
              title: companyInfo.labels.tel,
              backgroundColor: 'blue',
              format: '###-####',
              variant: 'tel',
              width: 'half',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'companyInfo.custom',
                title: '',
                component: 'HiddenInformation',
              },
              {
                id: 'companyInfo',
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
              id: 'schoolInfo.nationalRegistrationId',
              title: schoolInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              large: false,
              backgroundColor: 'white',
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
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'schoolInfo.name',
              title: schoolInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'schoolInfo.email',
              title: schoolInfo.labels.email,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'schoolInfo.phoneNumber',
              title: schoolInfo.labels.tel,
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
                component: 'HiddenInformation',
              },
              {
                id: 'schoolInfo',
              },
            ),
          ],
        }),
      ],
    }),
    // fishery information if fisherman
    buildSubSection({
      id: 'fishingCompanyInfo.subSection',
      title: fishingCompanyInfo.general.title,
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
            }),
            buildTextField({
              id: 'fishingShipInfo.shipCharacters',
              title: fishingCompanyInfo.labels.shipCharacters,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'fishingShipInfo.homePort',
              title: fishingCompanyInfo.labels.homePort,
              backgroundColor: 'blue',
              width: 'half',
            }),
            buildTextField({
              id: 'fishingShipInfo.shipRegisterNumber',
              title: fishingCompanyInfo.labels.shipRegisterNumber,
              backgroundColor: 'blue',
              width: 'half',
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
              id: 'fishingCompanyInfo.nationalRegistrationId',
              title: fishingCompanyInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              large: false,
              backgroundColor: 'white',
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
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'fishingCompanyInfo.name',
              title: fishingCompanyInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'fishingCompanyInfo.email',
              title: fishingCompanyInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              variant: 'email',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'fishingCompanyInfo.phoneNumber',
              title: fishingCompanyInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              format: '###-####',
              variant: 'tel',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'fishingCompanyInfo.custom',
                title: '',
                component: 'HiddenInformation',
              },
              {
                id: 'fishingCompanyInfo',
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
              id: 'sportsClubInfo.nationalRegistrationId',
              title: sportsClubInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              large: false,
              backgroundColor: 'white',
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
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            // These should all be required if the user is not the representative of the company.
            // Should look into if we can require conditionally
            buildTextField({
              id: 'sportsClubInfo.name',
              title: sportsClubInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'sportsClubInfo.email',
              title: sportsClubInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              variant: 'email',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'sportsClubInfo.phoneNumber',
              title: sportsClubInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              format: '###-####',
              variant: 'tel',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'sportsClubInfo.custom',
                title: '',
                component: 'HiddenInformation',
              },
              {
                id: 'sportsClubInfo',
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
              id: 'rescueSquadInfo.nationalRegistrationId',
              title: rescueSquadInfo.labels.nationalId,
              backgroundColor: 'blue',
              format: '######-####',
              required: true,
            }),
            buildCheckboxField({
              id: 'isRepresentativeOfCompanyOrInstitue',
              title: '',
              defaultValue: [],
              large: false,
              backgroundColor: 'white',
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
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'rescueSquadInfo.name',
              title: rescueSquadInfo.labels.name,
              backgroundColor: 'blue',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'rescueSquadInfo.email',
              title: rescueSquadInfo.labels.email,
              backgroundColor: 'blue',
              width: 'half',
              variant: 'email',
              required: true,
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildTextField({
              id: 'rescueSquadInfo.phoneNumber',
              title: rescueSquadInfo.labels.tel,
              backgroundColor: 'blue',
              width: 'half',
              format: '###-####',
              variant: 'tel',
              condition: (formValue) =>
                !isInjuredAndRepresentativeOfCompanyOrInstitute(formValue),
            }),
            buildCustomField(
              {
                id: 'rescueSquadInfo.custom',
                title: '',
                component: 'HiddenInformation',
              },
              {
                id: 'rescueSquadInfo',
              },
            ),
          ],
        }),
      ],
    }),
  ],
})
