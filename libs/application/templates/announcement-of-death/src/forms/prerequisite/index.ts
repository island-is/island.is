import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildDescriptionField,
  buildKeyValueField,
  buildSubmitField,
  DefaultEvents,
  getValueViaPath,
  buildRadioField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum } from '../../types'
import CoatOfArms from '../../assets/CoatOfArms'
import { sectionExistingApplication } from './sectionExistingApplication'
import kennitala from 'kennitala'
import format from 'date-fns/format'

export const prerequisite = (): Form => {
  return buildForm({
    id: 'AnnouncementOfDeathApplicationDraftForm',
    title: '', // m.applicationTitle,
    logo: CoatOfArms,
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.dataCollectionTitle,
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
                id: 'deathNotice',
                type: 'DeathNoticeProvider',
                title: m.dataCollectionEstateTitle,
                subTitle: m.dataCollectionEstateSubtitle,
              }),
              buildDataProviderItem({
                id: 'existingApplication',
                type: 'ExistingApplicationProvider',
                title: '',
              }),
            ],
          }),
          sectionExistingApplication,
        ],
      }),
      buildSection({
        id: 'roleConfirmation',
        title: m.roleConfirmationSectionTitle,
        children: [
          buildMultiField({
            id: 'list',
            title: m.roleConfirmationHeading,
            children: [
              buildKeyValueField({
                label: m.deceasedName,
                value: ({ answers }) => answers.nameOfDeceased as string,
                colSpan: ['1/2', '1/2', '1/3'],
              }),
              buildKeyValueField({
                label: m.deceasedNationalId,
                value: ({ answers }) =>
                  kennitala.format(answers.nationalIdOfDeceased as string),
                colSpan: ['1/2', '1/2', '1/3'],
              }),
              buildKeyValueField({
                label: m.deceasedDate,
                value: ({ answers }) =>
                  format(new Date(answers.dateOfDeath as string), 'dd.MM.yyyy'),
                colSpan: ['1/1', '1/1', '1/3'],
              }),
              buildDescriptionField({
                title: '',
                space: 2,
                description: m.roleConfirmationDescription,
                id: 'roleConfirmationDescription',
              }),
              buildDescriptionField({
                title: '',
                space: 2,
                description: m.roleConfirmationNotice,
                id: 'roleConfirmationNotice',
              }),
              buildRadioField({
                id: 'pickRole.roleConfirmation',
                title: '',
                options: [
                  {
                    value: RoleConfirmationEnum.CONTINUE,
                    label: m.roleConfirmationContinue,
                  },
                  {
                    value: RoleConfirmationEnum.DELEGATE,
                    label: m.roleConfirmationDelegate,
                  },
                ],
                width: 'full',
              }),
              buildCustomField({
                title: '',
                id: 'pickRole.electPerson',
                component: 'ElectPerson',
                condition: (answers) =>
                  getValueViaPath(answers, 'pickRole.roleConfirmation') ===
                  RoleConfirmationEnum.DELEGATE,
              }),
              buildSubmitField({
                id: 'submit',
                placement: 'footer',
                title: 'Halda áfram',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    name: 'Senda áfram',
                    type: 'subtle',
                    event: DefaultEvents.REJECT,
                    condition: (answers) =>
                      getValueViaPath(answers, 'pickRole.roleConfirmation') ===
                      RoleConfirmationEnum.DELEGATE,
                  },
                  {
                    name: 'Halda áfram',
                    type: 'primary',
                    event: DefaultEvents.SUBMIT,
                    condition: (answers) =>
                      getValueViaPath(answers, 'pickRole.roleConfirmation') !==
                      RoleConfirmationEnum.DELEGATE,
                  },
                ],
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'info',
        title: m.infoSectionTitle,
        children: [],
      }),
      buildSection({
        id: 'overview',
        title: m.overviewSectionTitle,
        children: [],
      }),
    ],
  })
}
