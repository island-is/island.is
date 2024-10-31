import { buildSection } from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { confirmationMultiField } from './confirmationMultiField'

export const confirmationSection = buildSection({
  id: Routes.CONFIRMATION,
  title: m.confirmation.general.pageTitle,
  children: [confirmationMultiField],
})
