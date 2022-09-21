import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'

export const form: Form = buildForm({
  id: 'officialExchange',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [dataCollection, announcerInfo],
})
