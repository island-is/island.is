import { SubSectionBuilder } from '@island.is/application/core'

export const companySearchSubsection = new SubSectionBuilder(
  'companySearchSubsection',
  'Company Search Subsection',
)
  .addPage('companySearchMultiField', 'Company Search MultiField', (page) => {
    page
      .addCompanySearchField('companySearch', 'Company Search', {
        placeholder: 'Search for a company',
        doesNotRequireAnswer: true,
      })
      .addCompanySearchField(
        'companySearchShouldIncludeIsatNumber',
        'Company Search Should include ISAT number',
        {
          shouldIncludeIsatNumber: true,
          doesNotRequireAnswer: true,
        },
      )
      .addCompanySearchField(
        'companySearchCheckIfEmployerIsOnForbiddenList',
        'Company Search Check if employer is on forbidden list',
        {
          checkIfEmployerIsOnForbiddenList: true,
          doesNotRequireAnswer: true,
        },
      )
  })
  .build()
