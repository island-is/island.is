import {
  DollyType,
  ExemptionFor,
  ExemptionForTransportationAnswers,
  ExemptionType,
} from '@island.is/application/templates/transport-authority/exemption-for-transportation'
import { CargoAssignment, Person } from './types'
import {
  ExceptionType,
  HaulUnitModel,
  VehicleType,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { isCompany } from 'kennitala'

export const getFirstWord = (fullName: string) => {
  const [firstName] = fullName.split(' ')
  return firstName || ''
}

export const getAllWordsExceptFirst = (fullName: string) => {
  const parts = fullName.split(' ')
  return parts.length > 1 ? parts.slice(1).join(' ') : ''
}

export const mapEnumByValue = <
  FromEnum extends Record<string, string>,
  ToEnum extends Record<string, string>,
>(
  fromEnum: FromEnum,
  toEnum: ToEnum,
  values: (keyof FromEnum)[],
): ToEnum[keyof ToEnum][] => {
  const valueMap = Object.values(fromEnum).reduce<
    Record<string, ToEnum[keyof ToEnum]>
  >((acc, value) => {
    if (Object.values(toEnum).includes(value as ToEnum[keyof ToEnum])) {
      acc[value] = value as ToEnum[keyof ToEnum]
    }
    return acc
  }, {})

  return values
    .map((key) => valueMap[fromEnum[key]])
    .filter((v): v is ToEnum[keyof ToEnum] => v !== undefined)
}

export const getAllFreightForConvoy = (
  freightPairingAnswers: ExemptionForTransportationAnswers['freightPairing'],
  convoyId: string,
): CargoAssignment[] => {
  if (!freightPairingAnswers) return []

  return freightPairingAnswers.flatMap((pairing) => {
    if (!pairing?.items) return []

    const item = pairing.items.find((x) => x?.convoyId === convoyId)
    if (!item) return []

    const exemptionFor = item.exemptionFor || []
    const filteredExemptionFor: ExemptionFor[] = []
    for (let i = 0; i < exemptionFor.length; i++) {
      const val = exemptionFor[i]
      if (val) filteredExemptionFor.push(val)
    }

    return [
      {
        freightId: pairing.freightId,
        height: item.height,
        width: item.width,
        totalLength: item.totalLength,
        exemptionFor: filteredExemptionFor,
      },
    ]
  })
}

export const mapStringToNumber = (strValue: string | undefined): number => {
  const num = Number(strValue)
  return isNaN(num) ? 0 : num
}

export const mapApplicant = (application: Application): Person => {
  const nationalRegistryData = getValueViaPath<NationalRegistryIndividual>(
    application.externalData,
    'nationalRegistry.data',
  )
  const applicantAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['applicant']
  >(application.answers, 'applicant')

  return {
    nationalId: nationalRegistryData?.nationalId || '',
    fullName: nationalRegistryData?.fullName || '',
    address: nationalRegistryData?.address?.streetAddress || '',
    postalCode: nationalRegistryData?.address?.postalCode || '',
    city: nationalRegistryData?.address?.locality || '',
    email: applicantAnswers?.email || '',
    phone: applicantAnswers?.phoneNumber?.slice(-7) || '',
  }
}

export const mapTransporter = (
  application: Application,
  applicant: Person,
): Person => {
  const transporterAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['transporter']
  >(application.answers, 'transporter')

  return transporterAnswers?.isSameAsApplicant
    ? applicant
    : {
        nationalId: transporterAnswers?.nationalId || '',
        fullName: transporterAnswers?.name || '',
        address: transporterAnswers?.address || '',
        postalCode: getFirstWord(transporterAnswers?.postalCodeAndCity || ''),
        city: getAllWordsExceptFirst(
          transporterAnswers?.postalCodeAndCity || '',
        ),
        email: transporterAnswers?.email || '',
        phone: transporterAnswers?.phone?.slice(-7) || '',
      }
}

export const mapResponsiblePerson = (
  application: Application,
  applicant: Person,
  transporter: Person,
): Person | undefined => {
  const responsiblePersonAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['responsiblePerson']
  >(application.answers, 'responsiblePerson')

  return isCompany(transporter.nationalId)
    ? responsiblePersonAnswers?.isSameAsApplicant
      ? applicant
      : {
          nationalId: responsiblePersonAnswers?.nationalId || '',
          fullName: responsiblePersonAnswers?.name || '',
          email: responsiblePersonAnswers?.email || '',
          phone: responsiblePersonAnswers?.phone?.slice(-7) || '',
        }
    : undefined
}

export const mapHaulUnits = (application: Application): HaulUnitModel[] => {
  const convoyAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['convoy']
  >(application.answers, 'convoy')
  const freightPairingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(application.answers, 'freightPairing')
  const axleSpacingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(application.answers, 'axleSpacing')
  const vehicleSpacingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['vehicleSpacing']
  >(application.answers, 'vehicleSpacing')

  return (
    convoyAnswers?.items?.map((item) => {
      const vehicleAxleSpacing = axleSpacingAnswers?.vehicleList.find(
        (x) => x.permno === item.vehicle.permno,
      )
      const trailerAxleSpacing = axleSpacingAnswers?.trailerList.find(
        (x) => x.permno === item.trailer?.permno,
      )
      const vehicleSpacing = vehicleSpacingAnswers?.convoyList?.find(
        (x) => x.convoyId === item.convoyId,
      )

      return {
        // Convoy
        vehicles: [
          {
            permno: item.vehicle.permno,
            vehicleType: VehicleType.CAR,
            // Axle spacing
            axleSpacing: (axleSpacingAnswers?.hasExemptionForWeight
              ? vehicleAxleSpacing?.values || []
              : []
            ).map(mapStringToNumber),
          },
          ...(axleSpacingAnswers?.exemptionPeriodType ===
            ExemptionType.SHORT_TERM &&
          (axleSpacingAnswers?.dolly?.type === DollyType.SINGLE ||
            axleSpacingAnswers?.dolly?.type === DollyType.DOUBLE)
            ? [
                {
                  vehicleType: VehicleType.DOLLY,
                  // Axle spacing
                  axleSpacing: (axleSpacingAnswers?.hasExemptionForWeight &&
                  axleSpacingAnswers?.dolly?.type === DollyType.DOUBLE
                    ? [axleSpacingAnswers.dolly.value]
                    : []
                  ).map(mapStringToNumber),
                },
              ]
            : []),
          ...(item.trailer?.permno
            ? [
                {
                  permno: item.trailer.permno,
                  vehicleType: VehicleType.TRAILER,
                  // Axle spacing
                  axleSpacing: (axleSpacingAnswers?.hasExemptionForWeight
                    ? (trailerAxleSpacing?.useSameValues
                        ? Array((trailerAxleSpacing?.axleCount ?? 0) - 1).fill(
                            trailerAxleSpacing?.singleValue,
                          )
                        : trailerAxleSpacing?.values) || []
                    : []
                  ).map(mapStringToNumber),
                },
              ]
            : []),
        ],
        // Vehicle Spacing
        vehicleSpacing: (vehicleSpacingAnswers?.hasExemptionForWeight &&
        vehicleSpacing?.hasTrailer
          ? vehicleSpacingAnswers?.exemptionPeriodType ===
              ExemptionType.SHORT_TERM &&
            (vehicleSpacing.dollyType === DollyType.SINGLE ||
              vehicleSpacing.dollyType === DollyType.DOUBLE)
            ? [
                vehicleSpacing.vehicleToDollyValue,
                vehicleSpacing.dollyToTrailerValue,
              ]
            : [vehicleSpacing.vehicleToTrailerValue]
          : []
        ).map(mapStringToNumber),
        // Freight pairing
        cargoAssignments: getAllFreightForConvoy(
          freightPairingAnswers || [],
          item.convoyId,
        ).map((item) => ({
          cargoCode: item.freightId,
          height: Number(item.height),
          width: Number(item.width),
          combinedVehicleLength: Number(item.totalLength),
          exceptionFor: mapEnumByValue(
            ExemptionFor,
            ExceptionType,
            item.exemptionFor,
          ),
        })),
      }
    }) || []
  )
}
