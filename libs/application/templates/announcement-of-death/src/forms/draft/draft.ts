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
  buildRadioField,
} from '@island.is/application/core'
import { subSectionDelegate } from './subSectionDelegate'
import { subSectionInfo } from './subSectionInfo'
import { subSectionInheritance } from './subSectionInheritance'
import { subSectionWillAndTrade } from './subSectionWillAndTrade'
import { subSectionProperties } from './subSectionProperties'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser, UserProfile } from '../../types/schema'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum } from '../../types'
import CoatOfArms from '../../assets/CoatOfArms'
import { subSectionFiles } from './subSectionFiles'

export const draft = (): Form => {
  return buildForm({
    id: 'AnnouncementOfDeathApplicationDraftForm',
    title: '', // m.applicationTitle,
    logo: CoatOfArms,
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'roleConfirmation',
        title: m.roleConfirmationSectionTitle,
        children: [
        ],
      }),
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
        ],
      }),
      buildSection({
        id: 'info',
        title: m.infoSectionTitle,
        children: [
          subSectionInfo,
          subSectionWillAndTrade,
          subSectionInheritance,
          subSectionProperties,
          subSectionFiles,
        ],
      }),
      buildSection({
        id: 'overview',
        title: m.overviewSectionTitle,
        children: [
          buildMultiField({
            id: 'overview',
            title: m.overviewSectionTitle,
            space: 1,
            description: m.overviewSectionDescription,
            children: [
              buildDividerField({}),
              buildKeyValueField({
                label: m.applicantsName,
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).fullName,
              }),
              buildKeyValueField({
                label: m.applicantsNationalId,
                width: 'half',
                value: (application: Application) =>
                  formatNationalId(application.applicant),
              }),
              buildKeyValueField({
                label: m.applicantsAddress,
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).address
                    ?.streetAddress,
              }),
              buildKeyValueField({
                label: m.applicantsCity,
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).address
                    ?.postalCode +
                  ', ' +
                  (nationalRegistry.data as NationalRegistryUser).address?.city,
              }),
              buildKeyValueField({
                label: m.applicantsEmail,
                width: 'half',
                value: ({ externalData: { userProfile } }) =>
                  (userProfile.data as UserProfile).email as string,
              }),
              buildKeyValueField({
                label: m.applicantsPhoneNumber,
                width: 'half',
                value: ({ externalData: { userProfile } }) =>
                  (userProfile.data as UserProfile).mobilePhoneNumber as string,
              }),
              buildDividerField({}),
              buildSubmitField({
                id: 'submit',
                title: '',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.submitApplication,
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
}

export const isDelegating = (formValue: FormValue) => {
  const roleConfirmationContinue = getValueViaPath(
    formValue,
    'roleConfirmationContinue.answer',
  ) as RoleConfirmationEnum
  return roleConfirmationContinue === RoleConfirmationEnum.DELEGATE
}
