import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicantChildCustodyInformation,
  ExternalData,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { ApproveOptions, ChildrenSchoolInfo, TaxData } from '../../lib/types'
import { Routes } from '../../lib/constants'
import {
  Aid,
  ChildrenAid,
  DirectTaxPayment,
  HomeCircumstances,
  PersonalTaxReturn,
} from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'

export const getSpouseSummaryConstants = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const nationalId =
    (getValueViaPath(externalData, 'nationalRegistrySpouse.data.nationalId') as
      | string
      | undefined) ||
    (getValueViaPath(answers, 'relationshipStatus.spouseNationalId') as
      | string
      | undefined)

  const data = getValueViaPath(externalData, 'nationalRegistrySpouse.data') as
    | NationalRegistryIndividual
    | undefined

  const taxData = getValueViaPath<TaxData>(externalData, 'taxDataSpouse.data')

  const sposeEmail = getValueViaPath<string>(answers, 'spouseContactInfo.email')

  const sposePhone = getValueViaPath<string>(answers, 'spouseContactInfo.phone')

  const spouseIncomeType = getValueViaPath<ApproveOptions>(
    answers,
    'spouseIncome.type',
  )

  const route =
    spouseIncomeType === ApproveOptions.Yes
      ? Routes.SPOUSEINCOMEFILES
      : Routes.SPOUSETAXRETURNFILES

  const personalTaxReturn = getValueViaPath<PersonalTaxReturn>(
    externalData,
    'taxDataSpouse.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
  )

  const directTaxPayments = getValueViaPath<Array<DirectTaxPayment>>(
    externalData,
    'taxDataSpouse.data.municipalitiesDirectTaxPayments.directTaxPayments',
  )

  const fetchDate = getValueViaPath<string>(
    externalData,
    'nationalRegistry?.date',
  )

  const spouseTaxReturnFiles = getValueViaPath<Array<UploadFile>>(
    answers,
    'spouseTaxReturnFiles',
  )

  const spouseFormComment = getValueViaPath<string>(
    answers,
    'spouseFormComment',
  )

  const spouseIncomeFiles = getValueViaPath<Array<UploadFile>>(
    answers,
    'spouseIncomeFiles',
  )

  return {
    nationalId,
    data,
    taxData,
    sposeEmail,
    sposePhone,
    route,
    personalTaxReturn,
    directTaxPayments,
    fetchDate,
    spouseTaxReturnFiles,
    spouseFormComment,
    spouseIncomeFiles,
  }
}

export const getSummaryConstants = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const homeCircumstances = getValueViaPath<HomeCircumstances>(
    answers,
    'homeCircumstances.type',
  )

  const individualAid = getValueViaPath<Aid>(
    externalData,
    'municipality.data.individualAid',
  )

  const cohabitationAid = getValueViaPath<Aid>(
    externalData,
    'municipality.data.cohabitationAid',
  )
  const childrenSchoolInfo = getValueViaPath<Array<ChildrenSchoolInfo>>(
    answers,
    'childrenSchoolInfo',
  )

  const municipalitiesDirectTaxPaymentsSuccess = getValueViaPath<boolean>(
    externalData,
    'taxData.data.municipalitiesDirectTaxPayments.success',
  )

  const municipalitiesDirectTaxPayments = getValueViaPath<
    Array<DirectTaxPayment>
  >(
    externalData,
    'taxData.data.municipalitiesDirectTaxPayments.directTaxPayments',
  )

  const fetchDate = getValueViaPath<string>(
    externalData,
    'nationalRegistry.date',
  )

  const personalTaxReturn = getValueViaPath<UploadFile>(
    externalData,
    'taxData.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
  )

  const personalTaxCreditType = getValueViaPath<ApproveOptions>(
    answers,
    'personalTaxCredit.type',
  )

  const childrenCustodyData = getValueViaPath<
    Array<ApplicantChildCustodyInformation>
  >(externalData, 'childrenCustodyInformation.data')

  const childrenAid = getValueViaPath<ChildrenAid>(
    externalData,
    'municipality.data.childrenAid',
  )

  const nationalRegistryData = getValueViaPath<NationalRegistryIndividual>(
    externalData,
    'nationalRegistry.data',
  )

  return {
    homeCircumstances,
    individualAid,
    cohabitationAid,
    childrenSchoolInfo,
    municipalitiesDirectTaxPaymentsSuccess,
    municipalitiesDirectTaxPayments,
    fetchDate,
    personalTaxReturn,
    personalTaxCreditType,
    childrenCustodyData,
    childrenAid,
    nationalRegistryData,
  }
}
