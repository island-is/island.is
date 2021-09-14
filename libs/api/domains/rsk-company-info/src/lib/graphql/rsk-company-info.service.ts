import { Injectable } from '@nestjs/common'
import { RskCompany } from './models/rskCompany.model'
import { RskCompanyInfoAPI } from '@island.is/clients/rsk-company-info'
import { RskCompanyFormOfOperation } from './models/rskCompanyFormOfOperation.model'
import { RskCompanyVat } from './models/rskCompanyVat.model'
import { RskCompanyAddress } from './models/rskCompanyAddress.model'
import { RskCompanyRelatedParty } from './models/rskCompanyRelatedParty.model'
import { RskCompanyClassification } from './models/rskCompanyClassification.model'

@Injectable()
export class RskCompanyInfoService {
  constructor(private rskCompanyInfoApi: RskCompanyInfoAPI) {}

  async getCompanyInfo(nationalId: string): Promise<RskCompany> {
    const company = await this.rskCompanyInfoApi.getCompanyInfo(nationalId)
    return {
      nationalIdCompany: company.kennitala,
      name: company.nafn,
      dateOfRegistration: company.skrad,
      status: company.stada,
      formOfOperation: company.rekstrarform?.map(
        (item) =>
          ({
            type: item.tegund,
            name: item.heiti,
            suffix: item.vidskeyti,
          } as RskCompanyFormOfOperation),
      ),
      vat: company.virdisaukaskattur?.map(
        (item) =>
          ({
            vatNumber: item.vskNumer,
            dateOfRegistration: item.skrad,
            status: item.stada,
            deregistration: item.afskraning,
            classification: item.flokkun?.map(
              (classification) =>
                ({
                  type: classification.gerd,
                  classificationSystem: classification.flokkunarkerfi,
                  number: classification.numer,
                  name: classification.heiti,
                } as RskCompanyClassification),
            ),
          } as RskCompanyVat),
      ),
      address: company.heimilisfang?.map(
        (item) =>
          ({
            address: item.heimilisfang1,
            address2: item.heimilisfang2,
            postNumber: item.postnumer,
            municipality: item.sveitarfelag,
            municipalityNumber: item.sveitarfelagsnumer,
            country: item.land,
          } as RskCompanyAddress),
      ),
      relatedParty: company.tengdirAdilar?.map(
        (item) =>
          ({
            type: item.tegund,
            nationalId: item.kennitala,
            name: item.nafn,
          } as RskCompanyRelatedParty),
      ),
      lastUpdated: company.sidastUppfaert,
      link: company.link,
    }
  }
}
