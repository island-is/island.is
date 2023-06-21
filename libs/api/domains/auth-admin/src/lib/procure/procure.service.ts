import { Injectable } from '@nestjs/common'

import { ProcureCompany } from './model/company.model'
import { CompanyProcurers } from './model/company-procurers.model'

@Injectable()
export class ProcureService {
  /**
   * Search for procure companies by name or national id
   */
  async getCompanies(search: string): Promise<ProcureCompany[]> {
    console.log('search', search)
    return [
      {
        name: 'Fyrirtæki ehf.',
        nationalId: '5501690339',
      },
      {
        name: 'Company ltd.',
        nationalId: '9871485376',
      },
      {
        name: 'Kennitala ehf.',
        nationalId: '1122446688',
      },
    ]
  }

  async searchCompanyProcurers(nationalId: string): Promise<CompanyProcurers> {
    return {
      name: 'Fyrirtæki ehf.',
      nationalId: '5501690339',
      procurers: [
        {
          name: 'Guðmundur Guðmundsson',
          nationalId: '0101302989',
        },
        {
          name: 'Jón Jónsson',
          nationalId: '0201302989',
        },
        {
          name: 'María Guðmundsdóttir',
          nationalId: '0301302989',
        },
      ],
    }
  }
}
