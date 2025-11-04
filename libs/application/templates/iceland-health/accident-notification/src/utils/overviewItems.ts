import {
  AttachmentItem,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import kennitala from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { getValueViaPath, YES } from '@island.is/application/core'
import {
  accidentDetails,
  accidentLocation,
  accidentType,
  applicantInformation,
  injuredPersonInformation,
  juridicalPerson,
  overview,
  sportsClubInfo,
  application as applicationMessages,
  fishingCompanyInfo,
  workMachine,
  childInCustody,
  locationAndPurpose,
  fatalAccident,
} from '../lib/messages'
import { AccidentTypeEnum } from './enums'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import is from 'date-fns/locale/is'
import { getAttachmentTitles } from './documentUtils'
import { getWorkplaceData } from './miscUtils'
import {
  isAgricultureAccident,
  isGeneralWorkplaceAccident,
  isMachineRelatedAccident,
  isProfessionalAthleteAccident,
} from './occupationUtils'
import { isWorkAccident } from './accidentUtils'

export const aboutApplicantItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: applicantInformation.labels.name,
      valueText: getValueViaPath(answers, 'applicant.name'),
    },
    {
      width: 'half',
      keyText: applicantInformation.labels.nationalId,
      valueText: kennitala.format(
        getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: applicantInformation.labels.address,
      valueText: getValueViaPath(answers, 'applicant.address'),
    },
    {
      width: 'half',
      keyText: applicantInformation.labels.city,
      valueText: getValueViaPath(answers, 'applicant.city'),
    },
    {
      width: 'half',
      keyText: applicantInformation.labels.email,
      valueText: getValueViaPath(answers, 'applicant.email'),
    },
    {
      width: 'half',
      keyText: applicantInformation.labels.tel,
      valueText: formatPhoneNumber(
        getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
      ),
    },
  ]
}

export const injuredPersonItems = (answers: FormValue): Array<KeyValueItem> => {
  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: injuredPersonInformation.labels.name,
      valueText: getValueViaPath(answers, 'injuredPersonInformation.name'),
    },
    {
      width: 'half',
      keyText: injuredPersonInformation.labels.nationalId,
      valueText: kennitala.format(
        getValueViaPath<string>(
          answers,
          'injuredPersonInformation.nationalId',
        ) ?? '',
      ),
    },
    {
      width: 'half',
      keyText: injuredPersonInformation.labels.email,
      valueText: getValueViaPath(answers, 'injuredPersonInformation.email'),
    },
  ]

  const phoneItem: Array<KeyValueItem> = getValueViaPath(
    answers,
    'injuredPersonInformation.phoneNumber',
  )
    ? [
        {
          width: 'half',
          keyText: injuredPersonInformation.labels.tel,
          valueText: formatPhoneNumber(
            getValueViaPath<string>(
              answers,
              'injuredPersonInformation.phoneNumber',
            ) ?? '',
          ),
        },
      ]
    : []

  return [...baseItems, ...phoneItem]
}

export const childInCustodyItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: childInCustody.labels.name,
      valueText: getValueViaPath(answers, 'childInCustody.name'),
    },
    {
      width: 'half',
      keyText: childInCustody.labels.nationalId,
      valueText: kennitala.format(
        getValueViaPath<string>(answers, 'childInCustody.nationalId') ?? '',
      ),
    },
  ]
}

export const juridicalPersonItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: juridicalPerson.labels.companyName,
      valueText: getValueViaPath(answers, 'juridicalPerson.companyName'),
    },
    {
      width: 'half',
      keyText: juridicalPerson.labels.companyNationalId,
      valueText: kennitala.format(
        getValueViaPath<string>(answers, 'juridicalPerson.companyNationalId') ??
          '',
      ),
    },
  ]
}

export const locationAndPurposeItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: locationAndPurpose.labels.location,
      valueText: getValueViaPath(answers, 'locationAndPurpose.location'),
    },
  ]
}
export const workplaceDataItems = (answers: FormValue): Array<KeyValueItem> => {
  const workplaceData = getWorkplaceData(answers)
  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: workplaceData?.companyInfoMsg.labels.name,
      valueText: workplaceData?.companyInfo.name,
    },
    {
      width: 'half',
      keyText: workplaceData?.companyInfoMsg.labels.nationalId,
      valueText: kennitala.format(
        workplaceData?.companyInfo?.nationalRegistrationId ?? '',
      ),
    },
  ]

  const athleteItems: Array<KeyValueItem> = isProfessionalAthleteAccident(
    answers,
  )
    ? [
        {
          width: 'half',
          keyText: sportsClubInfo.employee.sectionTitle,
          valueText:
            workplaceData?.companyInfo?.onPayRoll?.answer === YES
              ? applicationMessages.general.yesOptionLabel
              : applicationMessages.general.noOptionLabel,
        },
      ]
    : []

  return [...baseItems, ...athleteItems]
}

export const fishingShipInfoItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: fishingCompanyInfo.labels.shipName,
      valueText: getValueViaPath(answers, 'fishingShipInfo.shipName'),
    },
    {
      width: 'half',
      keyText: fishingCompanyInfo.labels.shipCharacters,
      valueText: getValueViaPath(answers, 'fishingShipInfo.shipCharacters'),
    },
    {
      width: 'half',
      keyText: fishingCompanyInfo.labels.homePort,
      valueText: getValueViaPath(answers, 'fishingShipInfo.homePort'),
    },
    {
      width: 'half',
      keyText: fishingCompanyInfo.labels.shipRegisterNumber,
      valueText: getValueViaPath(answers, 'fishingShipInfo.shipRegisterNumber'),
    },
  ]
}

