import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'
import * as m from '../lib/messages'
import { ApproveOptions } from '..'

export const unknownRelationshipOptions = [
  {
    label: m.unknownRelationship.form.radioButtonNo,
    value: ApproveOptions.No,
  },
  {
    label: m.unknownRelationship.form.radioButtonYes,
    value: ApproveOptions.Yes,
  },
]

export const unknownRelationshipCheckboxOptions = [
  {
    label: m.unknownRelationship.inputs.checkboxLabel,
    value: ApproveOptions.Yes,
  },
]

export const inRelationshipOptions = [
  {
    label: m.inRelationship.inputs.checkboxLabel,
    value: 'yes',
  },
]

export const homeCircumstancesOptions = [
  {
    value: HomeCircumstances.OWNPLACE,
    label: m.homeCircumstancesForm.circumstances.ownPlace,
  },
  {
    value: HomeCircumstances.REGISTEREDLEASE,
    label: m.homeCircumstancesForm.circumstances.registeredLease,
  },
  {
    value: HomeCircumstances.UNREGISTEREDLEASE,
    label: m.homeCircumstancesForm.circumstances.unregisteredLease,
  },

  {
    value: HomeCircumstances.WITHOTHERS,
    label: m.homeCircumstancesForm.circumstances.withOthers,
  },
  {
    value: HomeCircumstances.WITHPARENTS,
    label: m.homeCircumstancesForm.circumstances.withParents,
  },
  {
    value: HomeCircumstances.OTHER,
    label: m.homeCircumstancesForm.circumstances.other,
  },
]
