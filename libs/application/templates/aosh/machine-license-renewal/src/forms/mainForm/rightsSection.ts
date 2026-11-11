import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
} from '@island.is/application/core'
import { rights } from '../../lib/messages'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import {
  formatRightName,
  getValidToDescription,
} from '../../utils/machineLicenseRights'

export const rightsSection = buildSection({
  id: 'rightsSection',
  title: rights.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'rights',
      title: rights.general.title,
      description: rights.general.description,
      children: [
        buildDescriptionField({
          id: 'rights.licenseNumber',
          title: (application) => ({
            ...rights.labels.licenseNumber,
            values: {
              licenseNumber:
                getApplicationExternalData(application.externalData)
                  .machineLicenseRights?.licenseNumber ?? '',
            },
          }),
          titleVariant: 'h4',
        }),
        buildStaticTableField({
          title: rights.labels.renewableRightsTitle,
          description: (application) =>
            getValidToDescription(
              getApplicationExternalData(application.externalData)
                .machineLicenseRights?.renewableRights ?? [],
            ),
          marginTop: 4,
          header: [rights.labels.right],
          rows: (application) =>
            (
              getApplicationExternalData(application.externalData)
                .machineLicenseRights?.renewableRights ?? []
            ).map((right) => [formatRightName(right)]),
        }),
        buildStaticTableField({
          title: rights.labels.otherRightsTitle,
          description: (application) =>
            getValidToDescription(
              getApplicationExternalData(application.externalData)
                .machineLicenseRights?.otherRights ?? [],
            ),
          marginTop: 4,
          header: [rights.labels.right],
          rows: (application) =>
            (
              getApplicationExternalData(application.externalData)
                .machineLicenseRights?.otherRights ?? []
            ).map((right) => [formatRightName(right)]),
        }),
      ],
    }),
  ],
})
