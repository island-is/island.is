import {
  ChiefExecutiveGender,
  type ApplicationAnswers as SalaryReportAnswers,
} from '@island.is/application/templates/directorate-of-equality/salary-report'
import type {
  ParsedReportDto,
  SubmitSalaryReportDto,
} from '@island.is/clients/directorate-of-equality'

const companyAdminGenderMap: Record<
  ChiefExecutiveGender,
  'MALE' | 'FEMALE' | 'NEUTRAL'
> = {
  [ChiefExecutiveGender.MALE]: 'MALE',
  [ChiefExecutiveGender.FEMALE]: 'FEMALE',
  [ChiefExecutiveGender.NON_BINARY]: 'NEUTRAL',
}

const mapChiefExecutiveGender = (
  gender?: string,
): 'MALE' | 'FEMALE' | 'NEUTRAL' =>
  companyAdminGenderMap[gender as ChiefExecutiveGender] ?? 'NEUTRAL'

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

  return {
    equalityReportId,
    identifier,
    importedFromExcel,
    providerId: identifier,
    companyAdminName: answers.chiefExecutive?.name ?? '',
    companyAdminEmail: answers.chiefExecutive?.email ?? '',
    companyAdminGender: mapChiefExecutiveGender(answers.chiefExecutive?.gender),
    contactName: answers.contactPerson?.name ?? '',
    contactEmail: answers.contactPerson?.email ?? '',
    contactPhone: answers.contactPerson?.phone ?? '',
    averageEmployeeMaleCount: Number(answers.employeeCount?.men) || 0,
    averageEmployeeFemaleCount: Number(answers.employeeCount?.women) || 0,
    averageEmployeeNeutralCount: Number(answers.employeeCount?.nonBinary) || 0,
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
            name: g.name,
            reason: g.reason ?? '',
            action: g.action ?? '',
            signatureName: g.signatureName ?? '',
            signatureRole: g.signatureRole ?? '',
            employeeOrdinals: g.employeeOrdinals,
          })),
  }
}
