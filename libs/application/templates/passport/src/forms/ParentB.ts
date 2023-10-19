import {
  buildDataProviderItem,
  buildDividerField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  PassportsApi,
} from '@island.is/application/types'
import { ChildsPersonalInfo } from '../lib/constants'
import { m } from '../lib/messages'
import { childsOverview } from './overviewSection/childsOverview'
import {
  SyslumadurPaymentCatalogApi,
  DeliveryAddressApi,
  UserInfoApi,
  NationalRegistryUserParentB,
} from '../dataProviders'

export const ParentB: Form = buildForm({
  id: 'PassportApplicationParentB',
  title: m.formName,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'introSection',
      title: m.introTitle,
      children: [
        buildMultiField({
          id: 'introParentB',
          title: m.formName,
          description: (application: Application) => ({
            ...m.parentBIntroText,
            values: {
              childsName: (
                application.answers.childsPersonalInfo as ChildsPersonalInfo
              )?.name,
              guardianName: (
                application.answers.childsPersonalInfo as ChildsPersonalInfo
              )?.guardian1.name,
            },
          }),
          children: [
            buildDividerField({
              title: ' ',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'externalDataSection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalDataParentB',
          title: m.formName,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserParentB,
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: UserInfoApi,
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              provider: PassportsApi,
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
            // buildDataProviderItem({
            //   provider: SyslumadurPaymentCatalogApi,
            //   title: '',
            // }),
            buildDataProviderItem({
              provider: DeliveryAddressApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSectionParentB',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'overviewSection',
          title: m.overviewSectionTitle,
          children: [
            ...childsOverview.children,
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
