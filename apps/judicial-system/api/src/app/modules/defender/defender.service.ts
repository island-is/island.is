import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import fetch from 'isomorphic-fetch'
import { defenderModuleConfig } from './defender.config'

@Injectable()
export class DefenderService {
  constructor(
    @Inject(defenderModuleConfig.KEY)
    private readonly config: ConfigType<typeof defenderModuleConfig>,
  ) {}

  async getLawyers(): Promise<Lawyer[]> {
    const response = await fetch(`${this.config.lawyerRegistryAPI}/lawyers`, {
      headers: {
        Authorization: `Basic  ${this.config.lawyerRegistryAPIKey}`,
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      const lawyers = await response.json()
      const lawyersMapped = (lawyers || []).map(mapToLawyer)
      return lawyersMapped
    }

    const reason = await response.text()
    console.error('Failed to get lawyers:', reason)
    throw new Error(reason)
  }

  async getLawyer(nationalId: string): Promise<Lawyer> {
    const response = await fetch(
      `${this.config.lawyerRegistryAPI}/lawyer/${nationalId}`,
      {
        headers: {
          Authorization: `Basic ${this.config.lawyerRegistryAPIKey}`,
          Accept: 'application/json',
        },
      },
    )

    if (response.ok) {
      const lawyer = await response.json()
      const lawyerMapped = {
        ...mapToLawyer(lawyer),
      }
      return lawyerMapped
    }

    const reason = await response.text()
    console.error('Failed to get lawyer:', reason)
    throw new Error(reason)
  }
}

const mapToLawyer = (lawyer: LawyerFull): Lawyer => {
    return {
        name: lawyer.Name,
        practice: lawyer.Practice,
        email: lawyer.Email,
        phoneNr: lawyer.GSM,
        nationalId: lawyer.SSN,
    }
}


interface Lawyer {
  name: string
  practice: string
  email: string
  phoneNr: string
  nationalId: string
}

type LawyerFull = {
  Id: number
  Name: string
  Title: string
  Phone: string
  Address: string
  City: string
  PostNumber: string
  Email: string
  Practice: string
  Education: string
  WebPage: string
  CaseCategories: []
  FirstName: string
  MiddleName: string
  SurName: string
  SSN: string
  MailBox: string
  Fax: string
  GSM: string
  HomePhone: string
  DirectPhone: string
  NonIcelandicPhone: string
  PracticeResponsible: string
  LawyerRepresentative: string
  Sex: string
  HdlLicense: string | null
  HrlLicense: string | null
  Insurance: string
  Country: string
  IsPracticing: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Languages: null | any
  InternationConnection: string
}
