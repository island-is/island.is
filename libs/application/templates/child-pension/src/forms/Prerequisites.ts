import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
  ChildrenCustodyInformationApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { childPensionFormMessage } from '../lib/messages'
import { NationalRegistryResidenceHistoryApi } from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'ChildPensionPrerequisites',
  title: childPensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: childPensionFormMessage.pre.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'externalData',
          title: childPensionFormMessage.pre.externalDataSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: childPensionFormMessage.pre.externalDataSection,
              subTitle: childPensionFormMessage.pre.externalDataDescription,
              checkboxLabel: childPensionFormMessage.pre.checkboxProvider,
              submitField: buildSubmitField({
                id: 'submit',
                placement: 'footer',
                title: childPensionFormMessage.pre.startApplication,
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: 'SUBMIT',
                    name: childPensionFormMessage.pre.startApplication,
                    type: 'primary',
                  },
                ],
              }),
              dataProviders: [
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: childPensionFormMessage.pre.registryIcelandTitle,
                  subTitle: childPensionFormMessage.pre.registryIcelandSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryResidenceHistoryApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: UserProfileApi,
                  title: childPensionFormMessage.pre.userProfileTitle,
                  subTitle: childPensionFormMessage.pre.userProfileSubTitle,
                }),
                buildDataProviderItem({
                  provider: ChildrenCustodyInformationApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: NationalRegistrySpouseApi,
                  title: '',
                }),
                buildDataProviderItem({
                  // add tr provider when needed
                  title: childPensionFormMessage.pre.trTitle,
                  subTitle: childPensionFormMessage.pre.trDescription,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: childPensionFormMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'additionalInfo',
      title: childPensionFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: childPensionFormMessage.confirm.section,
      children: [],
    }),
  ],
})
