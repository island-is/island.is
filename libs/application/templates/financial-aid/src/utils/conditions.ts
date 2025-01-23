import {
  ExternalData,
  FormValue,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import { ApproveOptions } from '..'
import { getValueViaPath } from '@island.is/application/core'
import { HomeCircumstances } from '@island.is/financial-aid/shared/lib'

export const hasSpouse = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<NationalRegistrySpouse>(
    externalData,
    'nationalRegistrySpouse.data',
  ) != null

export const hasNoSpouse = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<NationalRegistrySpouse>(
    externalData,
    'nationalRegistrySpouse.data',
  ) == null

export const isInRelationship = (answers: FormValue) =>
  getValueViaPath<ApproveOptions>(
    answers,
    'relationshipStatus.unregisteredCohabitation',
  ) === ApproveOptions.Yes

export const hasOtherHomeCircumstances = (answers: FormValue) =>
  getValueViaPath<HomeCircumstances>(answers, 'homeCircumstances.type') ===
  HomeCircumstances.OTHER
