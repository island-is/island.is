import {
  DollyType,
  ExemptionFor,
  ExemptionForTransportationAnswers,
  ExemptionType,
  RegionArea,
} from '@island.is/application/templates/transport-authority/exemption-for-transportation'
import { CargoAssignment, Person } from './types'
import {
  Area,
  ExceptionType,
  HaulUnitModel,
  RouteApplicationAddModel,
  VehicleType,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import { getValueViaPath, YES } from '@island.is/application/core'
import {
  Application,
  ApplicationWithAttachments,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { isCompany } from 'kennitala'
import { S3Service } from '@island.is/nest/aws'

export const getAllWordsExceptLast = (fullName: string) => {
  const parts = fullName.trim().split(' ')
  return parts.length > 1 ? parts.slice(0, -1).join(' ') : ''
}

export const getLastWord = (fullName: string) => {
  const parts = fullName.trim().split(' ')
  return parts.at(-1) || ''
}

export const mapEnumByValue = <
  FromEnum extends Record<string, string>,
  ToEnum extends Record<string, string>,
>(
  fromEnum: FromEnum,
  toEnum: ToEnum,
  enumValues: Array<FromEnum[keyof FromEnum]>,
): ToEnum[keyof ToEnum][] => {
  const valueMap = Object.values(fromEnum).reduce<
    Record<string, ToEnum[keyof ToEnum]>
  >((acc, value) => {
    if (Object.values(toEnum).includes(value as ToEnum[keyof ToEnum])) {
      acc[value] = value as ToEnum[keyof ToEnum]
    }
    return acc
  }, {})

  return enumValues
    .map((val) => valueMap[val])
    .filter((v): v is ToEnum[keyof ToEnum] => v !== undefined)
}

export const getAllFreightForConvoy = (
  freightPairingAnswers: ExemptionForTransportationAnswers['freightPairing'],
  convoyId: string,
): CargoAssignment[] => {
  if (!freightPairingAnswers) return []

  return freightPairingAnswers.flatMap((pairing) => {
    if (!pairing?.convoyIdList?.includes(convoyId)) return []

    const item = pairing?.items?.find((x) => x?.convoyId === convoyId)
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
        height: item.height || '',
        width: item.width || '',
        totalLength: item.totalLength || '',
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

  return transporterAnswers?.isSameAsApplicant?.includes(YES)
    ? applicant
    : {
        nationalId: transporterAnswers?.nationalId || '',
        fullName: transporterAnswers?.name || '',
        address: transporterAnswers?.address || '',
        postalCode: transporterAnswers?.postalCodeAndCity?.split(' ')?.[0],
        city: transporterAnswers?.postalCodeAndCity?.split(' ')?.[1],
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
    ? responsiblePersonAnswers?.isSameAsApplicant?.includes(YES)
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
  const exemptionPeriodAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['exemptionPeriod']
  >(application.answers, 'exemptionPeriod')
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

  const isShortTerm = exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM
  const hasExemptionForWeight =
    axleSpacingAnswers?.hasExemptionForWeight ?? false

  return (
    convoyAnswers?.items?.map((item) => {
      const vehicleAxleSpacing = axleSpacingAnswers?.vehicleList.find(
        (x) => x.permno === item.vehicle.permno,
      )
      const trailerAxleSpacing = axleSpacingAnswers?.trailerList?.find(
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
            axleSpacing: (isShortTerm && hasExemptionForWeight
              ? vehicleAxleSpacing?.values || []
              : []
            ).map(mapStringToNumber),
          },
          ...(isShortTerm &&
          item.trailer?.permno &&
          (axleSpacingAnswers?.dolly?.type === DollyType.SINGLE ||
            axleSpacingAnswers?.dolly?.type === DollyType.DOUBLE)
            ? [
                {
                  vehicleType: VehicleType.DOLLY,
                  // Axle spacing
                  axleSpacing: (hasExemptionForWeight &&
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
                  axleSpacing: (isShortTerm && hasExemptionForWeight
                    ? (trailerAxleSpacing?.useSameValues?.includes(YES)
                        ? Array(
                            Math.max(
                              (trailerAxleSpacing?.axleCount ?? 0) - 1,
                              0,
                            ),
                          ).fill(trailerAxleSpacing?.singleValue)
                        : trailerAxleSpacing?.values) || []
                    : []
                  ).map(mapStringToNumber),
                },
              ]
            : []),
        ],
        // Vehicle Spacing
        vehicleSpacing: (isShortTerm &&
        hasExemptionForWeight &&
        vehicleSpacing?.hasTrailer
          ? vehicleSpacing.dollyType === DollyType.SINGLE ||
            vehicleSpacing.dollyType === DollyType.DOUBLE
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
          item.convoyId ?? '',
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

const getAttachmentAsBase64 = async (
  application: ApplicationWithAttachments,
  s3Service: S3Service,
  attachment: {
    key: string
    name: string
  },
): Promise<string> => {
  const attachmentKey = attachment.key

  const fileName = (
    application.attachments as {
      [key: string]: string
    }
  )[attachmentKey]

  if (!fileName) {
    throw new Error(
      `Attachment filename not found in application on attachment key: ${attachmentKey}`,
    )
  }

  try {
    const fileContent = await s3Service.getFileContent(fileName, 'base64')

    if (!fileContent) {
      throw new Error(`File content not found for: ${fileName}`)
    }

    return fileContent
  } catch (error) {
    throw new Error(`Failed to retrieve attachment: ${error.message}`)
  }
}

export const mapApplicationToDto = async (
  application: ApplicationWithAttachments,
  s3Service: S3Service,
): Promise<RouteApplicationAddModel> => {
  // Get answers
  const exemptionPeriodAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['exemptionPeriod']
  >(application.answers, 'exemptionPeriod')
  const locationAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['location']
  >(application.answers, 'location')
  const supportingDocumentsAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['supportingDocuments']
  >(application.answers, 'supportingDocuments')
  const freightAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['freight']
  >(application.answers, 'freight')
  const freightPairingAnswers = getValueViaPath<
    ExemptionForTransportationAnswers['freightPairing']
  >(application.answers, 'freightPairing')

  // Map applicant, transporter + responsible person
  const applicant = mapApplicant(application)
  const transporter = mapTransporter(application, applicant)
  const responsiblePerson = mapResponsiblePerson(
    application,
    applicant,
    transporter,
  )

  // Map files
  const locationFiles =
    exemptionPeriodAnswers?.type === ExemptionType.LONG_TERM
      ? await Promise.all(
          (locationAnswers?.longTerm?.files || []).map(async (file) => {
            return {
              name: file.name,
              content: await getAttachmentAsBase64(
                application,
                s3Service,
                file,
              ),
            }
          }),
        )
      : []
  const supportingDocumentsFiles = await Promise.all(
    (supportingDocumentsAnswers?.files || []).map(async (file) => {
      return {
        name: file.name,
        content: await getAttachmentAsBase64(application, s3Service, file),
      }
    }),
  )

  return {
    externalID: application.id,
    applicant: {
      ssn: applicant.nationalId,
      firstName: getAllWordsExceptLast(applicant.fullName),
      lastName: getLastWord(applicant.fullName),
      email: applicant.email,
      phone: applicant.phone,
    },
    transporter: {
      ssn: transporter.nationalId,
      name: transporter.fullName,
      address: transporter.address,
      postalCode: transporter.postalCode,
      city: transporter.city,
      email: transporter.email,
      phone: transporter.phone,
    },
    guarantor: responsiblePerson
      ? {
          ssn: responsiblePerson.nationalId,
          firstName: getAllWordsExceptLast(responsiblePerson.fullName),
          lastName: getLastWord(responsiblePerson.fullName),
          email: responsiblePerson.email,
          phone: responsiblePerson.phone,
        }
      : undefined,
    dateFrom: new Date(exemptionPeriodAnswers?.dateFrom || ''),
    dateTo: new Date(exemptionPeriodAnswers?.dateTo || ''),
    origin:
      exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM &&
      locationAnswers?.shortTerm?.addressFrom &&
      locationAnswers?.shortTerm?.postalCodeAndCityFrom
        ? `${locationAnswers?.shortTerm?.addressFrom}, ${locationAnswers?.shortTerm?.postalCodeAndCityFrom}`
        : undefined,
    destination:
      exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM &&
      locationAnswers?.shortTerm?.addressTo &&
      locationAnswers?.shortTerm?.postalCodeAndCityTo
        ? `${locationAnswers?.shortTerm?.addressTo}, ${locationAnswers?.shortTerm?.postalCodeAndCityTo}`
        : undefined,
    areas:
      exemptionPeriodAnswers?.type === ExemptionType.LONG_TERM
        ? mapEnumByValue(
            RegionArea,
            Area,
            locationAnswers?.longTerm?.regions || [],
          )
        : undefined,
    desiredRoute:
      exemptionPeriodAnswers?.type === ExemptionType.SHORT_TERM
        ? locationAnswers?.shortTerm?.directions
        : locationAnswers?.longTerm?.directions,
    documents: (exemptionPeriodAnswers?.type === ExemptionType.LONG_TERM
      ? [...locationFiles, ...supportingDocumentsFiles]
      : supportingDocumentsFiles
    ).map((file) => ({
      documentName: file.name,
      documentContent: file.content,
    })),
    comment: supportingDocumentsAnswers?.comments,
    cargoes:
      freightAnswers?.items?.map((item) => {
        const freightPairing = freightPairingAnswers?.find(
          (x) => x?.freightId === item.freightId,
        )
        return {
          code: item.freightId ?? '',
          name: item.name,
          length: Number(freightPairing?.length ?? ''),
          weight: Number(freightPairing?.weight ?? ''),
        }
      }) || [],
    haulUnits: mapHaulUnits(application),
  }
}
