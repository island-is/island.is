import {
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildMultiField,
  buildDescriptionField,
  buildDataProviderItem,
  buildExternalDataProvider,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  UserProfileApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'

export const RequirementsForm: Form = buildForm({
  id: 'RequirementsDraft',
  title: m.requirements.approval.sectionTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prequisites',
      title: m.requirements.approval.sectionTitle,
      children: [
        buildMultiField({
          title: m.requirements.approval.formTitle,
          children: [
            buildDescriptionField({
              id: 'prerequisites.description_one',
              description: m.requirements.approval.introPartOne,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_two',
              description: m.requirements.approval.introPartTwo,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_three',
              description: m.requirements.approval.introPartThree,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_four',
              description: m.requirements.approval.introPartFour,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_five',
              description: m.requirements.approval.introPartFive,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      title: m.dataproviders.provider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataproviders.provider.title,
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.dataproviders.userProfile.title,
              subTitle: m.dataproviders.userProfile.description,
            }),
          ],
          submitField: buildSubmitField({
            id: 'toDraft',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
