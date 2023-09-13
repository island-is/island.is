import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildMultiField,
  buildSubmitField,
  buildDescriptionField,
  buildSubSection,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { childPensionFormMessage } from '../lib/messages'

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
          id: 'forInformation',
          title: childPensionFormMessage.pre.forInfoSection,
          children: [
            buildMultiField({
              id: 'preInfo',
              title: childPensionFormMessage.pre.forInfoSection,
              children: [
                buildDescriptionField({
                  id: 'preInfo.descriptionOne',
                  title: '',
                  description: childPensionFormMessage.pre.forInfoDescription,
                }),
                // Accordion card here
                buildDescriptionField({
                  id: 'preInfo.descriptionTwo',
                  space: 4,
                  title: '',
                  description:
                    childPensionFormMessage.pre.forInfoSecondDescription,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: childPensionFormMessage.pre.externalDataSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: childPensionFormMessage.pre.externalDataSection,
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
                  provider: UserProfileApi,
                  title: childPensionFormMessage.pre.userProfileTitle,
                  subTitle: childPensionFormMessage.pre.userProfileSubTitle,
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
