import {
  buildMultiField,
  buildDividerField,
  buildDescriptionField,
  buildKeyValueField,
  buildCustomField,
  hasYes,
  YES,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { ApplicationTypes, OpeningHour } from '../../lib/constants'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { displayOpeningHours, get24HFormatTime } from '../../lib/utils'
import { Application } from '@island.is/application/types'

export const sectionOverview = buildMultiField({
  id: 'overview',
  title: m.overview,
  description: m.overviewDescription,
  children: [
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.operationTitle',
      title: m.operationTitle,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.operationType,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath(application.answers, 'applicationInfo.operation') ===
        ApplicationTypes.HOTEL
          ? m.operationHotel
          : m.operationResturant,
    }),
    buildKeyValueField({
      label: m.operationCategory,
      width: 'half',
      value: ({ answers }: Application) =>
        `Flokkur ${
          getValueViaPath(answers, 'applicationInfo.category') === '2'
            ? 'II'
            : getValueViaPath(answers, 'applicationInfo.category') === '3'
            ? 'III'
            : 'IV'
        }`,
    }),
    buildDescriptionField({
      id: 'overview.space0',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: ({ answers }: Application) =>
        getValueViaPath(answers, 'applicationInfo.operation') ===
        ApplicationTypes.HOTEL
          ? m.typeHotel
          : m.typeResturant,
      width: 'half',
      value: ({ answers }: Application) =>
        getValueViaPath(answers, 'applicationInfo.operation') ===
        ApplicationTypes.HOTEL
          ? getValueViaPath<string>(
              answers,
              'applicationInfo.typeHotel',
            )?.substring(2)
          : getValueViaPath<Array<string>>(
              answers,
              'applicationInfo.typeResturant',
            )?.map((type) => type.substring(2)),
    }),
    buildKeyValueField({
      label: m.openingHoursOutside,
      width: 'half',
      condition: (answers) => displayOpeningHours(answers),
      value: ({ answers }: Application) =>
        hasYes(getValueViaPath<boolean>(answers, 'applicationInfo.willServe'))
          ? 'Já'
          : 'Nei',
    }),
    buildDescriptionField({
      id: 'overview.space1',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.info',
      title: m.operationInfoTitle,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.operationName,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath<string>(application.answers, 'info.operationName'),
    }),
    buildKeyValueField({
      label: m.vskNr,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath<string>(application.answers, 'info.vskNr'),
    }),
    buildDescriptionField({
      id: 'overview.space2',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath<string>(application.answers, 'info.email'),
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = getValueViaPath<string>(
          application.answers,
          'info.phoneNumber',
        )

        return formatPhoneNumber(phone ?? '')
      },
    }),
    buildDescriptionField({
      id: 'overview.space3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.spaceInfo',
      title: m.propertyInfoSubtitle,
      titleVariant: 'h3',
      space: 'gutter',
    }),
    buildCustomField(
      {
        id: 'propertiesOverview.stay',
        title: m.stayTitle,
        component: 'PropertyOverviewRepeater',
      },
      { id: 'properties.stay' },
    ),
    buildCustomField(
      {
        id: 'propertiesOverview.dining',
        title: m.diningTitle,
        component: 'PropertyOverviewRepeater',
      },
      { id: 'properties.dining' },
    ),
    buildCustomField(
      {
        id: 'propertiesOverview.outside',
        title: m.outsideTitle,
        component: 'PropertyOverviewRepeater',
      },
      { id: 'properties.outside' },
    ),
    buildDescriptionField({
      id: 'overview.space4',
      space: 'gutter',
    }),
    // TODO: map properties
    buildDividerField({ condition: (answers) => displayOpeningHours(answers) }),
    buildDescriptionField({
      id: 'overview.openingHours',
      title: m.openingHoursTitle,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.openingHoursAlcohol',
      title: m.openingHoursAlcohol,
      titleVariant: 'h4',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.space5',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.weekdays,
      width: 'half',
      condition: (answers) => displayOpeningHours(answers),
      value: (application: Application) => {
        const weekdays = getValueViaPath<OpeningHour>(
          application.answers,
          'openingHours.alcohol.weekdays',
        )
        return (
          get24HFormatTime(weekdays?.from ?? '') +
          ' - ' +
          get24HFormatTime(weekdays?.to ?? '')
        )
      },
    }),
    buildKeyValueField({
      label: m.holidays,
      width: 'half',
      condition: (answers) => displayOpeningHours(answers),
      value: (application: Application) => {
        const weekdays = getValueViaPath<OpeningHour>(
          application.answers,
          'openingHours.alcohol.weekends',
        )
        return (
          get24HFormatTime(weekdays?.from ?? '') +
          ' - ' +
          get24HFormatTime(weekdays?.to ?? '')
        )
      },
    }),
    buildDescriptionField({
      id: 'overview.space6',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.openingHoursOutside',
      title: m.openingHoursOutsideTitle,
      titleVariant: 'h4',
      space: 'gutter',
      marginBottom: 'gutter',
      condition: (answers) =>
        hasYes(
          getValueViaPath<boolean>(answers, 'applicationInfo.willServe'),
        ) && displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.weekdays,
      width: 'half',
      value: (application: Application) => {
        const weekdays = getValueViaPath<OpeningHour>(
          application.answers,
          'openingHours.outside.weekdays',
        )
        return (
          get24HFormatTime(weekdays?.from ?? '') +
          ' - ' +
          get24HFormatTime(weekdays?.to ?? '')
        )
      },
      condition: (answers) =>
        hasYes(
          getValueViaPath<boolean>(answers, 'applicationInfo.willServe'),
        ) && displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.holidays,
      width: 'half',
      value: (application: Application) => {
        const weekdays = getValueViaPath<OpeningHour>(
          application.answers,
          'openingHours.outside.weekends',
        )
        return (
          get24HFormatTime(weekdays?.from ?? '') +
          ' - ' +
          get24HFormatTime(weekdays?.to ?? '')
        )
      },
      condition: (answers) =>
        hasYes(
          getValueViaPath<boolean>(answers, 'applicationInfo.willServe'),
        ) && displayOpeningHours(answers),
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.otherInfo',
      title: m.otherInfoTitle,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.temporaryLicense,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath<Array<string>>(
          application.answers,
          'temporaryLicense',
        )?.includes(YES)
          ? 'Já'
          : 'Nei',
    }),
    buildKeyValueField({
      label: m.debtClaimTitle,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath<Array<string>>(
          application.answers,
          'debtClaim',
        )?.includes(YES)
          ? 'Já'
          : 'Nei',
    }),
    buildKeyValueField({
      label: m.other,
      value: (application: Application) =>
        getValueViaPath<string>(application.answers, 'otherInfoText'),
      condition: (answers) => !!answers.otherInfoText,
    }),
    buildDescriptionField({
      id: 'overview.space7',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.attachments',
      title: m.attachments,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildCustomField({
      id: 'overview.files',
      component: 'FileOverview',
    }),
  ],
})
