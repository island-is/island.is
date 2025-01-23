import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
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

export const studentOptions = [
  {
    value: ApproveOptions.No,
    label: m.approveOptions.no,
  },
  {
    value: ApproveOptions.Yes,
    label: m.approveOptions.yes,
  },
]

export const employmentOptions = [
  {
    value: Employment.WORKING,
    label: m.employmentForm.employment.working,
  },
  {
    value: Employment.UNEMPLOYED,
    label: m.employmentForm.employment.unemployed,
  },
  {
    value: Employment.CANNOTWORK,
    label: m.employmentForm.employment.cannotWork,
  },
  {
    value: Employment.OTHER,
    label: m.employmentForm.employment.other,
  },
]

export const incomeOptions = [
  {
    value: ApproveOptions.Yes,
    label: m.incomeForm.options.yes,
  },
  {
    value: ApproveOptions.No,
    label: m.incomeForm.options.no,
  },
]

export const personalTaxCreditOptions = [
  {
    value: ApproveOptions.Yes,
    label: m.personalTaxCreditForm.radioChoices.useTaxCredit,
  },
  {
    value: ApproveOptions.No,
    label: m.personalTaxCreditForm.radioChoices.wontUseTaxCredit,
  },
]
