import { buildSection } from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { summaryMultiField } from './summaryMultiField'

export const summarySection = buildSection({
  id: Routes.SUMMARY,
  title: m.summaryForm.general.sectionTitle,
  children: [summaryMultiField],
})
