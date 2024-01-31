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
  providers: { provider: TemplateApi; title: string; subTitle?: string }[]
  targetState: string
}) {
  const { name, providers, targetState } = data
  const form = prerequisitesForm(name, providers)

  const templateApis = providers.map((provider) => provider.provider)

  return state('prerequisites', 'draft')
    .apis(...templateApis)
    .setForm(form)
    .addTransition(DefaultEvents.SUBMIT, targetState)
}
