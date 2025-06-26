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
          id: 'overview',
          title: '',
          backId: 'applicant',
          bottomLine: false,
          items: useApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'reasonForJobSearchSubSection',
          bottomLine: false,
          items: useEmploymentInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'educationSection',
          bottomLine: false,
          items: useEducationOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
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
          id: 'overview',
          title: '',
          backId: 'jobWishesSubSection',
          bottomLine: false,
          items: useEmploymentSearchOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'educationHistorySubSection',
          bottomLine: false,
          items: useEducationHistoryOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'drivingLicenseSubSection',
          bottomLine: false,
          items: useLicenseOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'languageSkillsSubSection',
          bottomLine: false,
          items: useLanguageOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
          title: '',
          backId: 'euresJobSearchSubSection',
          bottomLine: false,
          items: useEURESOverviewItems,
        }),
        buildOverviewField({
          id: 'overview',
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
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
