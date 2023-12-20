import {
  DefaultEvents,
  DataProviderBuilderItem,
  TemplateApi,
} from '@island.is/application/types'
import { state } from '../template/applicationBuilder'
import { prerequisitesForm } from '../form/prerequisitesBuilder'
import { StaticText } from 'static-text'

export function prerequisitesState(data: {
  name: StaticText
  providers: DataProviderBuilderItem[]
  templateApis: TemplateApi[]
  targetState: string
}) {
  const { name, providers, targetState, templateApis } = data
  const form = prerequisitesForm(name, providers)

  return state('prerequisites', 'draft')
    .apis(...templateApis)
    .setForm(form)
    .addTransition(DefaultEvents.SUBMIT, targetState)
}
