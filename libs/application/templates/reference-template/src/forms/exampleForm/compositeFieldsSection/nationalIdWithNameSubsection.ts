import {
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSubSection,
} from '@island.is/application/core'

export const nationalIdWithNameSubsection = buildSubSection({
  id: 'nationalIdWithNameSubsection',
  title: 'National ID with name subsection',
  children: [
    buildMultiField({
      id: 'nationalIdWithNameMultiField',
      title: 'National ID with name',
      children: [
        buildDescriptionField({
          id: 'nationalIdWithNameDescription',
          title: '',
          description:
            'This is field searches for a name by national ID. By default it searches for persons but can also be configured to search for companies. On dev the endpoint for persons works for Gervimenn, Gervifyrirtæki and real persons, the dev endpoint for comanies works only for Gervifyrirtæki.',
          marginBottom: 6,
        }),
        buildNationalIdWithNameField({
          id: 'searchPersons',
          title: 'Search persons',
          marginBottom: 6,
        }),
        buildNationalIdWithNameField({
          id: 'searchCompanies',
          title: 'Search companies (500510-1370 is 65° Arctic)',
          searchCompanies: true,
          searchPersons: false,
          marginBottom: 6,
        }),
        buildNationalIdWithNameField({
          id: 'searchBoth',
          title: 'Search both',
          searchCompanies: true,
          searchPersons: true,
        }),
      ],
    }),
  ],
})
