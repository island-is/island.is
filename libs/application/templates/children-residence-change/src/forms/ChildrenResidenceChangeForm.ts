import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCustomField,
  buildSubSection,
  buildMultiField,
  buildSubmitField,
  DefaultEvents,
  buildRadioField,
  buildTextField,
  Application,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'mockData',
      title: 'Mock data',
      children: [
        buildMultiField({
          id: 'mockMulti',
          title: '',
          children: [
            buildRadioField({
              id: 'useMocks',
              title: 'Nota gervigögn',
              options: [
                {
                  value: 'yes',
                  label: 'Já',
                },
                {
                  value: 'no',
                  label: 'Nei',
                },
              ],
            }),
            buildCustomField({
              id: 'mockData',
              title: 'Mock data',
              component: 'MockData',
              condition: (answers) => answers.useMocks === 'yes',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'backgroundInformation',
      title: m.section.backgroundInformation,
      children: [
        buildSubSection({
          id: 'externalData',
          title: m.externalData.general.sectionTitle,
          children: [
            buildExternalDataProvider({
              title: m.externalData.general.pageTitle,
              id: 'approveExternalData',
              subTitle: m.externalData.general.subTitle,
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: 'NationalRegistryProvider',
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
                buildDataProviderItem({
                  id: 'childrenNationalRegistry',
                  type: 'ChildrenNationalRegistryProvider',
                  title: m.externalData.children.title,
                  subTitle: m.externalData.children.subTitle,
                }),
                buildDataProviderItem({
                  id: 'parentNationalRegistry',
                  type: 'ParentNationalRegistryProvider',
                  title: m.externalData.otherParents.title,
                  subTitle: m.externalData.otherParents.title,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: 'UserProfileProvider',
                  title: '',
                  subTitle: '',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'selectChildInCustody',
          title: m.selectChildren.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectChild',
              title: m.selectChildren.general.pageTitle,
              component: 'SelectChildren',
            }),
          ],
        }),
        buildSubSection({
          id: 'contact',
          title: m.contactInfo.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'contactInfo',
              title: m.contactInfo.general.pageTitle,
              description: m.contactInfo.general.description,
              children: [
                buildTextField({
                  id: 'parentA.email',
                  title: m.contactInfo.inputs.emailLabel,
                  variant: 'email',
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      email?: string
                    })?.email,
                }),
                buildTextField({
                  id: 'parentA.phoneNumber',
                  title: m.contactInfo.inputs.phoneNumberLabel,
                  variant: 'tel',
                  format: '###-####',
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    })?.mobilePhoneNumber,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'arrangement',
      title: m.section.arrangement,
      children: [
        buildSubSection({
          id: 'residenceChangeReason',
          title: m.reason.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReason',
              title: m.reason.general.pageTitle,
              component: 'Reason',
            }),
          ],
        }),
        buildSubSection({
          id: 'confirmResidenceChangeInfo',
          title: m.newResidence.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'confirmResidenceChangeInfo',
              title: m.newResidence.general.pageTitle,
              component: 'ChangeInformation',
            }),
          ],
        }),
        buildSubSection({
          id: 'duration',
          title: m.duration.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectDuration',
              title: m.duration.general.pageTitle,
              component: 'Duration',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveTerms',
      title: m.section.effect,
      children: [
        buildCustomField({
          id: 'approveTerms',
          title: m.terms.general.pageTitle,
          component: 'Terms',
        }),
      ],
    }),
    buildSection({
      id: 'interview',
      title: m.interview.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'interview',
          title: m.interview.general.pageTitle,
          component: 'Interview',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.section.overview,
      children: [
        buildMultiField({
          id: 'residenceChangeOverview',
          title: m.contract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReview',
              title: m.contract.general.pageTitle,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assign',
              title: '',
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: m.application.signature,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
