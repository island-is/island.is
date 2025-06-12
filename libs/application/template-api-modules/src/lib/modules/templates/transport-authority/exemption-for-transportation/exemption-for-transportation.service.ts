import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  Area,
  ExemptionForTransportationClient,
  ExceptionType,
  ExemptionRules,
  VehicleType,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import { getValueViaPath } from '@island.is/application/core'
import {
  DollyType,
  error as errorMessage,
  ExemptionFor,
  ExemptionForTransportationAnswers,
  ExemptionType,
  RegionArea,
} from '@island.is/application/templates/transport-authority/exemption-for-transportation'
import { isCompany } from 'kennitala'
import { Person } from './types'
import {
  getAllFreightForConvoy,
  getFirstName,
  getLastName,
  mapEnumByValue,
  mapStringToNumber,
} from './utils'
import { S3Service } from '@island.is/nest/aws'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class ExemptionForTransportationService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly exemptionForTransportationClient: ExemptionForTransportationClient,
    private readonly s3Service: S3Service,
  ) {
    super(ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION)
  }

  async getExemptionRules({
    auth,
  }: TemplateApiModuleActionProps): Promise<ExemptionRules> {
    return this.exemptionForTransportationClient.getRules(auth)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    // Applicant
    const nationalRegistryData = getValueViaPath<NationalRegistryIndividual>(
      application.externalData,
      'nationalRegistry.data',
    )
    const applicantAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['applicant']
    >(application.answers, 'applicant')
    const applicant: Person = {
      nationalId: nationalRegistryData?.nationalId || '',
      fullName: nationalRegistryData?.fullName || '',
      address: nationalRegistryData?.address?.streetAddress || '',
      email: applicantAnswers?.email || '',
      phone: applicantAnswers?.phoneNumber?.slice(-7) || '',
    }

    // Transporter + Responsible person
    const transporterAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['transporter']
    >(application.answers, 'transporter')
    const responsiblePersonAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['responsiblePerson']
    >(application.answers, 'responsiblePerson')
    const transporter: Person = transporterAnswers?.isSameAsApplicant
      ? applicant
      : {
          nationalId: transporterAnswers?.nationalId || '',
          fullName: transporterAnswers?.name || '',
          address: transporterAnswers?.address || '',
          email: transporterAnswers?.email || '',
          phone: transporterAnswers?.phone?.slice(-7) || '',
        }

    const responsiblePerson: Person | undefined = isCompany(
      transporter.nationalId,
    )
      ? responsiblePersonAnswers?.isSameAsApplicant
        ? applicant
        : {
            nationalId: responsiblePersonAnswers?.nationalId || '',
            fullName: responsiblePersonAnswers?.name || '',
            email: responsiblePersonAnswers?.email || '',
            phone: responsiblePersonAnswers?.phone?.slice(-7) || '',
          }
      : undefined

    // Exemption period
    const exemptionPeriodAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['exemptionPeriod']
    >(application.answers, 'exemptionPeriod')
    const exemptionPeriodType = exemptionPeriodAnswers?.type

    // Location
    const locationAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['location']
    >(application.answers, 'location')
    const locationFiles =
      exemptionPeriodType === ExemptionType.LONG_TERM
        ? await Promise.all(
            (locationAnswers?.longTerm?.files || []).map(async (file) => {
              return {
                name: file.name,
                content: await this.getAttachmentAsBase64(application, file),
              }
            }),
          )
        : []

    // Supporting documents
    const supportingDocumentsAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['supportingDocuments']
    >(application.answers, 'supportingDocuments')
    const supportingDocumentsFiles = await Promise.all(
      (supportingDocumentsAnswers?.files || []).map(async (file) => {
        return {
          name: file.name,
          content: await this.getAttachmentAsBase64(application, file),
        }
      }),
    )

    // Convoy + Freight + Freight pairing
    const convoyAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['convoy']
    >(application.answers, 'convoy')
    const freightAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['freight']
    >(application.answers, 'freight')
    const freightPairingAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['freightPairing']
    >(application.answers, 'freightPairing')

    // Axle spacing
    const axleSpacingAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['axleSpacing']
    >(application.answers, 'axleSpacing')

    // Vehicle spacing
    const vehicleSpacingAnswers = getValueViaPath<
      ExemptionForTransportationAnswers['vehicleSpacing']
    >(application.answers, 'vehicleSpacing')

    // Submit the application
    const result =
      await this.exemptionForTransportationClient.submitApplication(auth, {
        externalID: application.id,
        // Applicant:
        applicant: {
          ssn: applicant.nationalId,
          firstName: getFirstName(applicant.fullName),
          lastName: getLastName(applicant.fullName),
          email: applicant.email,
          phone: applicant.phone,
        },
        // Transporter + Responsible person
        transporterSSN: transporter.nationalId,
        transporterName: transporter.fullName,
        transporterAddress: transporter.address || '',
        transporterPhone: transporter.phone,
        transporterEmail: transporter.email,
        guarantor: responsiblePerson
          ? {
              ssn: responsiblePerson.nationalId,
              firstName: getFirstName(responsiblePerson.fullName),
              lastName: getLastName(responsiblePerson.fullName),
              email: responsiblePerson.email,
              phone: responsiblePerson.phone,
            }
          : undefined,

        // Exemption period
        dateFrom: new Date(exemptionPeriodAnswers?.dateFrom || ''),
        dateTo: new Date(exemptionPeriodAnswers?.dateTo || ''),

        // Location
        origin:
          exemptionPeriodType === ExemptionType.SHORT_TERM
            ? `${locationAnswers?.shortTerm?.addressFrom}, ${locationAnswers?.shortTerm?.postalCodeAndCityFrom}`
            : undefined,
        destination:
          exemptionPeriodType === ExemptionType.SHORT_TERM
            ? `${locationAnswers?.shortTerm?.addressTo}, ${locationAnswers?.shortTerm?.postalCodeAndCityTo}`
            : undefined,
        areas:
          exemptionPeriodType === ExemptionType.LONG_TERM
            ? mapEnumByValue(
                RegionArea,
                Area,
                locationAnswers?.longTerm?.regions || [],
              )
            : undefined,
        desiredRoute:
          exemptionPeriodType === ExemptionType.SHORT_TERM
            ? locationAnswers?.shortTerm?.directions
            : locationAnswers?.longTerm?.directions,

        // Supporting documents
        documents: (exemptionPeriodType === ExemptionType.LONG_TERM
          ? [...locationFiles, ...supportingDocumentsFiles]
          : supportingDocumentsFiles
        ).map((file) => ({
          documentName: file.name,
          documentContent: file.content,
        })),
        comment: supportingDocumentsAnswers?.comments,

        // Freight
        cargoes:
          freightAnswers?.items?.map((item) => ({
            code: item.freightId,
            name: item.name,
            length: Number(item.length),
            weight: Number(item.weight),
          })) || [],

        // Convoy + Freight pairing + Axle spacing + Vehicle spacing
        haulUnits:
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
                        axleSpacing:
                          (axleSpacingAnswers?.hasExemptionForWeight &&
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
                              ? Array(
                                  (trailerAxleSpacing?.axleCount ?? 0) - 1,
                                ).fill(trailerAxleSpacing?.singleValue)
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
          }) || [],
      })

    if (result.hasError) {
      throw new TemplateApiError(
        {
          title: errorMessage.submitErrorTitle,
          summary: result.errorMessages
            ? result.errorMessages.join(',')
            : errorMessage.submitErrorFallbackMessage,
        },
        400,
      )
    }

    return result
  }

  private async getAttachmentAsBase64(
    application: ApplicationWithAttachments,
    attachment: {
      key: string
      name: string
    },
  ): Promise<string> {
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
      const fileContent = await this.s3Service.getFileContent(
        fileName,
        'base64',
      )

      if (!fileContent) {
        throw new Error(`File content not found for: ${fileName}`)
      }

      return fileContent
    } catch (error) {
      throw new Error(`Failed to retrieve attachment: ${error.message}`)
    }
  }
}
