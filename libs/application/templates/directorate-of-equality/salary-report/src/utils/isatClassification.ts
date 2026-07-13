type VatEntry = {
  dateOfDeregistration?: Date | null
  classification?: Array<{
    number?: string
    name?: string
  }>
}

export const getIsatClassification = (vat: VatEntry[]): string => {
  const activeVat = vat.find((item) => !item.dateOfDeregistration)
  const classification = activeVat?.classification?.[0]
  if (!classification?.number) return 'Óþekkt'
  return classification.number
}
