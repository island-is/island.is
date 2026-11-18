import {
  NO,
  YES,
  buildAlertMessageField,
  buildCustomField,
  buildHiddenInput,
  buildTextField,
} from '@island.is/application/core'
import { Application, TextField } from '@island.is/application/types'
import { maxDaysToGiveOrReceive } from '../config'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getMaxMultipleBirthsAndSingleParenttMonths,
  getMultipleBirthRequestDays,
} from '../lib/parentalLeaveUtils'
import type { RightsTotalKind } from '../fields/Rights/RightsTotal'

// The days input and the total side by side from the small breakpoint up. A
// multi-field only honours `width: 'half'` from the large one, and the text and
// custom field builders drop `colSpan`, so it is set on the built field.
const HALF_FROM_SMALL: TextField['colSpan'] = ['1/1', '1/2']

const buildRightsTotal = (id: string, kind: RightsTotalKind) => ({
  ...buildCustomField(
    {
      id,
      component: 'RightsTotal',
      doesNotRequireAnswer: true,
      width: 'half',
    },
    { kind },
  ),
  colSpan: HALF_FROM_SMALL,
})

const buildRightsAlert = (
  id: string,
  message: typeof parentalLeaveFormMessages.shared.rightsTotalSmallPrint,
) =>
  buildAlertMessageField({
    id,
    alertType: 'info',
    title: parentalLeaveFormMessages.shared.rightsAlertTitle,
    message,
    doesNotRequireAnswer: true,
    marginTop: 3,
  })

/**
 * The applicant's personal rights, including the extra single parent months,
 * and any days requested on top of them.
 */
export const buildRightsIntroFields = () => [
  buildCustomField({
    id: 'rightsIntro.rights',
    component: 'RightsIntro',
    doesNotRequireAnswer: true,
  }),
  buildAlertMessageField({
    id: 'rightsIntro.alert',
    alertType: 'info',
    title: parentalLeaveFormMessages.personalAllowance.editAlertTitle,
    message: (application: Application) => ({
      ...parentalLeaveFormMessages.shared.rightsInfoAlert,
      values: {
        months: getMaxMultipleBirthsAndSingleParenttMonths(application),
      },
    }),
    doesNotRequireAnswer: true,
    marginTop: 3,
  }),
]

/**
 * Days requested from the shared multiple births rights. The maximum depends
 * on how many children were born, so it is checked by the
 * `multipleBirthsRequestDays` answer validator rather than the input.
 */
export const buildMultipleBirthsDaysFields = () => [
  // Transferring rights is asked on a later screen
  buildHiddenInput({
    id: 'requestRights.isRequestingRights',
    defaultValue: NO,
  }),
  buildHiddenInput({ id: 'giveRights.isGivingRights', defaultValue: NO }),
  {
    ...buildTextField({
      id: 'multipleBirthsRequestDays',
      title: parentalLeaveFormMessages.shared.multipleBirthsDaysTitle,
      variant: 'number',
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      allowNegative: false,
      min: 0,
      defaultValue: (application: Application) =>
        String(getMultipleBirthRequestDays(application.answers)),
    }),
    colSpan: HALF_FROM_SMALL,
  },
  buildRightsTotal('multipleBirthsRequestDays.total', 'multipleBirths'),
  buildRightsAlert(
    'multipleBirthsRequestDays.alert',
    parentalLeaveFormMessages.shared.rightsTotalSmallPrint,
  ),
]

export const buildRequestDaysFields = () => [
  buildHiddenInput({
    id: 'requestRights.isRequestingRights',
    defaultValue: YES,
  }),
  {
    ...buildTextField({
      id: 'requestRights.requestDays',
      title: parentalLeaveFormMessages.shared.requestDaysInputLabel,
      variant: 'number',
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      allowNegative: false,
      min: 1,
      max: maxDaysToGiveOrReceive,
      defaultValue: '0',
    }),
    colSpan: HALF_FROM_SMALL,
  },
  buildRightsTotal('requestRights.total', 'request'),
  buildRightsAlert(
    'requestRights.alert',
    parentalLeaveFormMessages.shared.rightsTotalSmallPrint,
  ),
]

export const buildGiveDaysFields = () => [
  buildHiddenInput({ id: 'giveRights.isGivingRights', defaultValue: YES }),
  {
    ...buildTextField({
      id: 'giveRights.giveDays',
      title: parentalLeaveFormMessages.shared.giveDaysInputLabel,
      variant: 'number',
      backgroundColor: 'blue',
      width: 'half',
      required: true,
      allowNegative: false,
      min: 1,
      max: maxDaysToGiveOrReceive,
      defaultValue: '0',
    }),
    colSpan: HALF_FROM_SMALL,
  },
  buildRightsTotal('giveRights.total', 'give'),
  buildRightsAlert(
    'giveRights.alert',
    parentalLeaveFormMessages.shared.giveDaysInfoAlert,
  ),
]