export const representativeItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const workplaceData = getWorkplaceData(answers)
  const baseItems: Array<KeyValueItem> = [
    {
      width: 'half',
      keyText: workplaceData?.companyInfoMsg.labels.name,
      valueText: workplaceData?.representitive.name,
    },
    {
      width: 'half',
      keyText: workplaceData?.companyInfoMsg.labels.nationalId,
      valueText: kennitala.format(
        workplaceData?.representitive.nationalId ?? '',
      ),
    },
    {
      width: 'half',
      keyText: workplaceData?.companyInfoMsg.labels.email,
      valueText: workplaceData?.representitive.email,
    },
  ]

  const phoneItem: Array<KeyValueItem> = workplaceData?.representitive
    .phoneNumber
    ? [
        {
          width: 'half',
          keyText: workplaceData?.companyInfoMsg.labels.tel,
          valueText: formatPhoneNumber(
            workplaceData?.representitive?.phoneNumber ?? '',
          ),
        },
      ]
    : []

  return [...baseItems, ...phoneItem]
}

export const homeAccidentItems = (answers: FormValue): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: accidentLocation.homeAccidentLocation.address,
      valueText: getValueViaPath(answers, 'homeAccident.address'),
    },
    {
      width: 'half',
      keyText: accidentLocation.homeAccidentLocation.postalCode,
      valueText: getValueViaPath(answers, 'homeAccident.postalCode'),
    },
    {
      width: 'half',
      keyText: accidentLocation.homeAccidentLocation.community,
      valueText: getValueViaPath(answers, 'homeAccident.community'),
    },
    {
      width: 'half',
      keyText: accidentLocation.homeAccidentLocation.moreDetails,
      valueText: getValueViaPath(answers, 'homeAccident.moreDetails'),
    },
  ]
}

export const hindrancesItems = (answers: FormValue): Array<KeyValueItem> => {
  const athleteItems: Array<KeyValueItem> = isProfessionalAthleteAccident(
    answers,
  )
    ? [
        {
          width: 'half',
          keyText: sportsClubInfo.employee.title,
          valueText:
            getValueViaPath(answers, 'onPayRoll.answer') === YES
              ? applicationMessages.general.yesOptionLabel
              : applicationMessages.general.noOptionLabel,
        },
      ]
    : []

  const workItems: Array<KeyValueItem> =
    isGeneralWorkplaceAccident(answers) || isAgricultureAccident(answers)
      ? [
          {
            width: 'half',
            keyText: workMachine.general.workMachineRadioTitle,
            valueText:
              getValueViaPath(answers, 'workMachineRadio') === YES
                ? applicationMessages.general.yesOptionLabel
                : applicationMessages.general.noOptionLabel,
          },
        ]
      : []

  return [...athleteItems, ...workItems]
}

export const accidentDescriptionItems = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const selectedAccidentType = getValueViaPath<AccidentTypeEnum>(
    answers,
    'accidentType.radioButton',
  )
  const workAccidentType = getValueViaPath<string>(answers, 'workAccident.type')
  const timeOfAccident =
    getValueViaPath<string>(answers, 'accidentDetails.timeOfAccident') ?? ''
  const dateOfAccident =
    getValueViaPath<string>(answers, 'accidentDetails.dateOfAccident') ?? ''
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  const baseItems: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: overview.labels.accidentType,
      valueText: [
        accidentType.labels[
          selectedAccidentType ?? AccidentTypeEnum.HOMEACTIVITIES
        ],
        answers.wasTheAccidentFatal === YES
          ? fatalAccident.labels.fatalAccident
          : '',
        '',
        isWorkAccident(answers) && workAccidentType
          ? accidentType.workAccidentType[
              workAccidentType as keyof typeof accidentType.workAccidentType
            ]
          : '',
      ],
    },
    {
      width: 'half',
      keyText: accidentDetails.labels.date,
      valueText: date,
    },
    {
      width: 'half',
      keyText: accidentDetails.labels.time,
      valueText: time,
    },
  ]

  const machineItems: Array<KeyValueItem> = isMachineRelatedAccident(answers)
    ? [
        {
          width: 'full',
          keyText: overview.labels.workMachine,
          valueText: getValueViaPath(
            answers,
            'workMachine.descriptionOfMachine',
          ),
        },
      ]
    : []

  const baseItems2: Array<KeyValueItem> = [
    {
      width: 'full',
      keyText: accidentDetails.labels.description,
      valueText: getValueViaPath(
        answers,
        'accidentDetails.descriptionOfAccident',
      ),
    },
    {
      width: 'full',
      keyText: accidentDetails.labels.symptoms,
      valueText: getValueViaPath(answers, 'accidentDetails.accidentSymptoms'),
    },
  ]

  return [...baseItems, ...machineItems, ...baseItems2]
}

export const fileItems = (answers: FormValue): Array<AttachmentItem> => {
  const files = getAttachmentTitles(answers)

  return files.map((file) => ({
    width: 'full',
    fileName: file,
    fileType: 'pdf',
  }))
}
