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
            ],
          }),
          subSectionDelegate,
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
                    name: 'Staðfesta andlátstilkynnningu',
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
