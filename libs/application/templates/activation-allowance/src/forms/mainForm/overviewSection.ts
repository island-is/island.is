import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  getApplicantOverviewItems,
  getContactOverviewItems,
  getPaymentOverviewItems,
  getJobWishesOverviewItems,
  getJobHistoryOverviewItems,
  getAcademicBackgroundOverviewItems,
  getDrivingLicensesOverviewItems,
  getLanguageSkillsOverviewItems,
  getCVData,
  getCVText,
} from '../../utils/getOverviewItems'
import { FormValue } from '@island.is/application/types'
import { EducationAnswer, JobHistoryAnswer } from '../../lib/dataSchema'
import { hasCv } from '../../utils/hasCv'
import { overview } from '../../lib/messages/overview'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewSection',
      title: overview.general.sectionTitle,
      children: [
        buildOverviewField({
          id: 'overview.applicant',
          backId: 'applicantMultiField',
          items: getApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.paymentInfo',
          backId: 'paymentInformationMultiField',
          items: getPaymentOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.contact',
          backId: 'contact',
          items: getContactOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.jobWishes',
          backId: 'jobWishesMultiField',
          items: getJobWishesOverviewItems,
          condition: (formValue: FormValue) => {
            const jobWishes =
              getValueViaPath<string[]>(formValue, 'jobWishes.jobs', []) ?? []

            return jobWishes.length > 0
          },
        }),
        buildOverviewField({
          id: 'overview.jobHistory',
          backId: 'jobHistoryMultiField',
          items: getJobHistoryOverviewItems,
          condition: (formValue: FormValue) => {
            const jobHistory =
              getValueViaPath<JobHistoryAnswer[]>(
                formValue,
                'jobHistory',
                [],
              ) ?? []

            return jobHistory.length > 0
          },
        }),
        buildOverviewField({
          id: 'overview.academicBackground',
          backId: 'academicBackgroundMultiField',
          items: getAcademicBackgroundOverviewItems,
          condition: (formValue: FormValue) => {
            const education =
              getValueViaPath<EducationAnswer>(formValue, 'academicBackground')
                ?.education ?? []
            return education.length > 0
          },
        }),
        buildOverviewField({
          id: 'overview.drivingLicenses',
          backId: 'drivingLicensesMultiField',
          items: getDrivingLicensesOverviewItems,
          condition: (formValue: FormValue) => {
            const hasDrivingLicense =
              getValueViaPath<Array<string>>(
                formValue,
                'drivingLicense.hasDrivingLicense',
              ) || []
            const hasHeavyMachineryLicense =
              getValueViaPath<Array<string>>(
                formValue,
                'drivingLicense.hasHeavyMachineryLicense',
              ) || []

            return hasDrivingLicense
              .concat(hasHeavyMachineryLicense)
              .includes(YES)
          },
        }),
        buildOverviewField({
          id: 'overview.languageSkills',
          backId: 'languageSkillsMultiField',
          items: getLanguageSkillsOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.cv',
          backId: 'cvMultiField',
          items: getCVText,
          attachments: getCVData,
          condition: hasCv,
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
