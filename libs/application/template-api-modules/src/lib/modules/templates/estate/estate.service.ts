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
import cloneDeep from 'lodash/cloneDeep'
import { estateTransformer } from './utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApplicationTypes } from '@island.is/application/types'

type EstateSchema = zinfer<typeof estateSchema>

@Injectable()
export class EstateTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly syslumennService: SyslumennService,
  ) {
    super(ApplicationTypes.ESTATE)
  }

  stringifyObject(obj: Record<string, unknown>): Record<string, string> {
    const stringer = cloneDeep(obj)

    Object.keys(stringer).forEach((key) => {
      if (typeof stringer[key] !== 'object') {
        stringer[key] = `${stringer[key]}`
      } else if (typeof stringer[key] === 'object') {
        this.stringifyObject(stringer[key] as Record<string, unknown>)
      }
    })

    // Assert from object traversal
    return stringer as Record<string, string>
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
        caseNumber: '011515',
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

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistry

    const answers = (application.answers as unknown) as EstateSchema

    const person: Person = {
      name: nationalRegistryData?.fullName,
      ssn: application.applicant,
      phoneNumber: application.answers.applicantPhone as string,
      city: nationalRegistryData?.address.city,
      homeAddress: nationalRegistryData?.address.streetAddress,
      postalCode: nationalRegistryData?.address.postalCode,
      signed: false,
      type: PersonType.AnnouncerOfDeathCertificate,
      email: answers.applicant.email,
    }

    const uploadDataName = 'danarbusskipti1.0'
    const uploadDataId = 'danarbusskipti1.0'

    const applicantData = answers.estate.estateMembers?.find(
      (member) => member.nationalId === answers.applicant.nationalId,
    )

    const uploadData: UploadData = {
      applicantHasLegalCustodyOverEstate:
        answers.applicantHasLegalCustodyOverEstate,
      assets: answers.estate.assets ?? [],
      bankAccounts: answers.bankAccounts ?? [],
      debts: answers.debts ?? [],
      estateMembers: answers.estate.estateMembers ?? [],
      inventory: answers.inventory,
      inventoryValue: answers.inventoryValue,
      moneyAndDepositBoxesInfo: answers.moneyAndDepositBoxesInfo,
      moneyAndDepositBoxesValue: answers.moneyAndDepositBoxesValue,
      notifier: {
        email: answers.applicant.email,
        name: answers.applicant.name,
        phoneNumber: answers.applicant.phone,
        relation:
          applicantData && applicantData?.relation
            ? applicantData.relation
            : 'unknown',
        ssn: answers.applicant.nationalId,
      },
      otherAssets: answers.otherAssets,
      otherAssetsValue: answers.otherAssetsValue,
      stocks: answers.stocks ?? [],
      undividedEstateResidencePermission:
        answers.undividedEstateResidencePermission,
      vehicles: answers.estate.vehicles ?? [],
    }

    //const result: DataUploadResponse = await this.syslumennService
    //  .uploadData(
    //    [person],
    //    undefined,
    //    this.stringifyObject(uploadData),
    //    uploadDataName,
    //    uploadDataId,
    //  )
    //  .catch((e) => {
    //    return {
    //      success: false,
    //      errorMessage: e.message
    //    }
    //  })

    //if (!result.success) {
    //  throw new Error(
    //    'Application submission failed on syslumadur upload data'
    //  )
    //}
    //return { sucess: result.success, id: result.caseNumber }
    console.log(JSON.stringify(uploadData))
    return { success: 'yes', id: Math.ceil(10000 * Math.random()) }
  }
}
