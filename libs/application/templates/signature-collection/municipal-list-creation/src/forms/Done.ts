import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildCustomField,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import Jobs from '../../assets/Jobs'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'screen1',
      title: m.intro,
      children: [],
    }),
    buildSection({
      id: 'screen2',
      title: m.dataCollection,
      children: [],
    }),
    buildSection({
      id: 'screen3',
      title: m.information,
      children: [],
    }),
    buildSection({
      id: 'screen4',
      title: m.overview,
      children: [],
    }),
    buildSection({
      id: 'screen5',
      title: m.confirmCreation,
      children: [],
    }),
    buildSection({
      id: 'doneScreen',
      title: m.listCreated,
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listCreated,
          description: m.listCreatedDescription,
          children: [
            buildImageField({
              id: 'doneImage',
              image: Jobs,
              imageWidth: '50%',
              imagePosition: 'center',
              marginTop: 'none',
            }),
            buildDescriptionField({
              id: 'nextStepsTitle',
              title: '',
              description: m.nextStepsDescription,
              titleVariant: 'h4',
              marginBottom: 'gutter',
            }),
            buildCustomField({
              id: 'copyLink',
              component: 'CopyLink',
            }),
            buildMessageWithLinkButtonField({
              condition: (_, externalData) => {
                return !(
                  externalData?.delegatedToCompany?.data as {
                    delegatedToCompany: boolean
                  }
                )?.delegatedToCompany
              },
              id: 'done.goToServicePortal',
              title: '',
              url: '/minarsidur/min-gogn/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
              //messageColor: 'blue600',
            }),
            buildMessageWithLinkButtonField({
              condition: (_, externalData) => {
                return (
                  externalData?.delegatedToCompany?.data as {
                    delegatedToCompany: boolean
                  }
                )?.delegatedToCompany
              },
              id: 'done.goToServicePortalCompany',
              title: '',
              url: '/minarsidur/fyrirtaeki/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonCompanyTitle,
              message: m.linkFieldCompanyMessage,
              //messageColor: 'blue600',
            }),
            buildDescriptionField({
              id: 'doneScreenSpace',
              title: '',
              space: 'containerGutter',
            }),
            buildDescriptionField({
              id: 'doneScreenSpace2',
              title: '',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
