import type { SectionBuilder } from '@island.is/application/core'
import type { FormText } from '@island.is/application/types'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

export const addApplicantInfoSubsection = (
  section: SectionBuilder,
): SectionBuilder => {
  const applicantInformationPage = applicantInformationMultiField()

  return section.addSubSection(
    'applicantInfoSubsection',
    'Applicant Info Subsection',
    (subSection) => {
      // Common form, fills automatically with applicant information.
      subSection.addPage(
        typeof applicantInformationPage.id === 'string'
          ? applicantInformationPage.id
          : 'applicant',
        (applicantInformationPage.title ?? '') as FormText,
        (page) => {
          page
            .setDescription(applicantInformationPage.description)
            .addFields(applicantInformationPage.children)
        },
      )
    },
  )
}
