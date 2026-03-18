import { getValueViaPath, YES } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import {
  ApplicationDto,
  ApplicationFilesContentDto,
} from '@island.is/clients/hms-application-system'
import { Fasteign } from '@island.is/clients/assets'
import {
  AttachmentData,
  StreamingAttachmentData,
} from '../../../shared/services/attachment-s3.service'
import crypto from 'crypto'
import * as kennitala from 'kennitala'
import { Readable } from 'stream'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal
// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal above 500 million + 150.000kr
export const paymentForAppraisal = (currentAppraisal: number) => {
  const paymentFor500Million = 150000
  if (currentAppraisal < 25000000) {
    return 6000
  }

  if (currentAppraisal > 500000000) {
    return (
      Math.round((currentAppraisal - 500000000) * 0.0001) + paymentFor500Million
    )
  }

  return Math.round(currentAppraisal * 0.0003)
}

const GUID = 'c7c13606-9a03-40ec-837b-ec5d7665a8fe' // HMS does nothing with this but it has to have a certain form for the request to go through
const APPLICATION_TYPE = 'LscVK9yI7EeXf4WDCOBfww' // This is fixed and comes from HMS

export const getApplicant = (answers: FormValue) => {
  return {
    address: getValueViaPath<string>(answers, 'applicant.address'),
    city: getValueViaPath<string>(answers, 'applicant.city'),
    email: getValueViaPath<string>(answers, 'applicant.email'),
    name: getValueViaPath<string>(answers, 'applicant.name'),
    nationalId: getValueViaPath<string>(answers, 'applicant.nationalId'),
    phoneNumber: getValueViaPath<string>(answers, 'applicant.phoneNumber'),
    postalCode: getValueViaPath<string>(answers, 'applicant.postalCode'),
  }
}

export const mapAnswersToApplicationFilesContentDto = (
  application: Application,
  files: Array<AttachmentData>,
): Array<ApplicationFilesContentDto> => {
  return (
    files?.map((file) => {
      return {
        fileID: hashToLength20(file.key.split('_')[0]),
        applicationID: application.id,
        content: file.fileContent,
        applicationType: APPLICATION_TYPE,
      }
    }) ?? []
  )
}

export const mapAnswersToSingleApplicationFilesContentDto = (
  application: Application,
  file: AttachmentData,
): ApplicationFilesContentDto => {
  if (!file.fileContent) {
    throw new TemplateApiError(
      'Failed to submit application, missing file content',
      500,
    )
  }
  return {
    fileID: hashToLength20(file.key.split('_')[0]),
    applicationID: application.id,
    content: file.fileContent,
    applicationType: APPLICATION_TYPE,
  }
}

/**
 * Peeks at the first byte of a Readable stream to verify it contains data.
 * The byte is unshifted back into the stream so the data remains fully intact for the next consumer.
 *
 * @param stream The Node.js Readable stream to check
 * @returns Promise<boolean> True if the stream has data, false if it's empty or errors
 */
export const isStreamNotEmpty = async (stream: Readable): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const onReadable = () => {
      const chunk = stream.read(1) // Try to read 1 byte
      if (chunk !== null) {
        stream.unshift(chunk) // Put the byte back
        cleanup()
        resolve(true)
      }
    }
    const onEnd = () => {
      cleanup()
      resolve(false)
    }
    const onError = () => {
      cleanup()
      resolve(false)
    }
    const cleanup = () => {
      stream.removeListener('readable', onReadable)
      stream.removeListener('end', onEnd)
      stream.removeListener('error', onError)
    }
    stream.on('readable', onReadable)
    stream.on('end', onEnd)
    stream.on('error', onError)
  })
}

/**
 * Consumes a readable stream entirely and returns its contents as a base64 string.
 */
