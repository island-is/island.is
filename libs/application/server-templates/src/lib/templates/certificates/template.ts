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
  InstitutionTypes,
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
import { StaticText } from 'static-text'

export function buildCertificateTemplate(data: {
  name: string
  additionalProvider: DataProviderBuilderItem
  getPdfApi: TemplateApi<unknown>
  pdfKey: string
  templateId: ApplicationTypes
  title: string

  institutionId: InstitutionTypes
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
    institutionId,
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

  const conclusionForm = startForm({
    title,
    formMode: FormModes.COMPLETED,
    renderLastScreenBackButton: false,
    renderLastScreenButton: false,
  })
    .startSection({ title: 'Umsókn tókst' })
    .page({
      title: 'Sakavottorð',
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

  const application = applicationBuilder({
    name,
    applicatonType: templateId,
    institution: institutionId,
  })
    .addState(
      prerequisitesState({
        name,
        providers,
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
        .setForm(conclusionForm)
        .addOnEntry(getPdfApi)
        .addOnEntry(VerifyPaymentApi.configure({ order: 0 })),
    )

  if (draftForm) application.addState(draft)

  return application.build()
}

export function buildCertificateTemplateNoPayment(data: {
  name: StaticText
  additionalProvider: DataProviderBuilderItem
  getPdfApi: TemplateApi<unknown>
  pdfKey: string
  templateId: ApplicationTypes
  title: StaticText
  institutionId: InstitutionTypes
  organizationId: InstitutionNationalIds
}) {
  const {
    name,
    additionalProvider,
    getPdfApi,
    templateId,
    title,
    pdfKey,
    institutionId,
  } = data

  const providers = [additionalProvider] as {
    provider: TemplateApi
    title: string
    subTitle?: string
  }[]

  const completed = state('completed', 'completed')

  const conclusionForm = startForm({
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

  const application = applicationBuilder({
    name,
    applicatonType: templateId,
    institution: institutionId,
  })
    .addState(
      prerequisitesState({
        name: name,
        providers,
        targetState: completed.name,
      }).addHistoryLog({
        logMessage: coreHistoryMessages.applicationSent,
        onEvent: DefaultEvents.SUBMIT,
      }),
    )
    .addState(
      completed
        .addPendingAction({
          title: corePendingActionMessages.applicationReceivedTitle,
          content: corePendingActionMessages.certificateRecieved,
          displayStatus: 'success',
        })
        .lifecycle(pruneAfterDays(90))
        .setForm(conclusionForm),
    )

  return application.build()
}
