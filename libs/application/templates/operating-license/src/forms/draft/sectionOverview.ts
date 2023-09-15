import {
  buildMultiField,
  buildDividerField,
  buildDescriptionField,
  buildKeyValueField,
  buildCustomField,
  hasYes,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  APPLICATION_TYPES,
  Operation,
  OpeningHours,
  YES,
} from '../../lib/constants'
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
        (application.answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL
          ? m.operationHotel
          : m.operationResturant,
    }),
    buildKeyValueField({
      label: m.operationCategory,
      width: 'half',
      value: ({ answers }: Application) =>
        `Flokkur ${
          (answers.applicationInfo as Operation)?.category === '2'
            ? 'II'
            : (answers.applicationInfo as Operation)?.category === '3'
            ? 'III'
            : 'IV'
        }`,
    }),
    buildDescriptionField({
      id: 'overview.space0',
      title: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: ({ answers }: Application) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL
          ? m.typeHotel
          : m.typeResturant,
      width: 'half',
      value: ({ answers }: Application) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL
          ? (answers.applicationInfo as Operation)?.typeHotel?.substring(2)
          : (answers.applicationInfo as Operation)?.typeResturant?.map((type) =>
              type.substring(2),
            ),
    }),
    buildKeyValueField({
      label: m.openingHoursOutside,
      width: 'half',
      condition: (answers) => displayOpeningHours(answers),
      value: ({ answers }: Application) =>
        hasYes((answers.applicationInfo as Operation)?.willServe)
          ? 'Já'
          : 'Nei',
    }),
    buildDescriptionField({
      id: 'overview.space1',
      title: '',
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
        (
          application.answers.info as {
            operationName?: string
          }
        )?.operationName,
    }),
    buildKeyValueField({
      label: m.vskNr,
      width: 'half',
      value: (application: Application) =>
        (
          application.answers.info as {
            vskNr?: string
          }
        )?.vskNr,
    }),
    buildDescriptionField({
      id: 'overview.space2',
      title: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        (
          application.answers.info as {
            email?: string
          }
        )?.email,
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = (
          application.answers.info as {
            phoneNumber?: string
          }
        )?.phoneNumber

        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overview.space3',
      title: '',
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
      title: '',
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
      title: '',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.weekdays,
      width: 'half',
      condition: (answers) => displayOpeningHours(answers),
      value: (application: Application) => {
        const weekdays = (application.answers.openingHours as OpeningHours)
          .alcohol.weekdays
        return (
          get24HFormatTime(weekdays.from) +
          ' - ' +
          get24HFormatTime(weekdays.to)
        )
      },
    }),
    buildKeyValueField({
      label: m.holidays,
      width: 'half',
      condition: (answers) => displayOpeningHours(answers),
      value: (application: Application) => {
        const weekdays = (application.answers.openingHours as OpeningHours)
          .alcohol.weekends
        return (
          get24HFormatTime(weekdays.from) +
          ' - ' +
          get24HFormatTime(weekdays.to)
        )
      },
    }),
    buildDescriptionField({
      id: 'overview.space6',
      title: '',
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
        hasYes((answers.applicationInfo as Operation)?.willServe) &&
        displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.weekdays,
      width: 'half',
      value: (application: Application) => {
        const weekdays = (application.answers.openingHours as OpeningHours)
          .alcohol.weekdays
        return (
          get24HFormatTime(weekdays.from) +
          ' - ' +
          get24HFormatTime(weekdays.to)
        )
      },
      condition: (answers) =>
        hasYes((answers.applicationInfo as Operation)?.willServe) &&
        displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.holidays,
      width: 'half',
      value: (application: Application) => {
        const weekdays = (application.answers.openingHours as OpeningHours)
          .alcohol.weekends
        return (
          get24HFormatTime(weekdays.from) +
          ' - ' +
          get24HFormatTime(weekdays.to)
        )
      },
      condition: (answers) =>
        hasYes((answers.applicationInfo as Operation)?.willServe) &&
        displayOpeningHours(answers),
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
        (application.answers.temporaryLicense as string[]).includes(YES)
          ? 'Já'
          : 'Nei',
    }),
    buildKeyValueField({
      label: m.debtClaimTitle,
      width: 'half',
      value: (application: Application) =>
        (application.answers.debtClaim as string[]).includes(YES)
          ? 'Já'
          : 'Nei',
    }),
    buildKeyValueField({
      label: m.other,
      value: (application: Application) =>
        application.answers.otherInfoText as string,
      condition: (answers) => !!answers.otherInfoText,
    }),
    buildDescriptionField({
      id: 'overview.space7',
      title: '',
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
      title: '',
      component: 'FileOverview',
    }),
  ],
})
