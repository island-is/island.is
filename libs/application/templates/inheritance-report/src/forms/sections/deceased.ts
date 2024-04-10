import {
  buildDescriptionField,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { getEstateDataFromApplication } from '../../lib/utils/helpers'
import { NO, YES } from '../../lib/constants'

export const deceased = buildSection({
  id: 'deceasedInfo',
  title: m.irSubmitTitle,
  children: [
    buildMultiField({
      id: 'deceasedInfo',
      title: m.irSubmitTitle,
      description: m.irSubmitSubtitle,
      children: [
        buildKeyValueField({
          label: m.nameOfTheDeceased,
          value: (application) =>
            getEstateDataFromApplication(application)?.inheritanceReportInfo
              ?.nameOfDeceased ?? '',
          width: 'half',
        }),
        buildKeyValueField({
          label: m.nationalId,
          value: (application) =>
            getEstateDataFromApplication(application)?.inheritanceReportInfo
              ?.nationalId ?? '',
          width: 'half',
        }),
        buildDescriptionField({
          id: 'space1',
          space: 'gutter',
          title: '',
        }),
        buildKeyValueField({
          label: m.address,
          value: (application) =>
            getEstateDataFromApplication(application)?.inheritanceReportInfo
              ?.addressOfDeceased ?? '',
          width: 'half',
        }),
        buildKeyValueField({
          label: m.deathDate,
          value: (application) => {
            const date =
              getEstateDataFromApplication(application)?.inheritanceReportInfo
                ?.dateOfDeath

            return date
              ? format(new Date(date), 'dd.MM.yyyy')
              : m.deathDateNotRegistered
          },
          width: 'half',
        }),
        buildDescriptionField({
          id: 'space2',
          space: 'gutter',
          title: '',
        }),
        buildRadioField({
          id: 'deceasedWasMarried',
          title: m.wasInCohabitation,
          largeButtons: false,
          backgroundColor: 'white',
          width: 'half',
          options: [
            { value: YES, label: m.yes },
            { value: NO, label: m.no },
          ],
        }),
        buildDescriptionField({
          id: 'space3',
          space: 'gutter',
          title: '',
        }),
        buildRadioField({
          id: 'deceasedHadAssets',
          title: m.hadSeparateProperty,
          largeButtons: false,
          backgroundColor: 'white',
          width: 'half',
          condition: (answers) =>
            getValueViaPath(answers, 'deceasedWasMarried') === YES,
          options: [
            { value: YES, label: m.yes },
            { value: NO, label: m.no },
          ],
        }),
      ],
    }),
  ],
})
