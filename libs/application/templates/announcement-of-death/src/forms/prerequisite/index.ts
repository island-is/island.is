import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  Application,
  buildCustomField,
  buildDescriptionField,
  FormValue,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
  DefaultEvents,
  getValueViaPath,
  buildTextField,
  buildSubSection,
  buildRadioField,
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser, UserProfile } from '../../types/schema'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum } from '../../types'
import CoatOfArms from '../../assets/CoatOfArms'
import { subSectionDelegate } from '../draft/subSectionDelegate'

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
                title: 'Dauðir...',
                subTitle: '...menn segja engar sögur',
              }),
            ],
          }),
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
                value: 'Jóna Jónsdóttir',
                colSpan: ['1/2', '1/2', '1/3'],
              }),
              buildKeyValueField({
                label: m.deceasedNationalId,
                value: '112233-4455',
                colSpan: ['1/2', '1/2', '1/3'],
              }),
              buildKeyValueField({
                label: m.deceasedDate,
                value: '05.02.2022',
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
                id: 'roleConfirmation',
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
                id: 'electPerson',
                component: 'ElectPerson',
                condition: (answers) =>
                  getValueViaPath(answers, 'roleConfirmation') ===
                  RoleConfirmationEnum.DELEGATE,
              }),
              buildSubmitField({
                id: 'submit',
                placement: 'footer',
                title: 'Halda áfram',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: 'Halda áfram',
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
          subSectionDelegate,
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

export const isDelegating = (formValue: FormValue) => {
  const roleConfirmationContinue = getValueViaPath(
    formValue,
    'roleConfirmationContinue.answer',
  ) as RoleConfirmationEnum
  return roleConfirmationContinue === RoleConfirmationEnum.DELEGATE
}
