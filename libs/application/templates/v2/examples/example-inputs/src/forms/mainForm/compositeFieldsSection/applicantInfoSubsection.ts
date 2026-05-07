import type { SectionBuilder } from '@island.is/application/core'
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
        applicantInformationPage.id ?? 'applicant',
        applicantInformationPage.title ?? '',
        (page) => {
          page
            .setDescription(applicantInformationPage.description)
            .addFields(applicantInformationPage.children)
        },
      )
    },
  )
}
