import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getApplicantOverviewItems,
  getEmploymentInformationOverviewItems,
  getEducationOverviewItems,
  getPayoutOverviewItems,
  getEmploymentSearchOverviewItems,
  getEducationHistoryOverviewItems,
  getLicenseOverviewItems,
  getLanguageOverviewItems,
  getEURESOverviewItems,
  getResumeOverviewItems,
} from '../../utils/getOverviewItems'
import { overview as overviewMessages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overviewMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overviewMessages.general.pageTitle,
      description: overviewMessages.general.pageDescription,
      children: [
        buildDescriptionField({
          id: 'overviewDescription',
          title: overviewMessages.general.firstSectionTitle,
          titleVariant: 'h3',
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'applicant',
          bottomLine: false,
          items: getApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'reasonForJobSearchSubSection',
          bottomLine: false,
          items: getEmploymentInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'educationSection',
          bottomLine: false,
          items: getEducationOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'payoutInformationSubSection',
          bottomLine: false,
          items: getPayoutOverviewItems,
        }),
        buildDescriptionField({
          id: 'overviewDescription',
          title: overviewMessages.general.secondSectionTitle,
          titleVariant: 'h3',
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'jobWishesSubSection',
          bottomLine: false,
          items: getEmploymentSearchOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'educationHistorySubSection',
          bottomLine: false,
          items: getEducationHistoryOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'drivingLicenseSubSection',
          bottomLine: false,
          items: getLicenseOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'languageSkillsSubSection',
          bottomLine: false,
          items: getLanguageOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'euresJobSearchSubSection',
          bottomLine: false,
          items: getEURESOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'resumeSubSection',
          bottomLine: false,
          items: getResumeOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
