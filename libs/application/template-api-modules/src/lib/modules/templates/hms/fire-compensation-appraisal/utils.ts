import { getValueViaPath, YES } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import {
  ApplicationDto,
  ApplicationFilesContentDto,
} from '@island.is/clients/hms-application-system'
import { Fasteign } from '@island.is/clients/assets'
import { AttachmentData } from '../../../shared/services/attachment-s3.service'
import crypto from 'crypto'
import * as kennitala from 'kennitala'

// The payment structure is as follows:
// 1. If the current appraisal is less than 25 million, the payment is 6.000kr
// 2. If the current appraisal is between 25 million and 500 million, the payment is 0.03% of the current appraisal

// 3. If the current appraisal is greater than 500 million, the payment is 0.01% of the current appraisal
export const paymentForAppraisal = (currentAppraisal: number) => {
  if (currentAppraisal < 25000000) {
    return 6000
  }

  if (currentAppraisal > 500000000) {
    return Math.round(currentAppraisal * 0.0001)
  }

  return Math.round(currentAppraisal * 0.0003)
}

const GUID = 'c7c13606-9a03-40ec-837b-ec5d7665a8fe' // HMS does nothing with this but it has to have a certain form for the request to go through
const APPLICATION_TYPE = 'LscVK9yI7EeXf4WDCOBfww' // This is fixed and comes from HMS

const getApplicant = (answers: FormValue) => {
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

export const mapAnswersToApplicationDto = (
  application: Application,
  files: Array<AttachmentData>,
): ApplicationDto => {
  const { answers, externalData } = application
  const applicant = getApplicant(answers)
  const selectedRealEstateId = getValueViaPath<string>(answers, 'realEstate')
  const selectedRealEstate = getValueViaPath<Array<Fasteign>>(
    externalData,
    'getProperties.data',
  )?.find((realEstate) => realEstate.fasteignanumer === selectedRealEstateId)

  const parsedFiles = files?.map((file) => {
    const ending = file.key.split('.').pop()
    const tegund = ending === 'pdf' ? 'application/pdf' : 'image/jpeg'
    return {
      flokkur: ending === 'pdf' ? 5 : 2,
      heiti: file.key.replace(/^[^_]*_/, ''), // This is limited to varChar(100) in the HMS database but most opperating systems allow 256 characters j
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
        gildi: selectedRealEstate?.fasteignanumer,
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
