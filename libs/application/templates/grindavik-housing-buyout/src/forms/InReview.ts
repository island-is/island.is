import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import * as m from '../lib/messages'

export const InReview: Form = buildForm({
  id: 'GrindavikHousingBuyoutInReview',
  title: m.application.general.name,
  mode: FormModes.IN_PROGRESS,
  children: [buildFormConclusionSection({})],
})
