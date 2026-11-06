import type { SectionBuilder } from '@island.is/application/core'

export const addBankAccountSubsection = (
  section: SectionBuilder,
): SectionBuilder => {
  return section.addSubSection(
    'bankAccountSubSection',
    'Bank account',
    (subSection) => {
      subSection.addBankAccountField('bankAccountfield', 'Bank account field')
    },
  )
}
