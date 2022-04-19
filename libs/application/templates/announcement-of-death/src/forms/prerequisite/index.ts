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
        id: 'prerequisite',
        title: 'Forsöfnun gagna',
        children: [
          buildMultiField({
            title: 'Staðfesting',
            children: [
              buildDescriptionField({
                id: 'disclaimer',
                title: 'Gögn um dánarbú',
                description:
                  'Ef þú heldur áfram munu gögn um verða sótt um hvort þú sért aðstandi að dánarbúi eður ei.',
              }),
              buildDescriptionField({
                id: 'disclaimer-2',
                title: 'Fyrir forritara',
                description:
                  'Spurning hvort það eigi ekki bara að færa allt gagnasöfnunarskrefið hingað? Hvað segja hönnuðir?',
              }),
              buildSubmitField({
                id: 'submit',
                title: 'Samþykkja',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: 'Samþykki að sækja dánarbúsuppýsingar',
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),

      buildSection({
        id: 'prereq-intro',
        title: 'Inngangur',
        children: [
          buildDescriptionField({
            id: 'pod-desc',
            title: '',
            defaultValue: '',
            description: '',
          }),
        ],
      }),
      buildSection({
        id: 'prereq-data',
        title: 'Gagnaöflun',
        children: [],
      }),
      buildSection({
        id: 'prereq-info',
        title: 'Upplýsingar',
        children: [],
      }),
      buildSection({
        id: 'prereq-overview',
        title: 'Yfirlit',
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
