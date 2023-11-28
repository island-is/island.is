import {
  DefaultEvents,
  DataProviderBuilderItem,
} from '@island.is/application/types'
import { state } from '../template/applicationBuilder'
import { prerequisitesForm } from '../form/prerequisitesBuilder'

export function prerequisitesState(data: {
  name: string
  providers: DataProviderBuilderItem[]
  targetState: string
}) {
  const { name, providers, targetState } = data
  const form = prerequisitesForm(name, providers)
  const apis = providers.map((provider) => provider.provider)
  return (
    state('prerequisites', 'draft')
      //.apis(apis)
      .setForm(form)
      .addTransition(DefaultEvents.SUBMIT, targetState)
  )
}
