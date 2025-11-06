import get from 'lodash/get'
import parse from 'date-fns/parse'
import parseISO from 'date-fns/parseISO'
import { logger } from '@island.is/logging'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { objectToXML } from '../../../shared/shared.utils'
import is from 'date-fns/locale/is'
import format from 'date-fns/format'
import { TemplateApiError } from '@island.is/nest/problem'
import { errorMessages } from '@island.is/application/templates/iceland-health/health-insurance'
import {
  ApplyHealthInsuranceInputs,
  ErrorCodes,
  Fylgiskjal,
  Fylgiskjol,
  GetVistaSkjalBody,
  VistaSkjalInput,
} from './types/health-insurance-types'
import { S3Service } from '@island.is/nest/aws'

const formatDate = (date: Date) => {
  return format(new Date(date), 'yyyy-MM-dd', {
    locale: is,
  })
}

/**
 * Generates Xml correctly formatted for each type of SÍ application
 * The order of the elements is important as an incorrect order
 * will result in an Invalid Xml error from SÍ
 * @param answers - The answers to the accident notification
 * @param attachments - The attachments names and base64 Content
 * @returns The application Xml correctly formatted for SÍ application
 */

// Apply Insurance without attachment
export const insuranceToXML = async (
  inputObj: VistaSkjalInput,
  attachmentNames: string[],
  s3Service: S3Service,
) => {
  logger.debug(`--- Starting to convert application to XML ---`)
  const vistaSkjalBody: GetVistaSkjalBody = {
    sjukratryggingumsokn: {
      einstaklingur: {
        kennitala: inputObj.nationalId,
        erlendkennitala: inputObj.foreignNationalId,
        nafn: inputObj.name,
        heimili: inputObj.address ?? '',
        postfangstadur: inputObj.postalAddress ?? '',
        rikisfang: inputObj.citizenship ?? '',
        rikisfangkodi: inputObj.postalAddress ? 'IS' : '',
        simi: inputObj.phoneNumber,
        netfang: inputObj.email,
      },
      numerumsoknar: inputObj.applicationNumber,
      dagsumsoknar: formatDate(inputObj.applicationDate),
      // 'dagssidustubusetuthjodskra' could be empty string
      dagssidustubusetuthjodskra: inputObj.residenceDateFromNationalRegistry
        ? formatDate(inputObj.residenceDateFromNationalRegistry)
        : '',
      // 'dagssidustubusetu' could be empty string
      dagssidustubusetu: inputObj.residenceDateUserThink
        ? formatDate(inputObj.residenceDateUserThink)
        : '',
      // There is 'Employed' status in frontend
      // but we don't have it yet in request
      // So we convert it to 'Other/O'
      stadaeinstaklings: inputObj.userStatus,
      bornmedumsaekjanda: inputObj.isChildrenFollowed,
      fyrrautgafuland: inputObj.previousCountry,
      fyrrautgafulandkodi: inputObj.previousCountryCode,
      fyrriutgafustofnunlands: inputObj.previousIssuingInstitution ?? '',
      tryggdurfyrralandi: inputObj.isHealthInsuredInPreviousCountry,
      tryggingaretturfyrralandi:
        inputObj.hasHealthInsuranceRightInPreviousCountry,
      vidbotarupplysingar: inputObj.additionalInformation ?? '',
    },
  }

  // Add attachments from S3 bucket
  // Attachment's name need to be exactly same as the file name, including file type (ex: skra.txt)
  const arrAttachments = inputObj.attachmentsFileNames
  if (arrAttachments && arrAttachments.length > 0) {
    if (arrAttachments.length !== attachmentNames.length) {
      logger.error(
        `Failed to extract filenames or bucket's attachment filenames`,
      )
      throw new Error(
        `Failed to extract filenames or bucket's attachment filenames`,
      )
    }
    logger.debug(`Start getting attachments`)
    const fylgiskjol: Fylgiskjol = {
      fylgiskjal: [],
    }
    for (let i = 0; i < arrAttachments.length; i++) {
      const filename = arrAttachments[i]
      const fileUri = attachmentNames[i] // attachmentNames actually contains the URIs
      const fileContent = await s3Service.getFileContent(fileUri, 'base64')

      if (!fileContent)
        throw new Error(`Unable to fetch file content for: ${filename}`)

      const fylgiskjal: Fylgiskjal = {
        heiti: filename,
        innihald: fileContent,
      }
      fylgiskjol.fylgiskjal.push(fylgiskjal)
    }
    vistaSkjalBody.sjukratryggingumsokn.fylgiskjol = fylgiskjol
    logger.debug(`Finished getting attachments`)
  }

  // Student has to have status confirmation document
  if (
    inputObj.userStatus == 'S' &&
    !vistaSkjalBody.sjukratryggingumsokn.fylgiskjol
  ) {
    logger.error(
      `Student applys for health insurance must have confirmation document`,
    )
    throw new Error(
      `Student applys for health insurance must have confirmation document`,
    )
  }

  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>${objectToXML(
    vistaSkjalBody,
  )}`

  return xml
}

const extractAnswer = <T>(object: unknown, key: string): T | null => {
  const value = get(object, key, null) as T | null | undefined
  if (value === undefined || value === null) {
    return null
  }
  return value
}

const extractAnswerFromJson = (object: unknown, key: string) => {
  const value: string | null = extractAnswer(object, key)
  if (value === undefined || value === null) {
    return null
  }
  return JSON.parse(value)
}

export const parseNationalRegistryDate = (dateString: string | null) => {
  if (typeof dateString !== 'string') {
    return undefined
  }

  // Icelandic format
  let parsedDate = parse(dateString, 'd.M.yyyy HH:mm:ss', new Date())
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  // ISO format (in the future hopefully)
  parsedDate = parseISO(dateString)
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  // Others
  return undefined
}

export const transformApplicationToHealthInsuranceDTO = (
  application: Application,
): ApplyHealthInsuranceInputs => {
  try {
    logger.debug(`Start transform Application to Health Insurance DTO`)
    /*
     * Convert userStatus:
     * employed: 'O'
     * pensioner: 'P'
     * student: 'S'
     * other: 'O'
     */
    let userStatus = ''
    switch (extractAnswer(application.answers, 'status.type')) {
      case 'pensioner':
        userStatus = 'P'
        break
      case 'student':
        userStatus = 'S'
        break
      default:
        userStatus = 'O'
        break
    }

    // Extract attachments
    const arrFiles: string[] = Object.keys(application.attachments) ?? []
    if (userStatus == 'S' && arrFiles.length <= 0) {
      logger.error(
        `Student's application must have confirmation of student document`,
      )
      throw new Error(
        `Student's application must have confirmation of student document`,
      )
    }

    // There is 2 fields to add information in frontend
    // But there is only one tag in API
    // Merge 2 fields together
    let addInfo = ''
    if (extractAnswer(application.answers, 'additionalRemarks')) {
      addInfo += `Additional comments: ${extractAnswer(
        application.answers,
        'additionalRemarks',
      )}.`
    }
    if (
      extractAnswer(application.answers, 'formerInsurance.entitlementReason')
    ) {
      addInfo += `IsHealthInsuredInPreviousCountry reason: ${extractAnswer(
        application.answers,
        'formerInsurance.entitlementReason',
      )}`
    }

    const attachmentNames = Object.values(application.attachments) ?? []

    const vistaskjal: VistaSkjalInput = {
      applicationNumber: application.id,
      applicationDate: application.modified,
      nationalId: application.applicant,
      foreignNationalId:
        extractAnswer(application.answers, 'formerInsurance.personalId') ?? '',
      name: extractAnswer(application.answers, 'applicant.name') ?? '',
      address:
        extractAnswer(application.answers, 'applicant.address') ?? undefined,
      postalAddress:
        extractAnswer(application.answers, 'applicant.postalCode') ?? undefined,
      citizenship:
        extractAnswerFromJson(application.answers, 'citizenship')?.name ??
        undefined,
      email: extractAnswer(application.answers, 'applicant.email') ?? '',
      phoneNumber:
        extractAnswer(application.answers, 'applicant.phoneNumber') ?? '',
      // Registry date could be empty
      residenceDateFromNationalRegistry: parseNationalRegistryDate(
        extractAnswer(
          application.externalData,
          'nationalRegistry.data.address.lastUpdated',
        ),
      ),
      // Could not get this yet, so sent in empty
      residenceDateUserThink: undefined,
      userStatus: userStatus,
      isChildrenFollowed:
        extractAnswer(application.answers, 'children') == 'no' ? 0 : 1,
      previousCountry:
        extractAnswerFromJson(application.answers, 'formerInsurance.country')
          ?.name ?? '',
      previousCountryCode:
        extractAnswerFromJson(application.answers, 'formerInsurance.country')
          ?.countryCode ?? '',
      previousIssuingInstitution:
        extractAnswer(application.answers, 'formerInsurance.institution') ?? '',
      isHealthInsuredInPreviousCountry:
        extractAnswer(application.answers, 'formerInsurance.registration') ==
        'yes'
          ? 1
          : 0,
      hasHealthInsuranceRightInPreviousCountry:
        extractAnswer(application.answers, 'formerInsurance.entitlement') ==
        'yes'
          ? 1
          : 0,
      additionalInformation: addInfo,
      attachmentsFileNames: arrFiles,
    }

    return {
      vistaskjal: vistaskjal,
      attachmentNames,
    }
  } catch (error) {
    throw new Error(`Failed to convert application's information: ${error}`)
  }
}

