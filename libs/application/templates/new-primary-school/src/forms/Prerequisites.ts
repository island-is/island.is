import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
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

export const Prerequisites: Form = buildForm({
  id: 'newPrimarySchoolPrerequisites',
  title: newPrimarySchoolMessages.shared.formTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
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
          ],
        }),
        buildMultiField({
          id: 'hasNoChildren',
          title: newPrimarySchoolMessages.pre.noChildrenFoundTitle,

          children: [
            buildDescriptionField({
              id: 'noChildrenDecsription',
              title: '',
              description: newPrimarySchoolMessages.pre.noChildrenFoundReasons,
            }),
            buildDescriptionField({
              id: 'noChildrenNationalRegistryDescription',
              title: '',
              marginTop: 3,
              description:
                newPrimarySchoolMessages.pre
                  .noChildrenFoundNationalRegistryDescription,
            }),
            buildDescriptionField({
              id: 'noChildrenIslandisInfo',
              title: '',
              marginTop: 2,
              description:
                newPrimarySchoolMessages.pre.noChildrenFoundIslandisDescription,
            }),
            buildDescriptionField({
              id: 'noChildrenNationalRegistryInfo',
              title: '',
              marginTop: 3,
              description:
                newPrimarySchoolMessages.pre
                  .noChildrenFoundNationalRegistryInfo,
            }),
            buildDescriptionField({
              id: 'noChildrenMMSInfo',
              title: '',
              marginTop: 3,
              marginBottom: 6,
              description: newPrimarySchoolMessages.pre.noChildrenFoundMMSInfo,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'childrenNParentsSection',
      title: newPrimarySchoolMessages.childrenNParents.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'primarySchoolSection',
      title: newPrimarySchoolMessages.primarySchool.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'differentNeedsSection',
      title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'overviewSection',
      title: newPrimarySchoolMessages.overview.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusionSection',
      title: newPrimarySchoolMessages.conclusion.sectionTitle,
      children: [],
    }),
  ],
})
