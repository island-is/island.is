import {
  buildCompanySearchField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'

export const companySearchSubsection = buildSubSection({
  id: 'companySearchSubsection',
  title: 'Company Search Subsection',
  children: [
    buildMultiField({
      id: 'companySearchMultiField',
      title: 'Company Search MultiField',
      children: [
        buildCompanySearchField({
          id: 'companySearch',
          title: 'Company Search',
          placeholder: 'Search for a company',
        }),
        buildCompanySearchField({
          id: 'companySearchShouldIncludeIsatNumber',
          title: 'Company Search Should include ISAT number',
          shouldIncludeIsatNumber: true,
        }),
        buildCompanySearchField({
          id: 'companySearchCheckIfEmployerIsOnForbiddenList',
          title: 'Company Search Check if employer is on forbidden list',
          checkIfEmployerIsOnForbiddenList: true,
        }),
      ],
    }),
  ],
})
