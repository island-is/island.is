import {
  AttachmentItem,
  ExternalData,
  FormText,
  StaticText,
} from '@island.is/application/types'
import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { KeyValueItem } from '@island.is/application/types'
import { exemptionPeriod, location, overview } from '../../lib/messages'
import {
  formatDateStr,
  formatNumberWithMeters,
  formatNumberWithTons,
} from './format'
import { shouldShowResponsiblePerson } from './shouldShowResponsiblePerson'
import { isSameAsApplicant } from './isSameAsApplicant'
import {
  checkIfExemptionTypeLongTerm,
  checkIfExemptionTypeShortTerm,
} from './getExemptionType'
import {
  checkHasDolly,
  checkHasDoubleDolly,
  checkHasSingleDolly,
  getConvoyItem,
  getConvoyItems,
  getConvoyShortName,
} from './convoyUtils'
import {
  getAllConvoyTrailersForSpacing,
  getAllConvoyVehiclesForSpacing,
  getConvoyVehicleSpacing,
  getDollyAxleSpacing,
  getTrailerAxleSpacing,
  getVehicleAxleSpacing,
} from './spacingUtils'
import { ExemptionFor } from '../../shared'
import {
  checkHasSelectedConvoyInFreightPairing,
  getFreightItem,
  getFreightPairingItem,
  getFilteredFreightPairingItems,
  getFreightPairingItems,
} from './freightUtils'
import { format as formatKennitala } from 'kennitala'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'

export const getUserInformationOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const getApplicant = (includeAddress: boolean) => [
    getValueViaPath<string>(externalData, 'nationalRegistry.data.fullName'),
    formatKennitala(
      getValueViaPath<string>(
        externalData,
        'nationalRegistry.data.nationalId',
      ) || '',
    ),
    ...(includeAddress
      ? [
          `${getValueViaPath<string>(
            externalData,
            'nationalRegistry.data.address.streetAddress',
          )}, ${
            getValueViaPath<string>(
              externalData,
              'nationalRegistry.data.address.postalCode',
            ) ?? ''
          } ${
            getValueViaPath<string>(
              externalData,
              'nationalRegistry.data.address.locality',
            ) ?? ''
          }`,
        ]
      : []),
    formatPhoneNumber(
      removeCountryCode(
        getValueViaPath<string>(answers, 'applicant.phoneNumber') || '',
      ),
    ),
    getValueViaPath<string>(answers, 'applicant.email'),
  ]

  const transporter = [
    getValueViaPath<string>(answers, 'transporter.name'),
    formatKennitala(
      getValueViaPath<string>(answers, 'transporter.nationalId') || '',
    ),
    `${getValueViaPath<string>(
      answers,
      'transporter.address',
    )}, ${getValueViaPath<string>(answers, 'transporter.postalCodeAndCity')}`,
    formatPhoneNumber(
      removeCountryCode(
        getValueViaPath<string>(answers, 'transporter.phone') || '',
      ),
    ),
    getValueViaPath<string>(answers, 'transporter.email'),
  ]

  const responsiblePerson = [
    getValueViaPath<string>(answers, 'responsiblePerson.name'),
    formatKennitala(
      getValueViaPath<string>(answers, 'responsiblePerson.nationalId') || '',
    ),
    formatPhoneNumber(
      removeCountryCode(
        getValueViaPath<string>(answers, 'responsiblePerson.phone') || '',
      ),
    ),
    getValueViaPath<string>(answers, 'responsiblePerson.email'),
  ]

  return [
    {
      width: 'half',
      keyText: overview.userInformation.applicantSubtitle,
      valueText: getApplicant(false),
    },
    {
      width: 'half',
      keyText: overview.userInformation.transporterSubtitle,
      valueText: isSameAsApplicant(answers, 'transporter')
        ? getApplicant(true)
        : transporter,
    },
    {
      width: 'half',
      keyText: overview.userInformation.responsiblePersonSubtitle,
      valueText: shouldShowResponsiblePerson(answers)
        ? isSameAsApplicant(answers, 'responsiblePerson')
          ? getApplicant(false)
          : responsiblePerson
        : '',
      hideIfEmpty: true,
    },
  ]
}

