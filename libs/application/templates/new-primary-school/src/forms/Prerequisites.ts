import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes, IdentityApi } from '@island.is/application/types'
import Logo from '../assets/Logo'

import { newPrimarySchoolMessages } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'newPrimarySchoolPrerequisites',
  title: newPrimarySchoolMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: newPrimarySchoolMessages.pre.prerequisitesSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: newPrimarySchoolMessages.pre.externalDataSubSection,
          subTitle: newPrimarySchoolMessages.pre.externalDataDescription,
          checkboxLabel: newPrimarySchoolMessages.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title:
                newPrimarySchoolMessages.pre.nationalRegistryInformationTitle,
              subTitle:
                newPrimarySchoolMessages.pre
                  .nationalRegistryInformationSubTitle,
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
      id: 'schoolSection',
      title: newPrimarySchoolMessages.school.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'relativesSection',
      title: newPrimarySchoolMessages.relatives.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'mealSection',
      title: newPrimarySchoolMessages.meal.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmSection',
      title: newPrimarySchoolMessages.confirm.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusionSection',
      title: newPrimarySchoolMessages.conclusion.overviewTitle,
      children: [],
    }),
  ],
})
