import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  DataProviderBuilderItem,
  Form,
  FormItemTypes,
  FormModes,
  StaticText,
} from '@island.is/application/types'

export function prerequisitesForm(
  title: StaticText,
  providers: DataProviderBuilderItem[],
): Form {
  const formDefinition: Form = {
    id: 'PrerequisiteForm',
    title,
    mode: FormModes.NOT_STARTED,
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [],
    type: FormItemTypes.FORM,
  }

  const section = buildSection({
    id: 'externalData',
    title,
    children: [],
  })

  const dataProviders = providers.map((provider) =>
    buildDataProviderItem({ provider: provider.provider, ...provider }),
  )

  section.children = [
    buildExternalDataProvider({
      title,
      id: 'approveExternalData',
      checkboxLabel: coreMessages.externalDataAgreement,
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        title: coreMessages.externalDataTitle,
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: 'SUBMIT',
            name: coreMessages.buttonSubmit,
            type: 'primary',
          },
        ],
      }),
      dataProviders,
    }),
  ]

  formDefinition.children = [section]
  const form = buildForm(formDefinition)
  return form
}
