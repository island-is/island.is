import {
  ApplicationTypes,
  DefaultEvents,
  InstitutionNationalIds,
  PaymentCatalogApi,
  TemplateApi,
  DataProviderBuilderItem,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  applicationBuilder,
  fields,
  paymentState,
  prerequisitesState,
  startForm,
  state,
} from '@island.is/application/utils'

import { generateCompleted } from './forms'

export function buildCertificateTemplate(data: {
  name: string
  additionalProvider: DataProviderBuilderItem
  getPdfApi: TemplateApi<unknown>
  templateId: ApplicationTypes
  title: string
  organizationId: InstitutionNationalIds
  chargeItemCodes: string[]
}) {
  const {
    name,
    additionalProvider,
    getPdfApi,
    templateId,
    title,
    organizationId,
    chargeItemCodes,
  } = data
  const draftForm = startForm('Heimsk umsókn')
    .startSection({ title: 'Fyrsti hluti' })
    .startSubSection({ title: 'Fyrsta síðan' })
    .page({
      title: 'Hér er bara einn hlutur maður',
      children: fields()
        .textField({ placeholder: '', title: 'Hér er field', width: 'half' })
        .textField({
          placeholder: '',
          title: 'Hér er annað field',
          width: 'half',
        })
        .build(),
    })
    .endSubSection()
    .startSubSection({ title: 'Síðasta síðan' })
    .page({
      title: 'Loka síðan maður!',
      children: fields()
        .descriptionField({
          title: 'Hér sé lýsing',
          description:
            'Þetta form er smíðað aðeins öðruvísi en önnur form. Það þýðir samt ekkert að þetta form sé eitthvað verri en önnur form. Þvert á móti þá er þetta form miklu miklu betra ok?!',
        })
        .submitField()
        .build(),
    })
    .endSubSection()
    .endSection()
    .endForm()

  const completed = state('completed', 'completed')
  const draft = state('draft', 'draft')

  const payment = paymentState({
    institutionId: organizationId,
    chargeItemCodes: chargeItemCodes,
    submitTarget: completed.name,
    abortTarget: draft.name,
  })

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

  const providers = [
    ...dataProviders,
    additionalProvider,
    {
      provider: PaymentCatalogApi.configure({
        params: {
          organizationId: organizationId,
        },
      }),
      title: '',
    },
  ] as {
    provider: TemplateApi
    title: string
    subTitle?: string
  }[]

  const s = providers.map((provider) => provider.provider)

  const application = applicationBuilder(name, templateId)
    .addState(
      prerequisitesState({
        name,
        providers,
        templateApis: s,
        targetState: draft.name,
      }),
    )
    .addState(
      draft
        .setForm(draftForm)
        .addTransition(DefaultEvents.SUBMIT, payment.name),
    )
    .addState(payment)
    .addState(completed.setForm(generateCompleted(title)).addOnEntry(getPdfApi)) //TODO ADD verify payment
    .build()

  return application
}
