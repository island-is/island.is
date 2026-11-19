import type { SectionBuilder } from '@island.is/application/core'

export const addNationalIdWithNameSubsection = (
  section: SectionBuilder,
): SectionBuilder => {
  return section.addSubSection(
    'nationalIdWithNameSubsection',
    'National ID with name subsection',
    (subSection) => {
      subSection.addPage(
        'nationalIdWithNameMultiField',
        'National ID with name',
        (page) => {
          page
            .addDescriptionField('nationalIdWithNameDescription', '', {
              description:
                'Lookup name by national ID. It is also possible to search for companies. This field also offers email and phone number.',
              marginBottom: 4,
            })
            .addNationalIdWithNameField(
              'nationalIdWithNameField1',
              'Lookup name of a person by national ID',
              {
                searchPersons: true,
                marginBottom: 4,
                doesNotRequireAnswer: true,
              },
            )
            .addNationalIdWithNameField(
              'nationalIdWithNameField2',
              'Lookup name of a person or company by national ID',
              {
                searchPersons: true,
                searchCompanies: true,
                marginBottom: 4,
                doesNotRequireAnswer: true,
              },
            )
            .addNationalIdWithNameField(
              'nationalIdWithNameField3',
              'Lookup name of a person and include email and phone number',
              {
                showEmailField: true,
                showPhoneField: true,
                doesNotRequireAnswer: true,
              },
            )
        },
      )
    },
  )
}
