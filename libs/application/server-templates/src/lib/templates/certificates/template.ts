import {
  ApplicationTypes,
  DefaultEvents,
  InstitutionNationalIds,
  PaymentCatalogApi,
  TemplateApi,
  DataProviderBuilderItem,
  NationalRegistryUserApi,
  UserProfileApi,
  Form,
  FormModes,
  VerifyPaymentApi,
} from '@island.is/application/types'
import {
  applicationBuilder,
  paymentState,
  prerequisitesState,
  state,
  startForm,
  fields,
} from '@island.is/application/utils'
import {
  coreHistoryMessages,
  corePendingActionMessages,
  pruneAfterDays,
} from '@island.is/application/core'

export function buildCertificateTemplate(data: {
  name: string
  additionalProvider: DataProviderBuilderItem
  getPdfApi: TemplateApi<unknown>
  pdfKey: string
  templateId: ApplicationTypes
  title: string
  organizationId: InstitutionNationalIds
  chargeItemCodes: string[]
  draftForm?: Form
}) {
  const {
    name,
    additionalProvider,
    getPdfApi,
    templateId,
    title,
    organizationId,
    chargeItemCodes,
    draftForm,
    pdfKey,
  } = data

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

  const completed = state('completed', 'completed')
  const draft = state('draft', 'draft')

  const payment = paymentState({
    institutionId: organizationId,
    chargeItemCodes: chargeItemCodes,
    submitTarget: completed.name,
    abortTarget: draftForm ? draft.name : 'prerequisites',
  })

  if (draftForm) {
    draft.setForm(draftForm).addTransition(DefaultEvents.SUBMIT, payment.name)
  }

  const conslusionForm = startForm({
    title,
    formMode: FormModes.COMPLETED,
    renderLastScreenBackButton: false,
    renderLastScreenButton: false,
  })
    .startSection({ title: 'Umsókn tókst' })
    .page({
      title: 'Hér er bara einn hlutur maður',
      children: fields()
        .pdfPreviewField({
          id: 'uiForms.conclusionPdfPreview',
          title: 'conclusion.information.pdfTitle',
          pdfKey,
          openMySitesLabel: 'Opna í Mínum síðum',
          downloadPdfButtonLabel: 'Sækja PDF',
          successTitle: 'Tókst',
          successDescription: 'Umsókn þín hefur verið móttekin.',
          verificationDescription:
            'Vinsamlegast staðfestu upplýsingar hér að neðan.',
          verificationLinkTitle: 'Leiðbeiningar um staðfestingu',
          verificationLinkUrl: 'https://verification-url-example.com',
          viewPdfButtonLabel: 'Skoða PDF',
          openInboxButtonLabel: 'Opna tölvupóstinn',
          confirmationMessage: 'Upplýsingum þínum hefur verið staðfest.',
        })
        .build(),
    })
    .endSection()
    .endForm()

  const application = applicationBuilder(name, templateId)
    .addState(
      prerequisitesState({
        name,
        providers,
        templateApis: providers.map((provider) => provider.provider),
        targetState: draftForm ? draft.name : payment.name,
      }).addHistoryLog({
        logMessage: coreHistoryMessages.paymentStarted,
        onEvent: DefaultEvents.SUBMIT,
      }),
    )
    .addState(payment)
    .addState(
      completed
        .addPendingAction({
          title: corePendingActionMessages.applicationReceivedTitle,
          content: corePendingActionMessages.certificateRecieved,
          displayStatus: 'success',
        })
        .lifecycle(pruneAfterDays(90))
        .setForm(conslusionForm)
        .addOnEntry(getPdfApi)
        .addOnEntry(VerifyPaymentApi.configure({ order: 0 })),
    ) //TODO ADD verify payment

  if (draftForm) application.addState(draft)

  return application.build()
}
