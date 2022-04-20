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
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser, UserProfile } from '../../types/schema'
import get from 'lodash/get'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum } from '../../types'
import CoatOfArms from '../../assets/CoatOfArms'

export const prerequisite = (): Form => {
  return buildForm({
    id: 'AnnouncementOfDeathApplicationPrerequisiteForm',
    title: 'Forsenduskref', // m.applicationTitle,
    mode: FormModes.APPLYING,
    logo: CoatOfArms,
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
            ],
          }),
        ],
      }),
      buildMultiField({
        id: 'externalDataSuccess',
        title: 'Tókst að sækja gögn',
        children: [
          buildDescriptionField({
            id: 'externalDataSuccessDescription',
            title: '',
            description: (application: Application) =>
              `Jæja ${get(
                application.externalData,
                'nationalRegistry.data.fullName',
                'félagi',
              )}. Tókst að sækja gögn`,
          }),
          buildSubmitField({
            id: 'toDraft',
            placement: 'footer',
            title: 'Hefja umsókn',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: 'Hefja umsókn',
                type: 'primary',
              },
            ],
          }),
        ],
      }),
      buildDescriptionField({
        id: 'neverDisplayed',
        title: '',
        description: '',
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
