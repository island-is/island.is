import { infer as zinfer } from 'zod'
import { estateSchema } from '@island.is/application/templates/estate'
import { filterAndRemoveRepeaterMetadata } from './filters'
import { ApplicationWithAttachments } from '@island.is/application/types'
import { UploadData } from '../types'
import {
  expandAssetFrames,
  expandBankAccounts,
  expandClaims,
  expandDebts,
  expandEstateMembers,
  expandOtherAssets,
  expandStocks,
  trueOrHasYes,
} from './mappers'
type EstateSchema = zinfer<typeof estateSchema>

export const stringifyObject = <T extends Record<string, unknown>>(
  obj: T,
): Record<keyof T, string> => {
  const result: Record<keyof T, string> = {} as Record<keyof T, string>
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = obj[key] as string
    } else {
      result[key] = JSON.stringify(obj[key])
    }
  }

  return result
}

export const generateRawUploadData = (
  answers: EstateSchema,
  externalData: EstateSchema['estate'],
  application: ApplicationWithAttachments,
) => {
  const relation =
    externalData?.estateMembers?.find(
      (member) => member.nationalId === application.applicant,
    )?.relation ?? 'Óþekkt'

  const processedAssets = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['assets']
  >(answers?.estate?.assets ?? externalData?.assets ?? [])

  const processedVehicles = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['vehicles']
  >(answers?.estate?.vehicles ?? externalData?.vehicles ?? [])

  const processedEstateMembers = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['estateMembers']
  >(answers?.estate?.estateMembers ?? externalData?.estateMembers ?? [])

  const processedGuns = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['guns']
  >(answers?.estate?.guns ?? [])

  const processedClaims = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['claims']
  >(answers?.estate?.claims ?? [])

  const processedBankAccounts = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['bankAccounts']
  >(answers?.estate?.bankAccounts ?? [])

  const processedDebts = filterAndRemoveRepeaterMetadata<
    NonNullable<EstateSchema['debts']>['data']
  >(answers?.debts?.data ?? [])

  const processedOtherAssets = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['otherAssets']
  >(answers?.estate?.otherAssets ?? [])

  const processedStocks = filterAndRemoveRepeaterMetadata<
    EstateSchema['estate']['stocks']
  >(answers?.estate?.stocks ?? [])

  const uploadData: UploadData = {
    deceased: {
      name: externalData.nameOfDeceased ?? '',
      ssn: externalData.nationalIdOfDeceased ?? '',
      dateOfDeath: externalData.dateOfDeath?.toString() ?? '',
      address: externalData.addressOfDeceased ?? '',
    },
    districtCommissionerHasWill: trueOrHasYes(
      answers.estate?.testament?.wills ?? 'false',
    ),
    knowledgeOfOtherWills: trueOrHasYes(
      answers.estate?.testament?.knowledgeOfOtherWills ?? 'false',
    ),
    settlement: trueOrHasYes(answers.estate?.testament?.agreement ?? 'false'),
    dividedEstate: trueOrHasYes(answers.estate?.testament?.dividedEstate ?? ''),
    remarksOnTestament: answers.estate?.testament?.additionalInfo ?? '',
    guns: expandAssetFrames(processedGuns),
    applicationType: answers.selectedEstate,
    caseNumber: externalData?.caseNumber ?? '',
    assets: expandAssetFrames(processedAssets),
    claims: expandClaims(processedClaims),
    bankAccounts: expandBankAccounts(processedBankAccounts),
    debts: expandDebts(processedDebts),
    estateMembers: expandEstateMembers(processedEstateMembers),
    inventory: {
      info: answers.estate?.inventory?.info ?? '',
      value: answers.estate?.inventory?.value ?? '',
    },
    moneyAndDeposit: {
      info: answers.estate?.moneyAndDeposit?.info ?? '',
      value: answers.estate?.moneyAndDeposit?.value ?? '',
    },
    notifier: {
      email: answers.applicant.email ?? '',
      name: answers.applicant.name,
      phoneNumber: answers.applicant.phone,
      relation: relation ?? '',
      ssn: answers.applicant.nationalId,
      autonomous: trueOrHasYes(answers.applicant.autonomous ?? 'false'),
    },
    otherAssets: expandOtherAssets(processedOtherAssets),
    stocks: expandStocks(processedStocks),
    vehicles: expandAssetFrames(processedVehicles),
    estateWithoutAssetsInfo: {
      estateAssetsExist: trueOrHasYes(
        answers?.estateWithoutAssets?.estateAssetsExist ?? 'false',
      ),
      estateDebtsExist: trueOrHasYes(
        answers?.estateWithoutAssets?.estateDebtsExist ?? 'false',
      ),
    },
    representative: {
      email: answers.representative?.email ?? '',
      name: answers.representative?.name ?? '',
      phoneNumber: answers.representative?.phone ?? '',
      ssn: answers.representative?.nationalId ?? '',
    },
    ...(answers.deceasedWithUndividedEstate?.spouse?.nationalId
      ? {
          deceasedWithUndividedEstate: {
            spouse: {
              name: answers.deceasedWithUndividedEstate.spouse.name ?? '',
              nationalId: answers.deceasedWithUndividedEstate.spouse.nationalId,
            },
            selection: trueOrHasYes(
              answers.deceasedWithUndividedEstate.selection ?? 'false',
            ),
          },
        }
      : {
          deceasedWithUndividedEstate: {
            spouse: {
              name: '',
              nationalId: '',
            },
            selection: 'false',
          },
        }),
    additionalComments: answers.additionalComments ?? '',
  }

  return uploadData
}
