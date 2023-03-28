import { Inject, Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../types'
import { NationalRegistry, UploadData } from './types'
import {
  DataUploadResponse,
  EstateInfo,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { estateSchema } from '@island.is/application/templates/estate'
import { estateTransformer, filterAndRemoveRepeaterMetadata } from './utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'

type EstateSchema = zinfer<typeof estateSchema>

@Injectable()
export class EstateTemplateService extends BaseTemplateApiService {
  constructor(private readonly syslumennService: SyslumennService) {
    super(ApplicationTypes.ESTATE)
  }

  stringifyObject(obj: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {}
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = obj[key] as string
      } else {
        result[key] = JSON.stringify(obj[key])
      }
    }

    return result
  }

  async syslumennOnEntry({ application, auth }: TemplateApiModuleActionProps) {
    let estateResponse: EstateInfo
    if (
      application.applicant.startsWith('010130') &&
      application.applicant.endsWith('2399')
    ) {
      estateResponse = {
        addressOfDeceased: 'Gerviheimili 123, 600 Feneyjar',
        cash: [],
        marriageSettlement: false,
        assets: [
          {
            assetNumber: 'F2318696',
            description: 'Íbúð í Reykjavík',
            share: 1,
          },
          {
            assetNumber: 'F2262202',
            description: 'Raðhús á Akureyri',
            share: 1,
          },
        ],
        vehicles: [
          {
            assetNumber: 'VA334',
            description: 'Nissan Terrano II',
            share: 1,
          },
          {
            assetNumber: 'YZ927',
            description: 'Subaru Forester',
            share: 1,
          },
        ],
        knowledgeOfOtherWills: 'Yes',
        ships: [],
        flyers: [],
        estateMembers: [
          {
            name: 'Stúfur Mack',
            relation: 'Sonur',
            nationalId: '2222222229',
          },
          {
            name: 'Gervimaður Færeyja',
            relation: 'Maki',
            nationalId: '0101302399',
          },
          {
            name: 'Gervimaður Bretland',
            relation: 'Faðir',
            nationalId: '0101304929',
          },
        ],
        caseNumber: '2020-000123',
        dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
        nameOfDeceased: 'Lizzy B. Gone',
        nationalIdOfDeceased: '0101301234',
        districtCommissionerHasWill: true,
      }
    } else {
      estateResponse = (
        await this.syslumennService.getEstateInfo(application.applicant)
      )[0]
    }

    const estate = estateTransformer(estateResponse)

    const relationOptions = (await this.syslumennService.getEstateRelations())
      .relations

    return {
      success: true,
      estate,
      relationOptions,
    }
  }

  async completeApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    const externalData = application.externalData.syslumennOnEntry
      ?.data as EstateSchema

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: application.applicant,
      phoneNumber: application.answers.applicantPhone as string,
      city: nationalRegistryData?.address.city,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      signed: false,
      type: PersonType.AnnouncerOfDeathCertificate,
      email: application.answers.applicantEmail as string,
    }

    const uploadDataName = 'danarbusskipti1.0'
    const uploadDataId = 'danarbusskipti1.0'

    const answers = (application.answers as unknown) as EstateSchema

    const relation =
      externalData?.estate.estateMembers?.find(
        (member) => member.nationalId === application.applicant,
      )?.relation ?? 'Óþekkt'

    const processedAssets = filterAndRemoveRepeaterMetadata<
      EstateSchema['estate']['assets']
    >(answers?.estate?.assets ?? externalData?.estate?.assets ?? [])

    const processedVehicles = filterAndRemoveRepeaterMetadata<
      EstateSchema['estate']['vehicles']
    >(answers?.estate?.vehicles ?? externalData?.estate?.vehicles ?? [])

    const processedEstateMembers = filterAndRemoveRepeaterMetadata<
      EstateSchema['estate']['estateMembers']
    >(
      answers?.estate?.estateMembers ??
        externalData?.estate?.estateMembers ??
        [],
    )

    const uploadData: UploadData = {
      applicationType: answers.selectedEstate,
      caseNumber: externalData?.estate?.caseNumber ?? '',
      assets: processedAssets,
      claims: answers.claims ?? [],
      bankAccounts: answers.bankAccounts ?? [],
      debts: answers.debts ?? [],
      estateMembers: processedEstateMembers,
      inventory: answers.inventory ?? '',
      inventoryValue: answers.inventoryValue ?? '',
      moneyAndDepositBoxesInfo: answers.moneyAndDepositBoxesInfo ?? '',
      moneyAndDepositBoxesValue: answers.moneyAndDepositBoxesValue ?? '',
      notifier: {
        email: answers.applicant.email ?? '',
        name: answers.applicant.name,
        phoneNumber: answers.applicant.phone,
        relation: relation ?? '',
        ssn: answers.applicant.nationalId,
      },
      otherAssets: answers.otherAssets ?? '',
      otherAssetsValue: answers.otherAssetsValue ?? '',
      stocks: answers.stocks ?? [],
      vehicles: processedVehicles,
      ...(answers.representative?.representativeName
        ? {
            representative: {
              email: answers.representative.representativeEmail ?? '',
              name: answers.representative.representativeName ?? '',
              phoneNumber:
                answers.representative.representativePhoneNumber ?? '',
              ssn: answers.representative.representativeNationalId ?? '',
            },
          }
        : {}),
    }

    const result: DataUploadResponse = await this.syslumennService
      .uploadData(
        [person],
        undefined,
        this.stringifyObject(uploadData),
        uploadDataName,
        uploadDataId,
      )
      .catch((e) => {
        return {
          success: false,
          errorMessage: e.message,
        }
      })

    if (!result.success) {
      throw new Error('Application submission failed on syslumadur upload data')
    }
    return { sucess: result.success, id: result.caseNumber }
  }
}
