import {
  NO,
  YES,
  buildDescriptionField,
  buildKeyValueField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { getEstateDataFromApplication } from '../../lib/utils/helpers'
import { format as formatNationalId } from 'kennitala'

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
            formatNationalId(
              getEstateDataFromApplication(application)?.inheritanceReportInfo
                ?.nationalId ?? '',
            ),
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
          id: 'customShare.deceasedWasMarried',
          title: m.wasInCohabitation,
          largeButtons: false,
          backgroundColor: 'white',
          defaultValue: '',
          width: 'half',
          required: true,
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
          id: 'customShare.hasCustomSpouseSharePercentage',
          title: m.hasCustomSpouseSharePercentage,
          largeButtons: false,
          backgroundColor: 'white',
          width: 'half',
          required: true,
          condition: (answers) =>
            getValueViaPath(answers, 'customShare.deceasedWasMarried') === YES,
          options: [
            { value: NO, label: m.spouseShareFull },
            { value: YES, label: m.spouseSharePart },
          ],
        }),
        buildTextField({
          id: 'customShare.customSpouseSharePercentage',
          title: m.deceasedShare,
          width: 'half',
          placeholder: '50%',
          suffix: '%',
          variant: 'number',
          condition: (answers) =>
            getValueViaPath(
              answers,
              'customShare.hasCustomSpouseSharePercentage',
            ) === YES &&
            getValueViaPath(answers, 'customShare.deceasedWasMarried') === YES,
        }),
        buildDescriptionField({
          id: 'space4',
          space: 'gutter',
          title: '',
        }),
        buildRadioField({
          id: 'customShare.deceasedHadAssets',
          title: m.hadSeparateProperty,
          largeButtons: false,
          backgroundColor: 'white',
          width: 'half',
          required: true,
          condition: (answers) =>
            getValueViaPath(answers, 'customShare.deceasedWasMarried') === YES,
          options: [
            { value: YES, label: m.yes },
            { value: NO, label: m.no },
          ],
        }),
      ],
    }),
  ],
})
