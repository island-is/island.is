import { range } from 'lodash'
import { CalculationConstants } from '../entities/directorate-of-labour-constants'
import { education } from '../utils/mock-db-education'
import { jobs } from '../utils/mock-db-jobs'
import { mockAsync } from '../utils/service-utils'

export class DirectorateOfLabourService {
  public getServiceCenters: () => Promise<string[]> = async () => {
    return mockAsync([
      'Austurland',
      'Höfuðborgarsvæðið',
      'Norðurland eystra',
      'Norðurland vestra',
      'Suðurland',
      'Suðurnes',
      'Vestfirðir',
      'Vesturland',
    ])
  }

  public getCountryRegions: () => Promise<string[]> = async () => {
    return mockAsync([
      'Austurland',
      'Höfuðborgarsvæðið',
      'Norðurland eystra',
      'Norðurland vestra',
      'Suðurland',
      'Suðurnes',
      'Vestfirðir',
      'Vesturland',
    ])
  }

  // TODO: FIX any
  public getRecognizedJobs: () => Promise<any[]> = async () => {
    return mockAsync(jobs)
  }

  // TODO: FIX any
  public getRecognizedEducation: () => Promise<any[]> = async () => {
    return mockAsync(education)
  }

  public getUniversityEducationLevels: () => Promise<string[]> = async () => {
    return mockAsync([
      'Phd',
      'MS',
      'MPM',
      'MPA',
      'ML',
      'MHRM',
      'MBA',
      'MAcc',
      'MA',
      'M.ed',
      'Diploma',
      'BS',
      'BA',
      'B.ed',
    ])
  }

  public getSelectableYears: () => Promise<string[]> = async () => {
    // TODO: Test
    return mockAsync(range(2021, 1962, -1).map((num) => num.toString()))
  }

  public getInsurancePaymentTypes: () => Promise<string[]> = async () => {
    return mockAsync(['Ellilífeyrir', 'Örorkulífeyrir', 'Örorkustyrkur'])
  }

  public getRecognizedPensionFunds: () => Promise<string[]> = async () => {
    return mockAsync([
      'Almenni lífeyrissjóðurinn',
      'Birta Lífeyrissjóður',
      'Brú Lýfeyrissjóður starfssveit',
      'Eftirlaunasjóður atvinnuflugmanna',
      'Lífeyrissjóður Vestmanneyinga',
      'Söfnunarsjóður lífeyrisréttinda',
    ])
  }

  public getRecognizedPersonalPensionSavingsFunds: () => Promise<
    string[]
  > = async () => {
    return mockAsync([
      'Allianz Ísland hf söluumboð',
      'Almenni lífeyrissjóðurinn',
      'Festa - Lífeyrissjóður',
      'Gildi - Lífeyrissjóður',
      'Lífeyrissjóður Vestmanneyinga',
      'Lífeyrisauki Arionbanki',
      'Viðbótarlífeyrissparnaður Byrs',
    ])
  }

  public getPersonalPensionSavingsFundLevels: () => Promise<
    string[]
  > = async () => {
    return mockAsync(range(1, 4).map((num) => `${num}%`))
  }

  public getPensionFundPaymentTypes: () => Promise<string[]> = async () => {
    return mockAsync([
      'Lífsj. ELlilífeyrir',
      'Lífsj. Örorkulífeyrir',
      'Lífsj. Örorkustyrkur',
      'Lífsj. Makalífeyrir',
    ])
  }

  public getReasonForUnEmployment: () => Promise<string[]> = async () => {
    return mockAsync(['Uppsögn vegna samdráttar', 'Gjaldþrot atvinnurekanda'])
  }

  public getCircumstancesForUnEmployment: () => Promise<
    string[]
  > = async () => {
    return mockAsync(['Var sagt upp', 'Var í tímabundinni ráðningu'])
  }

  public getUnemploymentConstants: () => Promise<CalculationConstants> = async () => {
    return mockAsync({
      BaseAmount: 307.43, // GrU
      MaximumSalaryConnectedConnected: 472.835, // MaxTekjTeng
      PercentOfSalary: 0.7, // PrTekjTeng
      PercentOfParentalLeaveOnBaseUnemploymentBenefits: 0.06, //PrBbGr
      PercentOfParentalLeaveOnPayConnectedBenefits: 0.04, // PrBbTekjuTeng
      MaximumUnaffectedSalary: 71262, // FriTekjMark
    })
  }
}
