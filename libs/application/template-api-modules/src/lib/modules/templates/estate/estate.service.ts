import { Injectable } from '@nestjs/common'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { NationalRegistry, UploadData } from './types'
import {
  DataUploadResponse,
  Person,
  PersonType,
  SyslumennService,
} from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { estateSchema } from '@island.is/application/templates/estate'
import cloneDeep from 'lodash/cloneDeep'

type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']

@Injectable()
export class EstateTemplateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
  ) {}

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
    // TODO: hook up to client once API endpoint is ready
    //      1. Delete const estate
    //      2. uncomment the following line
    //      const estate = await this.syslumennService.getEstateInfo(application.applicant)[0];

    // TODO: Steini: gera initial data mapper þegar endapunktur er kominn upp
    const estate: EstateData = {
      assets: [
        {
          assetNumber: 'F2318696',
          description: 'Íbúð í Reykjavík',
          initial: true,
        },
        {
          assetNumber: 'F2262202',
          description: 'Raðhús á Akureyri',
          initial: true,
        },
      ],
      vehicles: [
        {
          assetNumber: 'VA334',
          description: 'Nissan Terrano II',
          initial: true,
        },
        {
          assetNumber: 'YZ927',
          description: 'Subaru Forester',
          initial: true,
        },
      ],
      knowledgeOfOtherWills: 'yes',
      ships: [],
      flyers: [],
      estateMembers: [
        {
          name: 'Stúfur Mack',
          relation: 'Sonur',
          nationalId: '2222222229',
          initial: true,
        },
        {
          name: 'Gervimaður Færeyja',
          relation: 'Maki',
          nationalId: '0101302399',
          initial: true,
        },
        {
          name: 'Gervimaður Bretland',
          relation: 'Faðir',
          nationalId: '0101304929',
          initial: true,
        },
      ],
      caseNumber: '011515',
      dateOfDeath: new Date(Date.now() - 1000 * 3600 * 24 * 100),
      nameOfDeceased: 'Lizzy B. Gone',
      nationalIdOfDeceased: '0101301234',
      districtCommissionerHasWill: true,
    }

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

    const estateData = ((application.externalData
      ?.syslumennOnEntry as unknown) as { data: EstateSchema }).data.estate

    // TODO: hook up fields to answers when ready
    const uploadData: UploadData = {
      caseNumber: estateData.caseNumber,
      applicantHasLegalCustodyOverEstate: 'no',
      assets: [],
      bankAccounts: [],
      debts: [],
      estateMembers: [],
      inventory: '',
      inventoryValue: '',
      moneyAndDepositBoxesInfo: '',
      moneyAndDepositBoxesValue: '',
      notifier: {
        email: '',
        name: '',
        phoneNumber: '',
        relation: '',
        ssn: '',
      },
      otherAssets: '',
      otherAssetsValue: '',
      stocks: [],
      undividedEstateResidencePermission: 'no',
      vehicles: [],
    }

    // TODO: uncomment once data is ready to be uploaded
    /*
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
          errorMessage: e.message
        }
      })
    
    if (!result.success) {
      throw new Error(
        'Application submission failed on syslumadur upload data'
      )
    }
    return { sucess: result.success, id: result.caseNumber }
    */
    return { success: 'false', id: '1234' }
  }
}
