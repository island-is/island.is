import {
  FAApplication,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import { ApplicationWithAttachments } from '@island.is/application/types'
import type { FilesApi } from '@island.is/clients/municipalities-financial-aid'
import type { Logger } from '@island.is/logging'
import { AttachmentS3Service } from '../../shared/services'

type MunicipalitiesTaxReturn = TaxData['municipalitiesPersonalTaxReturn']
type MunicipalitiesDirectTaxPayments =
  TaxData['municipalitiesDirectTaxPayments']

const NATIONAL_ID_LENGTH = 10

// The municipalities backend stringifies a number parsed from the RSK
// response, so a kennitala starting with a zero arrives with nine digits.
export const padPayerNationalIds = (
  taxPayments: MunicipalitiesDirectTaxPayments,
): MunicipalitiesDirectTaxPayments => ({
  ...taxPayments,
  directTaxPayments: (taxPayments?.directTaxPayments ?? []).map((payment) => ({
    ...payment,
    payerNationalId: (payment.payerNationalId ?? '').padStart(
      NATIONAL_ID_LENGTH,
      '0',
    ),
  })),
})

// The municipalities backend names the file after the national id. The name
// kept on the application leaves it out, so it does not end up in S3 keys,
// presigned URLs and access logs.
const toApplicationFileName = (
  backendFileName: string,
  nationalId: string,
  isSpouse: boolean,
) => backendFileName.replace(`_${nationalId}_`, isSpouse ? '_maki_' : '_')

// The municipalities backend stores the tax return in its own bucket. Veita
// reads attachments through the application's attachments, so the file is
// copied there and the returned key is one the application can resolve.
// A tax return that cannot be copied is treated as unavailable, so the
// applicant can upload one by hand.
export const copyTaxReturnToApplicationAttachments = async ({
  taxReturn,
  filesApi,
  attachmentService,
  application,
  nationalId,
  logger,
}: {
  taxReturn: MunicipalitiesTaxReturn
  filesApi: FilesApi
  attachmentService: AttachmentS3Service
  application: FAApplication & ApplicationWithAttachments
  nationalId: string
  logger: Logger
}): Promise<MunicipalitiesTaxReturn> => {
  const backendFile = taxReturn?.personalTaxReturn
  const unavailable = { personalTaxReturn: null } as MunicipalitiesTaxReturn

  if (!backendFile) {
    return unavailable
  }

  try {
    const separatorIndex = backendFile.key.indexOf('/')
    const { url } = await filesApi.fileControllerCreateSignedUrl({
      getSignedUrlDto: {
        folder: backendFile.key.slice(0, separatorIndex),
        fileName: backendFile.key.slice(separatorIndex + 1),
      },
    })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`)
    }
    const buffer = Buffer.from(await response.arrayBuffer())

    const fileName = toApplicationFileName(
      backendFile.name,
      nationalId,
      nationalId !== application.applicant,
    )
    const key = await attachmentService.addAttachment(
      application,
      fileName,
      buffer,
      { ContentType: 'application/pdf' },
    )

    return {
      personalTaxReturn: { key, name: fileName, size: buffer.length },
    }
  } catch (error) {
    logger.warn('Could not copy tax return to application attachments', {
      applicationId: application.id,
      error: error instanceof Error ? error.message : String(error),
    })
    return unavailable
  }
}