export const errorMapper = async (error: Response) => {
  try {
    const body = await error.json()
    switch (body.errorList[0].errorType) {
      case ErrorCodes.APPLICATION_ID_MISSING:
        return new TemplateApiError(
          {
            title: errorMessages.applicationIdMissing.defaultMessage,
            summary: errorMessages.applicationIdMissingSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICATION_ID_EXISTS:
        return new TemplateApiError(
          {
            title: errorMessages.applicationIdExists.defaultMessage,
            summary: errorMessages.applicationIdExistsSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICATION_DATE_IN_FUTURE:
        return new TemplateApiError(
          {
            title: errorMessages.applicationDateInFuture.defaultMessage,
            summary:
              errorMessages.applicationDateInFutureSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICATION_NATIONAL_ID_NOT_FOUND:
        return new TemplateApiError(
          {
            title: errorMessages.applicationNationalIdNotFound.defaultMessage,
            summary:
              errorMessages.applicationNationalIdNotFoundSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICANT_DECEASED:
        return new TemplateApiError(
          {
            title: errorMessages.applicantDeceased.defaultMessage,
            summary: errorMessages.applicantDeceasedSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICANT_ALREADY_INSURED:
        return new TemplateApiError(
          {
            title: errorMessages.applicantAlreadyInsured.defaultMessage,
            summary:
              errorMessages.applicantAlreadyInsuredSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICANT_HAS_ACTIVE_APPLICATION:
        return new TemplateApiError(
          {
            title: errorMessages.applicantHasActiveApplication.defaultMessage,
            summary:
              errorMessages.applicantHasActiveApplicationSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICATION_ENCODING_WRONG:
        return new TemplateApiError(
          {
            title: errorMessages.applicationEncodingWrong.defaultMessage,
            summary:
              errorMessages.applicationEncodingWrongSummary.defaultMessage,
          },
          400,
        )
      case ErrorCodes.APPLICANT_STUDENT_ATTACHMENT_MISSING:
        return new TemplateApiError(
          {
            title:
              errorMessages.applicantStudentAttachmentMissing.defaultMessage,
            summary:
              errorMessages.applicantStudentAttachmentMissingSummary
                .defaultMessage,
          },
          400,
        )
      default:
        return new TemplateApiError(
          {
            title: errorMessages.defaultTemplateApiError.defaultMessage,
            summary:
              errorMessages.defaultTemplateApiErrorSummary.defaultMessage,
          },
          500,
        )
    }
  } catch (_) {
    // ignore parsing error and just return the default error
    return new TemplateApiError(
      {
        title: errorMessages.defaultTemplateApiError.defaultMessage,
        summary: errorMessages.defaultTemplateApiErrorSummary.defaultMessage,
      },
      500,
    )
  }
}
