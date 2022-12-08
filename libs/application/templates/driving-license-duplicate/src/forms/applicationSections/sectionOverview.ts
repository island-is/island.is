import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { CurrentLicenseProviderResult } from '../../dataProviders/CurrentLicenseProvider'
import format from 'date-fns/format'

export const sectionOverview = buildSection({
  id: 'overview',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewTitle,
      space: 1,
      description: m.overviewSectionDescription,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.informationTitle',
          title: m.informationTitle,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.applicantsName,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildKeyValueField({
          label: m.applicantsNationalId,
          width: 'half',
          value: (application: Application) =>
            formatNationalId(application.applicant),
        }),

        buildKeyValueField({
          label: m.rights,
          width: 'half',
          value: 'Almenn ökuréttindi',
        }),
        buildKeyValueField({
          label: m.overviewLicenseExpires,
          width: 'half',
          value: ({ externalData: { currentLicense } }) =>
            format(
              new Date(
                (currentLicense.data as CurrentLicenseProviderResult).expires,
              ),
              'dd.MM.yyyy',
            ),
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.signatureTitle',
          title: m.signature,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qsignatureOverview',
          title: '',
          component: 'QualitySignature',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.imageTitle',
          title: m.image,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qphotoOverview',
          title: '',
          component: 'QualityPhoto',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.deliveryTitle',
          title: m.deliveryMethodSectionTitle,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: ({ answers: { district } }) => {
            return `${district}`
          },
        }),
      ],
    }),
  ],
})
