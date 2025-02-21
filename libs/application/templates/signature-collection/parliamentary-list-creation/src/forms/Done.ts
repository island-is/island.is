import {
  buildForm,
  buildMultiField,
  buildSection,
  buildMessageWithLinkButtonField,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  children: [
    /* Sections for the stepper */
    buildSection({
      id: 'screen1',
      title: m.dataCollection,
      children: [],
    }),
    buildSection({
      id: 'screen2',
      title: m.information,
      children: [],
    }),
    buildSection({
      id: 'screen3',
      title: m.overview,
      children: [],
    }),
    /* ------------------------ */
    buildSection({
      id: 'doneScreen',
      title: m.listCreated,
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listCreated,
          description: m.listCreatedDescription,
          children: [
            buildDescriptionField({
              id: 'nextStepsTitle',
              title: m.nextSteps,
              titleVariant: 'h3',
              marginBottom: 1,
            }),
            //Set up separately for even spacing
            buildDescriptionField({
              id: 'nextStepsDescription',
              description: m.nextStepsDescription,
              titleVariant: 'h4',
              marginBottom: 5,
            }),
            buildCustomField({
              id: 'copyLink',
              component: 'CopyLink',
            }),
            buildMessageWithLinkButtonField({
              condition: (_, externalData) => {
                return !(
                  externalData?.delegatedToCompany.data as {
                    delegatedToCompany: boolean
                  }
                ).delegatedToCompany
              },
              id: 'done.goToServicePortal',
              title: '',
              url: '/minarsidur/min-gogn/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonTitle,
              message: m.linkFieldMessage,
            }),
            buildMessageWithLinkButtonField({
              condition: (_, externalData) => {
                return (
                  externalData?.delegatedToCompany.data as {
                    delegatedToCompany: boolean
                  }
                ).delegatedToCompany
              },
              id: 'done.goToServicePortalCompany',
              title: '',
              url: '/minarsidur/fyrirtaeki/listar/althingis-medmaelasofnun',
              buttonTitle: m.linkFieldButtonCompanyTitle,
              message: m.linkFieldCompanyMessage,
            }),
          ],
        }),
      ],
    }),
  ],
})