const streamToBase64 = async (stream: Readable): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    stream.on('end', () => {
      resolve(Buffer.concat(chunks as Uint8Array[]).toString('base64'))
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
}
/**
 * An async generator that consumes streaming attachments one by one,
 * buffers the stream into a base64 string, and yields the corresponding DTO.
 */
export async function* mapStreamedAnswersToApplicationFilesContentDtoGenerator(
  application: Application,
  filesGenerator: AsyncIterable<StreamingAttachmentData>,
  logger: Logger,
): AsyncGenerator<ApplicationFilesContentDto, void, unknown> {
  const processedKeys = new Set<string>()
  for await (const file of filesGenerator) {
    if (!file.fileStream || !(await isStreamNotEmpty(file.fileStream))) {
      logger.error('Missing file content for attachments', {
        missingKey: file.key,
      })
      throw new TemplateApiError(
        'Failed to submit application, missing file content',
        500,
      )
    }

    // 1. Check for duplicates
    if (processedKeys.has(file.key)) {
      logger.info('Skipping duplicate attachment', { key: file.key })
      // Drain and discard the stream to free up resources and close the connection
      if (file.fileStream) {
        file.fileStream.on('data', () => {
          // just read and discard the chunks
        })
        file.fileStream.resume() // Start flowing data so it ends quickly
      }
      continue
    }
    // 2. Process unique keys
    processedKeys.add(file.key)

    let content = ''
    if (file.fileStream) {
      try {
        content = await streamToBase64(file.fileStream)
      } catch (error) {
        // Handle stream reading errors gracefully or rethrow depending on your policy
        throw new Error(`Failed to read stream for file: ${file.key}`)
      }
    }
    yield {
      fileID: hashToLength20(file.key.split('_')[0]),
      applicationID: application.id,
      content,
      applicationType: APPLICATION_TYPE,
    }
  }
}

export const mapAnswersToApplicationDto = (
  application: Application,
): ApplicationDto => {
  const { answers, externalData } = application
  const applicant = getApplicant(answers)
  const otherPropertiesThanIOwn = getValueViaPath<string[]>(
    answers,
    'otherPropertiesThanIOwnCheckbox',
  )?.includes(YES)
  const selectedRealEstateId = otherPropertiesThanIOwn
    ? 'F' + getValueViaPath<string>(answers, 'selectedPropertyByCode')
    : getValueViaPath<string>(answers, 'realEstate')

  const realEstates = otherPropertiesThanIOwn
    ? getValueViaPath<Array<Fasteign>>(answers, 'anyProperties')
    : getValueViaPath<Array<Fasteign>>(externalData, 'getProperties.data')

  const selectedRealEstate = realEstates?.find(
    (realEstate) => realEstate.fasteignanumer === selectedRealEstateId,
  )
  const fileAnswers = getValueViaPath(application.answers, 'photos') as Array<{
    key: string
    name: string
  }>
  const parsedFiles = fileAnswers?.map((file) => {
    const parts = file.key.split('.')
    const ending = (parts.length > 1 ? parts.pop() ?? '' : '').toLowerCase()
    const heiti = parts.join('.').replace(/^[^_]*_/, '')
    const tegund = ending === 'pdf' ? 'application/pdf' : 'image/jpeg'
    return {
      flokkur: ending === 'pdf' ? 5 : 2,
      heiti,
      dags: new Date(),
      tegund,
      fileID: hashToLength20(file.key.split('_')[0]),
      ending: `.${ending}`,
    }
  })

  return {
    applicationName: 'Brunabótamat - Endurmat',
    status: 40, // Fixed value something from umsóknasmiður
    language: 'IS',
    portalApplicationID: application.id,
    applicationType: APPLICATION_TYPE,
    applicationJson: null,
    dagssetning: new Date(),
    adilar: [
      {
        kennitala: applicant.nationalId,
        heiti: applicant.name,
        heimili: applicant.address,
        postnumer: applicant.postalCode,
        stadur: applicant.city,
        tegund: kennitala.isPerson(applicant.nationalId ?? '') ? 0 : 2, // 0 is a person and 2 is a company
        hlutverk: 'Umsækjandi',
        netfang: applicant.email,
        simi: applicant.phoneNumber,
      },
    ],
    notandagogn: [
      {
        flokkur: 'Skil á umsókn',
        heiti:
          'Ég lýsi yfir að ég hef kynnt mér efni á island.is um brunabótamat',
        tegund: 'bool',
        gildi:
          getValueViaPath<Array<string>>(
            answers,
            'confirmReadFireCompensationInfo',
          )?.[0] === YES
            ? 'true'
            : 'false',
        guid: GUID,
      },
      {
        flokkur: 'Skil á umsókn',
        heiti: 'Ég hef kynnt mér persónuverndarstefnu HMS',
        tegund: 'bool',
        gildi:
          getValueViaPath<Array<string>>(
            answers,
            'confirmReadPrivacyPolicy',
          )?.[0] === YES
            ? 'true'
            : 'false',
        guid: GUID,
      },
      {
        flokkur: 'Eign',
        heiti: 'Fasteignanumer',
        tegund: 'fastanúmer',
        gildi:
          selectedRealEstate?.notkunareiningar?.notkunareiningar?.[0]?.fasteignanumer?.replace(
            /\D/g,
            '',
          ),
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Heimili',
        tegund: 'string',
        gildi: selectedRealEstate?.sjalfgefidStadfang?.birtingStutt,
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Póstnúmer',
        tegund: 'string',
        gildi: selectedRealEstate?.sjalfgefidStadfang?.postnumer?.toString(),
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Valdar notkunareiningar',
        tegund: 'string',
        gildi: JSON.stringify(
          (getValueViaPath<Array<string>>(answers, 'usageUnits') ?? []).filter(
            Boolean,
          ),
        ),
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Núverandi brunabótamat valdra notkunareininga',
        tegund: 'string',
        gildi:
          getValueViaPath<string>(answers, 'usageUnitsFireCompensation') ?? '',
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Núverandi heildar brunabótamat',
        tegund: 'string',
        gildi: getValueViaPath<string>(answers, 'totalFireCompensation'),
        guid: GUID,
      },
      {
        flokkur: 'Matsaðferð',
        heiti: 'Endurmat vegna endurbóta',
        tegund: 'radio',
        gildi: getValueViaPath<Array<string>>(
          answers,
          'appraisalMethod',
        )?.includes('renovations')
          ? 'Já, vegna endurbóta'
          : 'Nei, ekki vegna endurbóta',
        guid: GUID,
      },
      {
        flokkur: 'Matsaðferð',
        heiti: 'Endurmat vegna viðbyggingar',
        tegund: 'radio',
        gildi: getValueViaPath<Array<string>>(
          answers,
          'appraisalMethod',
        )?.includes('additions')
          ? 'Já, vegna viðbyggingar'
          : 'Nei, ekki vegna viðbyggingar',
        guid: GUID,
      },
      {
        flokkur: 'FastanúmerAfleiða',
        heiti: 'Sveitarfélag',
        tegund: 'string',
        gildi: selectedRealEstate?.sjalfgefidStadfang?.sveitarfelagBirting,
        guid: GUID,
      },
      {
        flokkur: 'Lýsing á fasteign',
        heiti: 'Lýsing á framkvæmdum ',
        tegund: 'multi',
        gildi: getValueViaPath<string>(answers, 'description'),
        guid: GUID,
      },
    ],
    greidsla: {
      upphaed: null,
      dags: null,
      korthafi: null,
      kortanumer: null,
      tegundKorts: null,
    },
    files: parsedFiles,
  }
}

// This is a helper function to hash the fileID to a length of 20 characters
// This is because HMS has this set to varChar(20) in their database and they don't want
// to change it. This has the potential to cause collisions but it's unlikely.
export const hashToLength20 = (input: string): string => {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 20)
}