export const getExemptionPeriodOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: [
        overview.exemptionPeriod.type,
        overview.exemptionPeriod.dateFrom,
        overview.exemptionPeriod.dateTo,
      ],
      inlineKeyText: true,
      valueText: [
        checkIfExemptionTypeShortTerm(answers)
          ? exemptionPeriod.type.shortTermOptionTitle
          : exemptionPeriod.type.longTermOptionTitle,
        formatDateStr(
          getValueViaPath<string>(answers, 'exemptionPeriod.dateFrom'),
        ),
        formatDateStr(
          getValueViaPath<string>(answers, 'exemptionPeriod.dateTo'),
        ),
      ],
    },
  ]
}

export const getShortTermLocationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: [
        overview.shortTermlocation.from,
        overview.shortTermlocation.to,
        overview.shortTermlocation.directions,
      ],
      inlineKeyText: true,
      valueText: [
        `${getValueViaPath<string>(
          answers,
          'location.shortTerm.addressFrom',
        )}, ${getValueViaPath<string>(
          answers,
          'location.shortTerm.postalCodeAndCityFrom',
        )}`,
        `${getValueViaPath<string>(
          answers,
          'location.shortTerm.addressTo',
        )}, ${getValueViaPath<string>(
          answers,
          'location.shortTerm.postalCodeAndCityTo',
        )}`,
        getValueViaPath<string>(answers, 'location.shortTerm.directions'),
      ],
    },
  ]
}

export const getLongTermLocationOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const regions = getValueViaPath<string[]>(
    answers,
    'location.longTerm.regions',
  )?.map((key) => getValueViaPath<FormText[]>(location.regionOptions, key))
  const directions = getValueViaPath<string>(
    answers,
    'location.longTerm.directions',
  )

  return [
    {
      width: 'full',
      keyText: [
        regions ? overview.longTermlocation.regions : '',
        directions ? overview.longTermlocation.directions : '',
      ].filter((x) => !!x),
      inlineKeyText: true,
      valueText: [regions, directions].filter((x) => !!x),
    },
  ]
}

const getFileType = (fileName: string): string | undefined => {
  return fileName.split('.').pop()?.toUpperCase()
}

export const getLongTermLocationOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<{ name: string; key: string }[]>(
    answers,
    'location.longTerm.files',
  )

  return (
    files?.map((file) => ({
      width: 'full',
      fileName: file.name,
      fileType: getFileType(file.name),
    })) || []
  )
}

export const getConvoyOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const isLongTerm = checkIfExemptionTypeLongTerm(answers)
  const convoyItems = getConvoyItems(answers)

  return convoyItems.map((convoyItem, idx) => ({
    width: 'half',
    keyText: isLongTerm
      ? { ...overview.convoy.label, values: { convoyNumber: idx + 1 } }
      : undefined,
    valueText: [
      {
        ...overview.convoy.vehicleLabel,
        values: { permno: convoyItem.vehicle.permno },
      },
      checkHasSingleDolly(answers) ? [overview.convoy.dollySingleLabel] : [],
      checkHasDoubleDolly(answers) ? [overview.convoy.dollyDoubleLabel] : [],
      ...(convoyItem.trailer?.permno
        ? [
            {
              ...overview.convoy.trailerLabel,
              values: { permno: convoyItem.trailer.permno },
            },
          ]
        : []),
    ],
  }))
}

export const getFreightOverviewShortTermItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const freightIndex = 0
  const convoyIndex = 0
  const freightItem = getFreightItem(answers, freightIndex)
  const pairingItem = getFreightPairingItem(answers, freightIndex, convoyIndex)

  return [
    {
      width: 'full',
      valueText: [
        {
          ...overview.freight.freightNameLabel,
          values: {
            freightName: freightItem?.name,
          },
        },
        {
          ...overview.freight.lengthLabel,
          values: {
            length: formatNumberWithMeters(freightItem?.length),
          },
        },
        {
          ...overview.freight.weightLabel,
          values: {
            weight: formatNumberWithTons(freightItem?.weight),
          },
        },
        {
          ...overview.freight.heightLabel,
          values: {
            height: formatNumberWithMeters(pairingItem?.height),
          },
        },
        {
          ...overview.freight.widthLabel,
          values: {
            width: formatNumberWithMeters(pairingItem?.width),
          },
        },
        {
          ...overview.freight.totalLengthLabel,
          values: {
            totalLength: formatNumberWithMeters(pairingItem?.totalLength),
          },
        },
        ...(pairingItem?.exemptionFor?.includes(ExemptionFor.WIDTH)
          ? [overview.freight.exemptionForWidthLabel]
          : []),
        ...(pairingItem?.exemptionFor?.includes(ExemptionFor.HEIGHT)
          ? [overview.freight.exemptionForHeightLabel]
          : []),
        ...(pairingItem?.exemptionFor?.includes(ExemptionFor.LENGTH)
          ? [overview.freight.exemptionForLengthLabel]
          : []),
        ...(pairingItem?.exemptionFor?.includes(ExemptionFor.WEIGHT)
          ? [overview.freight.exemptionForWeightLabel]
          : []),
      ],
    },
  ]
}

export const getFreightOverviewLongTermItems = (
  answers: FormValue,
  _externalData: ExternalData,
  freightIndex: number,
): Array<KeyValueItem> => {
  const pairingItems = getFreightPairingItems(answers, freightIndex)
  return [
    ...pairingItems
      .map((pairingItem, convoyIndex) => {
        if (!pairingItem) return {}

        const convoyItem = getConvoyItem(answers, convoyIndex)
        if (!convoyItem) return {}

        const convoyIsSelected = checkHasSelectedConvoyInFreightPairing(
          answers,
          freightIndex,
          convoyIndex,
        )
        if (!convoyIsSelected) return {}

        const convoyWithPairing: KeyValueItem = {
          width: 'full',
          keyText: {
            ...overview.freight.convoyLabel,
            values: {
              convoyNumber: convoyIndex + 1,
              vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
            },
          },
          valueText: [
            {
              ...overview.freight.heightLabel,
              values: {
                height: formatNumberWithMeters(pairingItem.height),
              },
            },
            {
              ...overview.freight.widthLabel,
              values: {
                width: formatNumberWithMeters(pairingItem.width),
              },
            },
            {
              ...overview.freight.totalLengthLabel,
              values: {
                totalLength: formatNumberWithMeters(pairingItem.totalLength),
              },
            },
            ...(pairingItem.exemptionFor.includes(ExemptionFor.WIDTH)
              ? [overview.freight.exemptionForWidthLabel]
              : []),
            ...(pairingItem.exemptionFor.includes(ExemptionFor.HEIGHT)
              ? [overview.freight.exemptionForHeightLabel]
              : []),
            ...(pairingItem.exemptionFor.includes(ExemptionFor.LENGTH)
              ? [overview.freight.exemptionForLengthLabel]
              : []),
            ...(pairingItem.exemptionFor.includes(ExemptionFor.WEIGHT)
              ? [overview.freight.exemptionForWeightLabel]
              : []),
          ],
        }
        return convoyWithPairing
      })
      .filter((obj) => Object.keys(obj).length > 0),
  ]
}

