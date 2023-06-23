import { Injectable } from '@nestjs/common'

import { ProcureCompany } from './model/company.model'
import { CompanyProcurers } from './model/company-procurers.model'

@Injectable()
export class ProcureService {
  /**
   * Search for procure companies by name or national id
   */
  async getCompanies(search: string): Promise<ProcureCompany[]> {
    const mock = [
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

    return mock.filter((company) => {
      return (
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.nationalId.includes(search)
      )
    })
  }

  async searchCompanyProcurers(
    nationalId: string,
  ): Promise<CompanyProcurers | null> {
    if (nationalId === '11111111111') {
      return null
    }

    return {
      name: 'Fyrirtæki ehf.',
      nationalId: nationalId,
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
