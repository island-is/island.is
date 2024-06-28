import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  ChildrenCustodyInformationApi,
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../lib/messages'
import {
  GetSchoolsApi,
  GetTypesApi,
  GetUserApi,
  OptionsApi,
} from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'newPrimarySchoolPrerequisites',
  title: newPrimarySchoolMessages.shared.formTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: newPrimarySchoolMessages.pre.externalDataSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: newPrimarySchoolMessages.pre.externalDataSection,
          subTitle: newPrimarySchoolMessages.pre.externalDataDescription,
          checkboxLabel: newPrimarySchoolMessages.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: newPrimarySchoolMessages.pre.startApplication,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title:
                newPrimarySchoolMessages.pre.nationalRegistryInformationTitle,
              subTitle:
                newPrimarySchoolMessages.pre
                  .nationalRegistryInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: newPrimarySchoolMessages.pre.userProfileInformationTitle,
              subTitle:
                newPrimarySchoolMessages.pre.userProfileInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: GetTypesApi,
              title: 'Type',
            }),
            buildDataProviderItem({
              provider: OptionsApi,
              title: 'OPtions',
            }),
            // buildDataProviderItem({
            //   provider: GetUserApi,
            //   title: 'usr',
            // }),
            buildDataProviderItem({
              provider: GetSchoolsApi,
              title: 'schools',
            }),
          ],
        }),
      ],
    }),
  ],
})
