import {
  ApplicationTypes,
  DefaultEvents,
  InstitutionTypes,
  NationalRegistryUserApi,
  TemplateApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  applicationBuilder,
  prerequisitesState,
  state,
  startForm,
  fields,
} from '@island.is/application/utils'

const draftForm = startForm({ title: 'Í vinnslu' })
  .startSection({ title: 'Í vinnslu' })
  .page({
    title: 'Í vinnslu',
    children: fields()
      .descriptionField({
        title: 'Í vinnslu',
        description: 'Umsókn þín er í vinnslu',
      })
      .submitField({
        title: 'Senda',
      })
      .build(),
  })
  .endSection()
  .endForm()
const completedForm = startForm({ title: 'Klárað' })
  .startSection({ title: 'búið' })
  .page({
    title: 'búið',
    children: fields()
      .descriptionField({
        title: 'búið',
        description: 'Umsókn þín er búið',
      })
      .build(),
  })
  .endSection()
  .endForm()

const draft = state('draft', 'draft', draftForm)
const completed = state('completed', 'completed', completedForm)

const dataProviders = [
  {
    provider: NationalRegistryUserApi,
    title: 'Persónuupplýsingar úr Þjóðskrá',
    subTitle:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
  },
  {
    provider: UserProfileApi,
    title: 'Netfang og símanúmer úr þínum stillingum',
    subTitle:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
  },
] as {
  provider: TemplateApi
  title: string
  subTitle?: string
}[]

export const newTypeOfApplication = applicationBuilder({
  applicatonType: ApplicationTypes.NEW_TYPE_OF_APPLICATION,
  institution: InstitutionTypes.STAFRAENT_ISLAND,
  name: 'Ný tegund umsóknar',
})
  .addState(
    prerequisitesState({
      name: 'Gagnaöflun',
      providers: dataProviders,
      targetState: draft.name,
    }),
  )
  .addState(
    draft
      .setForm(draftForm)
      .addTransition(DefaultEvents.SUBMIT, completed.name),
  )
  .addState(completed.setForm(completedForm))
  .build()
