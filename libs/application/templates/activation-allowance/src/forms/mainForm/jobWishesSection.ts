import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { jobWishes } from '../../lib/messages'
import { Application, Field } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'
import { isValidJob } from '../../utils/isValidJobCode'

export const jobWishesSection = buildSection({
  id: 'jobWishesSection',
  title: jobWishes.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'jobWishesMultiField',
      title: jobWishes.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'jobWishes.description',
          title: jobWishes.labels.whatKindOfJob,
          description: jobWishes.labels.escoInfo,
          titleVariant: 'h5',
          marginBottom: 0,
        }),
        buildSelectField({
          id: 'jobWishes.jobs',
          title: jobWishes.labels.jobs,
          isMulti: true,
          doesNotRequireAnswer: true,
          options: (
            application: Application,
            _field: Field,
            locale: Locale,
          ) => {
            const escoJobs = getValueViaPath<
              GaldurDomainModelsSettingsJobCodesJobCodeDTO[]
            >(
              application.externalData,
              'activityGrantApplication.data.activationGrant.supportData.jobCodes',
            )

            return (escoJobs ?? []).filter(isValidJob).map((job) => {
              const label = locale === 'is' ? job.name : job.english
              const value = job.id
              return { value, label }
            })
          },
        }),
      ],
    }),
  ],
})
