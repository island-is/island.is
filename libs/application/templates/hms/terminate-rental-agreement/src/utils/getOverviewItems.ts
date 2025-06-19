import { AttachmentItem, ExternalData } from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import * as m from '../lib/messages'
import { formatPhoneNumber, getSelectedContract } from './helpers'
import { format as formatNationalId } from 'kennitala'
import { FileType } from '../types'

export const getPersonalInformationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'half',
      keyText: m.overviewMessages.fullName,
      valueText: getValueViaPath<string>(answers, 'applicant.name') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.nationalId,
      valueText: formatNationalId(
        getValueViaPath<string>(answers, 'applicant.nationalId') ?? '',
      ),
    },
    {
      width: 'half',
      keyText: m.overviewMessages.address,
      valueText: 'Hvassaleiti 5',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.city,
      valueText: `${
        getValueViaPath<string>(answers, 'applicant.postalCode') ?? ''
      } ${getValueViaPath<string>(answers, 'applicant.city') ?? ''}`,
    },
    {
      width: 'half',
      keyText: m.overviewMessages.email,
      valueText: getValueViaPath<string>(answers, 'applicant.email') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.phoneNumber,
      valueText:
        formatPhoneNumber(
          getValueViaPath<string>(answers, 'applicant.phoneNumber') ?? '',
        ) ?? '',
    },
  ]
}

export const getRentalAgreementOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const contract = getSelectedContract(answers, externalData)
  return [
    {
      width: 'half',
      keyText: m.overviewMessages.rentalAgreementNumber,
      valueText: getValueViaPath<string>(answers, 'rentalAgreement') ?? '',
    },
    {
      width: 'half',
      keyText: m.overviewMessages.rentalAgreementType,
      valueText: contract?.contractType ?? '',
    },
    {
      width: 'full',
      keyText: m.overviewMessages.address,
      valueText: `${
        contract?.contractProperty?.[0].streetAndHouseNumber ?? ''
      }, ${contract?.contractProperty?.[0].postalCode ?? ''} ${
        contract?.contractProperty?.[0].municipality ?? ''
      }`,
    },
    {
      width: 'half',
      keyText: m.overviewMessages.apartmentNumber,
      valueText: contract?.contractProperty
        ?.map((property) => property.apartment)
        .join(', '),
    },
    {
      width: 'half',
      keyText: m.overviewMessages.floor,
      valueText: contract?.contractProperty
        ?.map((property) => property.floor)
        .filter(Boolean)
        .join(', '),
    },
    {
      width: 'full',
      keyText: m.overviewMessages.contractParty,
      valueText: contract?.contractParty?.map((party) => {
        return `${party.name} - ${formatNationalId(party.kennitala ?? '')} (${
          party.partyTypeName
        })`
      }),
    },
  ]
}

export const getTerminationTypeOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overviewMessages.terminationType,
      valueText:
        getValueViaPath<string>(answers, 'terminationType') === 'dismissal'
          ? m.overviewMessages.terminationTypeDismissal
          : m.overviewMessages.terminationTypeTermination,
    },
  ]
}

export const getCancelationDetailsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overviewMessages.cancelationDate,
      valueText: getValueViaPath<string>(answers, 'cancelationDate') ?? '',
    },
    {
      width: 'full',
      keyText: m.overviewMessages.cancelationReason,
      valueText: getValueViaPath<string>(answers, 'cancelationReason') ?? '',
    },
  ]
}

export const getBoundTerminationOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  console.log('answers: ', answers)
  console.log('externalData: ', externalData)
  return [
    {
      width: 'full',
      keyText: m.overviewMessages.terminationDate,
      valueText: getValueViaPath<string>(answers, 'boundTerminationDate') ?? '',
    },
  ]
}

export const getUnboundTerminationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: m.overviewMessages.terminationDate,
      valueText:
        getValueViaPath<string>(answers, 'unboundTerminationDate') ?? '',
    },
    {
      width: 'full',
      keyText: m.overviewMessages.terminationReason,
      valueText:
        getValueViaPath<string>(answers, 'unboundTerminationReason') ?? '',
    },
  ]
}

export const getFileUploadOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<Array<FileType>>(answers, 'fileUpload')

  return [
    {
      width: 'full',
      fileName: files?.[0].name ?? '',
      fileType: files?.[0].name.split('.').pop(),
    },
  ]
}
