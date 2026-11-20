import {
  buildDescriptionField,
  buildInteractiveTableField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { rights } from '../../lib/messages'
import { hasOtherRights } from '../../utils/conditions'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import {
  formatDate,
  formatRightName,
  getOtherRights,
  getRenewableRights,
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
                  .workMachineLicense?.licenseNumber ?? '',
            },
          }),
          titleVariant: 'h4',
        }),
        buildInteractiveTableField({
          id: 'rights.renewableRights',
          title: rights.labels.renewableRightsTitle,
          marginTop: 4,
          header: [rights.labels.right, rights.labels.validTo],
          rows: (application, _field, locale) =>
            getRenewableRights(
              getApplicationExternalData(application.externalData)
                .workMachineLicense,
            ).map((right) => [
              formatRightName(right, locale),
              right.validUntil ? formatDate(right.validUntil) : '',
            ]),
        }),
        buildInteractiveTableField({
          id: 'rights.otherRights',
          title: rights.labels.otherRightsTitle,
          condition: hasOtherRights,
          marginTop: 4,
          header: [rights.labels.right, rights.labels.validTo],
          rows: (application, _field, locale) =>
            getOtherRights(
              getApplicationExternalData(application.externalData)
                .workMachineLicense,
            ).map((right) => [
              formatRightName(right, locale),
              right.validUntil ? formatDate(right.validUntil) : '',
            ]),
        }),
      ],
    }),
  ],
})
