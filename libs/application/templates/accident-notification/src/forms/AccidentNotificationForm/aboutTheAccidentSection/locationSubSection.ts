import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  accidentLocation,
  application,
  locationAndPurpose,
  sportsClubInfo,
} from '../../../lib/messages'
import {
  hideLocationAndPurpose,
  isAgricultureAccident,
  isFishermanAccident,
  isGeneralWorkplaceAccident,
  isHomeActivitiesAccident,
  isInternshipStudiesAccident,
  isProfessionalAthleteAccident,
  isRescueWorkAccident,
  isStudiesAccident,
} from '../../../utils'
import { NO, YES } from '../../../constants'
import { isSportAccidentAndEmployee } from '../../../utils/isSportAccidentAndEmployee'
import {
  AgricultureAccidentLocationEnum,
  FishermanWorkplaceAccidentLocationEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  ProfessionalAthleteAccidentLocationEnum,
  RescueWorkAccidentLocationEnum,
  StudiesAccidentLocationEnum,
} from '../../../types'

// Location Subsection
export const locationSubSection = buildSubSection({
  id: 'location.subSection',
  title: accidentLocation.general.listTitle,
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
        buildAlertMessageField({
          id: 'attachments.injuryCertificate.alert',
          title: application.labels.warningTitle,
          message: application.labels.warningMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (formValue) => isSportAccidentAndEmployee(formValue),
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
      condition: (formValue) =>
        isGeneralWorkplaceAccident(formValue) ||
        isSportAccidentAndEmployee(formValue),
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
              value: GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE,
              label: accidentLocation.generalWorkAccident.toOrFromTheWorkplace,
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
        isStudiesAccident(formValue) && !isInternshipStudiesAccident(formValue),
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
              label: accidentLocation.fishermanAccident.toOrFromTheWorkplace,
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
        !isSportAccidentAndEmployee(formValue),
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
              label: accidentLocation.agricultureAccident.toOrFromTheWorkplace,
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
              label: accidentLocation.fishermanAccidentLocation.whileSailing,
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
        !isFishermanAccident(formValue) && !hideLocationAndPurpose(formValue),
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
})
