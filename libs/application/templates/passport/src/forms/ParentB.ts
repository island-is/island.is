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
} from '@island.is/application/types'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import { ChildsPersonalInfo } from '../lib/constants'
import { m } from '../lib/messages'
import { childsOverview } from './overviewSection/childsOverview'

export const ParentB: Form = buildForm({
  id: 'PassportApplicationParentB',
  title: m.formName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'introSection',
      title: m.introTitle,
      children: [
        buildMultiField({
          id: 'introParentB',
          title: 'Umsókn um vegabréf',
          description: (application: Application) =>
            (application.answers.childsPersonalInfo as ChildsPersonalInfo)
              .guardian1.name +
            ' ' +
            m.parentBIntro.defaultMessage +
            ' ' +
            format(new Date(application.created), 'dd.MMMM, yyyy', {
              locale: localeIS,
            }) +
            '. ' +
            m.parentBIntroPart2.defaultMessage,
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
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              id: 'identityDocument',
              type: 'IdentityDocumentProvider',
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'FeeInfoProvider',
              title: '',
            }),
            buildDataProviderItem({
              id: 'districtCommissioners',
              type: 'DistrictsProvider',
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
          title: 'Yfirlit yfir umsókn',
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
