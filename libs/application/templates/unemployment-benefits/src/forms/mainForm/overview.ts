import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  useApplicantOverviewItems,
  useEmploymentInformationOverviewItems,
  useEducationOverviewItems,
  usePayoutOverviewItems,
  useEmploymentSearchOverviewItems,
  useEducationHistoryOverviewItems,
  useLicenseOverviewItems,
  useLanguageOverviewItems,
  useEURESOverviewItems,
  useResumeOverviewItems,
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
          id: 'applicantOverview',
          title: '',
          backId: 'applicant',
          bottomLine: false,
          items: useApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'reasonForJobOverview',
          title: '',
          backId: 'reasonForJobSearchSubSection',
          bottomLine: false,
          items: useEmploymentInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'educationOverview',
          title: '',
          backId: 'educationSection',
          bottomLine: false,
          items: useEducationOverviewItems,
        }),
        buildOverviewField({
          id: 'payoutOverview',
          title: '',
          backId: 'payoutInformationSubSection',
          bottomLine: false,
          items: usePayoutOverviewItems,
        }),
        buildDescriptionField({
          id: 'overviewDescription',
          title: overviewMessages.general.secondSectionTitle,
          titleVariant: 'h3',
        }),
        buildOverviewField({
          id: 'jobWishesOverview',
          title: '',
          backId: 'jobWishesSubSection',
          bottomLine: false,
          items: useEmploymentSearchOverviewItems,
        }),
        buildOverviewField({
          id: 'educationHistoryOverview',
          title: '',
          backId: 'educationHistorySubSection',
          bottomLine: false,
          items: useEducationHistoryOverviewItems,
          hideIfEmpty: true,
        }),
        buildOverviewField({
          id: 'drivingLicenseOverview',
          title: '',
          backId: 'licensesSubSection',
          bottomLine: false,
          items: useLicenseOverviewItems,
          hideIfEmpty: true,
        }),
        buildOverviewField({
          id: 'languageSkillsOverview',
          title: '',
          backId: 'languageSkillsSubSection',
          bottomLine: false,
          items: useLanguageOverviewItems,
        }),
        buildOverviewField({
          id: 'euresJobSearchOverview',
          title: '',
          backId: 'euresJobSearchSubSection',
          bottomLine: false,
          items: useEURESOverviewItems,
        }),
        buildOverviewField({
          id: 'resumeOverview',
          title: '',
          backId: 'resumeSubSection',
          bottomLine: false,
          items: useResumeOverviewItems,
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: overviewMessages.general.submitButtonText,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
