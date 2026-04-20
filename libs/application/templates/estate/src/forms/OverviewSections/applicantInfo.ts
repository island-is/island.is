import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { EstateTypes, JA, NEI } from '../../lib/constants'

export const applicantOverviewFields = [
  buildDescriptionField({
    id: 'overviewApplicantHeader',
    title: ({ answers }) =>
      answers.selectedEstate === EstateTypes.estateWithoutAssets
        ? m.announcerNoAssets
        : answers.selectedEstate === EstateTypes.permitForUndividedEstate
        ? m.announcerPermitToPostpone
        : m.announcer,
    titleVariant: 'h3',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.name,
    value: ({ answers }) => getValueViaPath(answers, 'applicant.name') || '',
    width: 'half',
  }),
  buildKeyValueField({
    label: m.nationalId,
    value: ({ answers }) => {
      const nationalId = getValueViaPath(answers, 'applicant.nationalId')
      return nationalId && typeof nationalId === 'string'
        ? formatNationalId(nationalId)
        : ''
    },
    width: 'half',
  }),
  buildDescriptionField({
    id: 'spaceApplicant1',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.address,
    value: ({ answers }) => getValueViaPath(answers, 'applicant.address') || '',
    width: 'half',
  }),
  buildKeyValueField({
    label: m.phone,
    value: ({ answers }) => {
      const phone = getValueViaPath(answers, 'applicant.phone')
      return phone && typeof phone === 'string' ? formatPhoneNumber(phone) : ''
    },
    width: 'half',
  }),
  buildDescriptionField({
    id: 'spaceApplicant2',
    space: 'gutter',
  }),
  buildKeyValueField({
    label: m.email,
    value: ({ answers }) => getValueViaPath(answers, 'applicant.email') || '',
    width: 'half',
  }),
  buildKeyValueField({
    label: m.relationToDeceased,
    value: ({ answers }) =>
      getValueViaPath(answers, 'applicant.relationToDeceased') || '',
    width: 'half',
    condition: (answers) =>
      answers.selectedEstate === EstateTypes.estateWithoutAssets &&
      !!getValueViaPath(answers, 'applicant.relationToDeceased'),
  }),
  buildDescriptionField({
    id: 'spaceApplicant3',
    space: 'gutter',
    condition: (answers) =>
      answers.selectedEstate === EstateTypes.permitForUndividedEstate &&
      !!getValueViaPath(answers, 'applicant.autonomous'),
  }),
  buildKeyValueField({
    label: m.applicantAutonomous,
    value: ({ answers }) => {
      const autonomous = getValueViaPath(answers, 'applicant.autonomous')
      return autonomous === 'Yes' ? JA : autonomous === 'No' ? NEI : ''
    },
    width: 'half',
    condition: (answers) =>
      answers.selectedEstate === EstateTypes.permitForUndividedEstate &&
      !!getValueViaPath(answers, 'applicant.autonomous'),
  }),
  buildDescriptionField({
    id: 'spaceApplicant4',
    marginBottom: 'gutter',
    space: 'gutter',
  }),
  buildDividerField({}),
]
