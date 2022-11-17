import {
  buildMultiField,
  buildDividerField,
  buildDescriptionField,
  buildKeyValueField,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  APPLICATION_TYPES,
  Operation,
  OPERATION_CATEGORY,
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
      description: '',
      space: 'gutter',
    }),
    buildDescriptionField({
      id: 'overview.space',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.operationType,
      width: 'half',
      value: (application: Application) =>
        (application.answers.applicationInfo as Operation).operation ===
        APPLICATION_TYPES.HOTEL
          ? m.operationHotel
          : m.operationResturant,
    }),
    buildKeyValueField({
      label: m.operationTypeResturantDescription,
      width: 'half',
      value: (application: Application) =>
        (application.answers.applicationInfo as Operation).operation ===
        APPLICATION_TYPES.HOTEL
          ? (application.answers.applicationInfo as Operation).type
          : (application.answers.applicationInfo as Operation).type,
    }),
    buildDescriptionField({
      id: 'overview.space0',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: 'Flokkur',
      value: (application: Application) =>
        (application.answers.applicationInfo as Operation).category ===
        OPERATION_CATEGORY.TWO
          ? m.operationCategoryTwo
          : m.operationCategoryThree,
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.RESTURANT,
    }),
    buildDescriptionField({
      id: 'overview.availableService',
      title: m.availableService,
      titleVariant: 'h4',
      description: '',
      space: 'gutter',
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL,
    }),
    buildDescriptionField({
      id: 'overview.space1',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.operationCategoryTwo,
      width: 'half',
      value: (application: Application) =>
        (application.answers.applicationInfo as Operation).category?.includes(
          OPERATION_CATEGORY.TWO,
        )
          ? m.yes
          : m.no,
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL,
    }),
    buildKeyValueField({
      label: m.operationCategoryHotelTwo,
      width: 'half',
      value: (application: Application) =>
        (application.answers.applicationInfo as Operation).category?.includes(
          OPERATION_CATEGORY.THREE,
        )
          ? m.yes
          : m.no,
      condition: (answers) =>
        (answers.applicationInfo as Operation)?.operation ===
        APPLICATION_TYPES.HOTEL,
    }),
    buildDescriptionField({
      id: 'overview.space1.2',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.info',
      title: m.operationInfoTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
    }),
    buildDescriptionField({
      id: 'overview.space2',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.operationName,
      width: 'half',
      value: (application: Application) =>
        (application.answers.info as {
          operationName?: string
        })?.operationName,
    }),
    buildKeyValueField({
      label: m.vskNr,
      width: 'half',
      value: (application: Application) =>
        (application.answers.info as {
          vskNr?: string
        })?.vskNr,
    }),
    buildDescriptionField({
      id: 'overview.space4',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        (application.answers.info as {
          email?: string
        })?.email,
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = (application.answers.info as {
          phoneNumber?: string
        })?.phoneNumber

        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overview.space2.2',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.spaceInfo',
      title: m.propertyInfoSubtitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
    }),
    buildCustomField({
      id: 'propertiesOverview',
      title: '',
      component: 'PropertyOverviewRepeater',
    }),
    buildDescriptionField({
      id: 'overview.space3',
      title: '',
      description: '',
      space: 'gutter',
    }),
    // TODO: map properties
    buildDividerField({ condition: (answers) => displayOpeningHours(answers) }),
    buildDescriptionField({
      id: 'overview.openingHours',
      title: m.openingHoursTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.space8',
      title: '',
      description: '',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.openingHoursAlcohol',
      title: m.openingHoursAlcohol,
      titleVariant: 'h4',
      description: '',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.space6',
      title: '',
      description: '',
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
      id: 'overview.space9',
      title: '',
      description: '',
      space: 'gutter',
      condition: (answers) => displayOpeningHours(answers),
    }),
    buildKeyValueField({
      label: m.openingHoursOutside,
      condition: (answers) => displayOpeningHours(answers),
      value: (application: Application) =>
        (application.answers.openingHours as OpeningHours).willServe?.includes(
          YES,
        )
          ? 'Já'
          : 'Nei',
    }),
    buildDescriptionField({
      id: 'overview.openingHoursOutside',
      title: m.openingHoursOutsideTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      condition: (answers) =>
        (answers.openingHours as OpeningHours)?.willServe?.includes(YES) &&
        displayOpeningHours(answers),
    }),
    buildDescriptionField({
      id: 'overview.space5',
      title: '',
      description: '',
      space: 'gutter',
      condition: (answers) =>
        (answers.openingHours as OpeningHours)?.willServe?.includes(YES) &&
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
        (answers.openingHours as OpeningHours)?.willServe?.includes(YES) &&
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
        (answers.openingHours as OpeningHours)?.willServe?.includes(YES) &&
        displayOpeningHours(answers),
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.otherInfo',
      title: m.otherInfoTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
    }),
    buildDescriptionField({
      id: 'overview.space7',
      title: '',
      description: '',
      space: 'gutter',
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
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.attachments',
      title: m.attachments,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
    }),
    buildDescriptionField({
      id: 'overview.space10',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildCustomField({
      id: 'overview.files',
      title: '',
      component: 'FileOverview',
    }),
  ],
})
