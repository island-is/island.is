import {
  Gender,
  PERIOD_ONE_MONTH,
  type ApplicationAnswers as SalaryReportAnswers,
} from '@island.is/application/templates/directorate-of-equality/salary-report'
import type {
  ParsedReportDto,
  SubmitSalaryReportDto,
} from '@island.is/clients/directorate-of-equality'

const companyAdminGenderMap: Record<Gender, 'MALE' | 'FEMALE' | 'NEUTRAL'> = {
  [Gender.MALE]: 'MALE',
  [Gender.FEMALE]: 'FEMALE',
  [Gender.NON_BINARY]: 'NEUTRAL',
}

const mapGender = (gender?: string): 'MALE' | 'FEMALE' | 'NEUTRAL' =>
  companyAdminGenderMap[gender as Gender] ?? 'NEUTRAL'

export const mapAnswersToSalaryReportSubmission = ({
  answers,
  equalityReportId,
  identifier,
  importedFromExcel,
  parsed,
}: {
  answers: SalaryReportAnswers
  equalityReportId: string
  identifier: string
  importedFromExcel: boolean
  parsed: ParsedReportDto
}): SubmitSalaryReportDto => {
  const subsidiaryList = answers.subsidiaries?.list ?? []
  const outliersPostponed =
    answers.salaryAnalysis?.postponed?.includes('yes') ?? false
  const salaryDataBasis =
    answers.period?.period === PERIOD_ONE_MONTH ? 'MONTH' : 'AVERAGE'
  const salaryDataPeriod =
    salaryDataBasis === 'MONTH' && answers.period?.year && answers.period.month
      ? `${answers.period.year}-${answers.period.month.padStart(2, '0')}-01`
      : null

  return {
    equalityReportId,
    importedFromExcel,
    providerId: identifier,
    companyAdminName: answers.chiefExecutive?.name ?? '',
    companyAdminEmail: answers.chiefExecutive?.email ?? '',
    companyAdminGender: mapGender(answers.chiefExecutive?.gender),
    contactName: answers.contactPerson?.name ?? '',
    contactEmail: answers.contactPerson?.email ?? '',
    contactPhone: answers.contactPerson?.phone ?? '',
    averageEmployeeMaleCount: Number(answers.employeeCount?.men) || 0,
    averageEmployeeFemaleCount: Number(answers.employeeCount?.women) || 0,
    averageEmployeeNeutralCount: Number(answers.employeeCount?.nonBinary) || 0,
    salaryDataBasis,
    salaryDataPeriod,
    parsed,
    company: {
      name: answers.generalInformation?.companyName ?? '',
      nationalId: answers.generalInformation?.nationalId ?? '',
      address: answers.generalInformation?.address ?? '',
      city: answers.generalInformation?.municipality ?? '',
      postcode: answers.generalInformation?.postalCode ?? '',
      isatCategory: answers.generalInformation?.isatClassification ?? '',
    },
    subsidiaries:
      answers.subsidiaries?.includesSubsidiaries === 'yes'
        ? subsidiaryList.map((s) => ({
            name: s.nationalIdWithName.name,
            nationalId: s.nationalIdWithName.nationalId,
          }))
        : [],
    outliersPostponed,
    outlierGroups: outliersPostponed
      ? []
      : (answers.salaryAnalysis?.outlierGroups ?? [])
          .filter((g) => g.employeeOrdinals.length > 0)
          .map((g) => ({
            reason: g.reason ?? '',
            action: g.action ?? '',
            signatureName: g.signatureName ?? '',
            signatureRole: g.signatureRole ?? '',
            employeeOrdinals: g.employeeOrdinals,
          })),
  }
}
