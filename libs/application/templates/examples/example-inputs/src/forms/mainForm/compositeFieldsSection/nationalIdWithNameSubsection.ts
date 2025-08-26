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
          description:
            'Lookup name by national ID. It is also possible to search for companies. This field also offers email and phone number.',
          marginBottom: 4,
        }),
        buildNationalIdWithNameField({
          id: 'nationalIdWithNameField1',
          title: 'Lookup name of a person by national ID',
          searchPersons: true,
          marginBottom: 4,
        }),
        buildNationalIdWithNameField({
          id: 'nationalIdWithNameField2',
          title: 'Lookup name of a person or company by national ID',
          searchPersons: true,
          searchCompanies: true,
          marginBottom: 4,
        }),
        buildNationalIdWithNameField({
          id: 'nationalIdWithNameField3',
          title: 'Lookup name of a person and include email and phone number',
          showEmailField: true,
          showPhoneField: true,
        }),
      ],
    }),
  ],
})
