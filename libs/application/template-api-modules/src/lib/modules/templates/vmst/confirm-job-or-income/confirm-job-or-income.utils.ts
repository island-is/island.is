type Entry = Record<string, string> & {
  company?: { nationalId: string; name: string }
}

export const buildIrregularJobRequest = (
  entry: Entry,
  applicantId: string,
) => ({
  applicantId,
  galdurExternalDomainRequestsIncomeCreateIrregularJobRequest: {
    employerSSN: entry.company?.nationalId?.replace('-', ''),
    periodFrom: entry.monthFrom ? new Date(entry.monthFrom) : undefined,
    periodTo: entry.monthTo ? new Date(entry.monthTo) : undefined,
    estimatedIncome: entry.estimatedIncome
      ? Number(entry.estimatedIncome)
      : undefined,
  },
})

export const buildPartTimeJobRequest = (entry: Entry, applicantId: string) => ({
  applicantId,
  galdurExternalDomainRequestsIncomeCreatePartTimeJobRequest: {
    employerSSN: entry.company?.nationalId?.replace('-', ''),
    periodFrom: entry.jobStart ? new Date(entry.jobStart) : undefined,
    ratio: entry.workPercentage ? Number(entry.workPercentage) : undefined,
    estimatedIncome: entry.estimatedIncome
      ? Number(entry.estimatedIncome)
      : undefined,
  },
})

export const buildContractorJobRequest = (
  entry: Entry,
  applicantId: string,
) => ({
  applicantId,
  galdurExternalDomainRequestsIncomeCreateContractorJobRequest: {
    periodFrom: entry.contractJobStart
      ? new Date(entry.contractJobStart)
      : undefined,
    periodTo: entry.workEnds ? new Date(entry.workEnds) : undefined,
  },
})

export const buildCapitalIncomePaymentRequest = (
  entry: Entry,
  applicantId: string,
) => ({
  applicantId,
  galdurExternalDomainRequestsIncomeCreateCapitalIncomePaymentRequest: {
    incomeTypeId: entry.paymentType,
    estimatedIncome: entry.amountPerMonth
      ? Number(entry.amountPerMonth)
      : undefined,
    periodFrom: entry.periodFrom ? new Date(entry.periodFrom) : undefined,
    periodTo: entry.paymentFrequency === 'oneTime' ? null : undefined,
  },
})

export const buildTRPaymentRequest = (entry: Entry, applicantId: string) => ({
  applicantId,
  galdurExternalDomainRequestsIncomeCreateTRPaymentRequest: {
    typeId: entry.socialPaymentType,
    estimatedIncome: entry.amountPerMonth
      ? Number(entry.amountPerMonth)
      : undefined,
    periodFrom: entry.periodFrom ? new Date(entry.periodFrom) : undefined,
    periodTo: entry.paymentFrequency === 'oneTime' ? null : undefined,
  },
})

export const buildPensionPaymentRequest = (
  entry: Entry,
  applicantId: string,
) => ({
  applicantId,
  galdurExternalDomainRequestsIncomeCreatePensionPaymentRequest: {
    typeId: entry.pensionType,
    pensionFundId: entry.pensionFund,
    estimatedIncome: entry.amountPerMonth
      ? Number(entry.amountPerMonth)
      : undefined,
  },
})
