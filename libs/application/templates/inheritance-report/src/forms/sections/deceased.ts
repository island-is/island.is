import {
  NO,
  YES,
  buildCustomField,
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
          space: 'containerGutter',
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
          space: 'containerGutter',
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
        buildCustomField(
          {
            id: 'customShare.customSpouseSharePercentage',
            title: '',
            width: 'half',
            component: 'ShareInput',
            condition: (answers) =>
              getValueViaPath(
                answers,
                'customShare.hasCustomSpouseSharePercentage',
              ) === YES &&
              getValueViaPath(answers, 'customShare.deceasedWasMarried') ===
                YES,
          },
          {
            name: 'customShare.customSpouseSharePercentage',
            placeholder: '50%',
            label: m.deceasedSharePercentage.defaultMessage,
          },
        ),
        buildDescriptionField({
          id: 'space4',
          space: 'containerGutter',
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
