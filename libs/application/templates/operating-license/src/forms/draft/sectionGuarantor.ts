import {
  buildCustomField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '@island.is/api/schema'
import {
  Comparators,
  SingleConditionCheck,
  StaticCheck,
} from '@island.is/application/types'

let actors: string[] = []

export const sectionGuarantor = buildMultiField({
  children: [
    buildCustomField({
      component: 'Guarantor',
      id: 'guarantor',
      title: m.guarantor,
    }),
  ],
  title: '',
})