export const getAxleSpacingOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const vehicles = getAllConvoyVehiclesForSpacing(answers)
  const trailers = getAllConvoyTrailersForSpacing(answers)
  const hasDoubleDolly = checkHasDoubleDolly(answers)

  return [
    {
      width: 'full',
      valueText: [
        ...vehicles.map((vehicle) => ({
          ...overview.axleSpacing.vehicleLabel,
          values: {
            permno: vehicle.permno,
            axleCount: vehicle.numberOfAxles,
            axleSpacingList: getVehicleAxleSpacing(answers, vehicle.permno)
              .map((x) => formatNumberWithMeters(x))
              .join(', '),
          },
        })),
        ...(hasDoubleDolly
          ? [
              {
                ...overview.axleSpacing.dollyLabel,
                values: {
                  axleSpacingList: getDollyAxleSpacing(answers)
                    .map((x) => formatNumberWithMeters(x))
                    .join(', '),
                },
              },
            ]
          : []),
        ...trailers.map((trailer) => ({
          ...overview.axleSpacing.trailerLabel,
          values: {
            permno: trailer.permno,
            axleCount: trailer.numberOfAxles,
            axleSpacingList: getTrailerAxleSpacing(answers, trailer.permno)
              .map((x) => formatNumberWithMeters(x))
              .join(', '),
          },
        })),
      ],
    },
  ]
}

export const getVehicleSpacingOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const isShortTerm = checkIfExemptionTypeShortTerm(answers)
  const convoyItems = getConvoyItems(answers)
  return [
    {
      width: 'full',
      valueText: convoyItems
        .flatMap((convoyItem, idx) => {
          if (!convoyItem.trailer?.permno) return null

          const vehicleSpacingList = getConvoyVehicleSpacing(
            answers,
            convoyItem.convoyId,
          )
          if (isShortTerm) {
            if (checkHasDolly(answers)) {
              return [
                {
                  ...overview.vehicleSpacing.shortTermVehicleToDollyLabel,
                  values: {
                    vehicleSpacing: formatNumberWithMeters(
                      vehicleSpacingList[0],
                    ),
                  },
                },
                {
                  ...overview.vehicleSpacing.shortTermDollyToTrailerLabel,
                  values: {
                    vehicleSpacing: formatNumberWithMeters(
                      vehicleSpacingList[1],
                    ),
                  },
                },
              ]
            } else {
              return [
                {
                  ...overview.vehicleSpacing.shortTermVehicleToTrailerLabel,
                  values: {
                    vehicleSpacing: formatNumberWithMeters(
                      vehicleSpacingList[0],
                    ),
                  },
                },
              ]
            }
          } else {
            return [
              {
                ...overview.vehicleSpacing.longTermLabel,
                values: {
                  convoyNumber: idx + 1,
                  vehiclePermno: convoyItem.vehicle.permno,
                  trailerPermno: convoyItem.trailer.permno,
                  vehicleSpacing: formatNumberWithMeters(vehicleSpacingList[0]),
                },
              },
            ]
          }
        })
        .filter(Boolean),
    },
  ]
}

export const getSupportingDocumentsOverviewItems = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  return [
    {
      width: 'full',
      keyText: overview.supportingDocuments.comments,
      valueText: getValueViaPath<string>(
        answers,
        'supportingDocuments.comments',
      ),
      hideIfEmpty: true,
    },
  ]
}

export const getSupportingDocumentsOverviewAttachments = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<{ name: string; key: string }[]>(
    answers,
    'supportingDocuments.files',
  )

  return (
    files?.map((file) => ({
      width: 'full',
      fileName: file.name,
      fileType: getFileType(file.name),
    })) || []
  )
}

export const getOverviewErrorMessage = (
  answers: FormValue,
): StaticText | undefined => {
  // Convoy missing in freight pairing error
  const convoyItems = getConvoyItems(answers)
  const freightPairingAllItems = getFilteredFreightPairingItems(answers)
  for (let idx = 0; idx < convoyItems.length; idx++) {
    const convoyItem = convoyItems[idx]
    const isPaired = freightPairingAllItems.some(
      (x) => x.convoyId === convoyItem.convoyId,
    )
    if (!isPaired) {
      return {
        ...overview.freight.convoyMissingErrorMessage,
        values: {
          convoyNumber: idx + 1,
          vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
        },
      }
    }
  }
}
