import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildDescriptionField,
  buildKeyValueField,
  buildSubmitField,
  getValueViaPath,
  buildRadioField,
  buildHiddenInput,
  buildNationalIdWithNameField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  DefaultEvents,
  NationalRegistryV3UserApi,
  UserProfileApi,
  ExistingApplicationApi,
  Application,
} from '@island.is/application/types'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum } from '../../types'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import { sectionExistingApplication } from './sectionExistingApplication'
import kennitala from 'kennitala'
import format from 'date-fns/format'
import { EstateRegistrant } from '@island.is/clients/syslumenn'
import { DeathNoticeApi } from '../../dataProviders'

export const prerequisite = (): Form => {
  return buildForm({
    id: 'AnnouncementOfDeathApplicationDraftForm',
    title: m.applicationTitle,
    logo: CoatOfArms,
    mode: FormModes.DRAFT,
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
                provider: NationalRegistryV3UserApi,
                title: m.dataCollectionNationalRegistryTitle,
                subTitle: m.dataCollectionNationalRegistrySubtitle,
              }),
              buildDataProviderItem({
                provider: UserProfileApi,
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                provider: DeathNoticeApi,
                title: m.dataCollectionEstateTitle,
                subTitle: m.dataCollectionEstateSubtitle,
              }),
              buildDataProviderItem({
                provider: ExistingApplicationApi,
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
                value: ({
                  externalData: {
                    syslumennOnEntry: { data },
                  },
                }) =>
                  (data as { estate: EstateRegistrant }).estate
                    .nameOfDeceased as string,
                colSpan: ['1/2', '1/2', '1/3'],
              }),
              buildKeyValueField({
                label: m.deceasedNationalId,
                value: ({
                  externalData: {
                    syslumennOnEntry: { data },
                  },
                }) =>
                  kennitala.format(
                    (data as { estate: EstateRegistrant }).estate
                      .nationalIdOfDeceased as string,
                  ),
                colSpan: ['1/2', '1/2', '1/3'],
              }),
              buildKeyValueField({
                label: m.deceasedDate,
                value: ({
                  externalData: {
                    syslumennOnEntry: { data },
                  },
                }) => {
                  return format(
                    new Date(
                      (data as { estate: EstateRegistrant }).estate
                        .dateOfDeath as unknown as string,
                    ),
                    'dd.MM.yyyy',
                  )
                },
                colSpan: ['1/1', '1/1', '1/3'],
              }),
              buildDescriptionField({
                space: 'containerGutter',
                description: m.roleConfirmationDescription,
                id: 'roleConfirmationDescription',
              }),
              buildDescriptionField({
                space: 2,
                marginBottom: 'gutter',
                description: m.roleConfirmationNotice,
                id: 'roleConfirmationNotice',
              }),
              buildRadioField({
                id: 'pickRole.roleConfirmation',
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
              buildHiddenInput({
                id: 'caseNumber',
                defaultValue: (application: Application) => {
                  return getValueViaPath(
                    application.externalData,
                    'syslumennOnEntry.data.estate.caseNumber',
                  )
                },
              }),
              buildHiddenInput({
                id: 'marriageSettlement',
                defaultValue: (application: Application) => {
                  return getValueViaPath(
                    application.externalData,
                    'syslumennOnEntry.data.estate.marriageSettlement',
                  )
                },
              }),
              buildHiddenInput({
                id: 'districtCommissionerHasWill',
                defaultValue: (application: Application) => {
                  return getValueViaPath(
                    application.externalData,
                    'syslumennOnEntry.data.estate.districtCommissionerHasWill',
                  )
                },
              }),
              buildDescriptionField({
                id: 'delegateRoleDisclaimer',
                description: m.delegateRoleDisclaimer,
                condition: (answers) =>
                  getValueViaPath(answers, 'pickRole.roleConfirmation') ===
                  RoleConfirmationEnum.DELEGATE,
              }),
              buildNationalIdWithNameField({
                id: 'pickRole.electPerson',
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
