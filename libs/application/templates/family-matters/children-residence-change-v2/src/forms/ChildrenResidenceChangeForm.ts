import {
  buildForm,
  buildSection,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCustomField,
  buildSubSection,
  buildMultiField,
  buildSubmitField,
  buildRadioField,
  buildDescriptionField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import { selectDurationInputs } from '../fields/Duration'
import { confirmContractIds } from '../fields/Overview'
import { contactInfoIds } from '../fields/ContactInfo'
import * as m from '../lib/messages'
import {
  ChildrenCustodyInformationApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'
import { Answers } from '../types'

// TODO: Added by Kolibri - 2021-07-05 - Revisit mockdata implementation to prevent
// Continue and Back button from being displayed on production

// const shouldUseMocks = (answers: Answers): boolean => {
//   if (answers.useMocks && answers.useMocks === 'yes') {
//     return true
//   }
//   return false
// }

// const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    // buildSection({
    //   id: 'mockData',
    //   title: 'Mock data',
    //   condition: () => shouldRenderMockDataSubSection,
    //   children: [
    //     buildSubSection({
    //       id: 'useMocks',
    //       title: 'Nota gervigögn?',
    //       children: [
    //         buildRadioField({
    //           id: 'useMocks',
    //           title: 'Nota gervigögn',
    //           options: [
    //             {
    //               value: 'yes',
    //               label: 'Já',
    //             },
    //             {
    //               value: 'no',
    //               label: 'Nei',
    //             },
    //           ],
    //         }),
    //       ],
    //     }),
    //     buildSubSection({
    //       id: 'applicantMock',
    //       title: 'Umsækjandi',
    //       condition: (answers) =>
    //         shouldUseMocks((answers as unknown) as Answers),
    //       children: [
    //         buildCustomField({
    //           id: 'mockData.applicant',
    //           title: 'Mock Umsækjandi',
    //           component: 'ApplicantMock',
    //         }),
    //       ],
    //     }),
    //     buildSubSection({
    //       id: 'parentMock',
    //       title: 'Foreldrar',
    //       condition: (answers) =>
    //         shouldUseMocks((answers as unknown) as Answers),
    //       children: [
    //         buildCustomField({
    //           id: 'mockData.parents',
    //           title: 'Mock Foreldrar',
    //           component: 'ParentMock',
    //         }),
    //       ],
    //     }),
    //     buildSubSection({
    //       id: 'childrenMock',
    //       title: 'Börn',
    //       condition: (answers) =>
    //         shouldUseMocks((answers as unknown) as Answers),
    //       children: [
    //         buildCustomField({
    //           id: 'mockData.children',
    //           title: 'Mock Börn',
    //           component: 'ChildrenMock',
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
    buildSection({
      id: 'backgroundInformation',
      title: m.section.backgroundInformation,
      children: [
        buildSubSection({
          id: 'externalData',
          title: m.externalData.general.sectionTitle,
          // condition: (answers) =>
          //   !shouldUseMocks((answers as unknown) as Answers),
          children: [
            buildExternalDataProvider({
              title: m.externalData.general.pageTitle,
              id: 'approveExternalData',
              subTitle: m.externalData.general.subTitle,
              description: m.externalData.general.description,
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  provider: ChildrenCustodyInformationApi,
                  title: m.externalData.children.title,
                  subTitle: m.externalData.children.subTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
                buildDataProviderItem({
                  provider: UserProfileApi,
                  title: m.externalData.userProfile.title,
                  subTitle: m.externalData.userProfile.subTitle,
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
              id: 'selectedChildren',
              title: m.selectChildren.general.pageTitle,
              component: 'SelectChildren',
            }),
          ],
        }),
        buildSubSection({
          id: 'contact',
          title: m.contactInfo.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'contactInfo',
              title: m.contactInfo.general.pageTitle,
              childInputIds: contactInfoIds,
              component: 'ContactInfo',
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
          id: 'childSupportPayments',
          title: m.childSupportPayments.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'childSupportPaymentsMultiField',
              title: m.childSupportPayments.general.sectionTitle,
              description: m.childSupportPayments.general.description,
              children: [
                buildRadioField({
                  id: 'selectChildSupportPayment',
                  title: '',
                  backgroundColor: 'white',
                  required: true,
                  options: [
                    {
                      label: m.childSupportPayments.radioAgreement.title,
                      value: 'agreement',
                      subLabel:
                        m.childSupportPayments.radioAgreement.description,
                    },
                    {
                      label: m.childSupportPayments.radioChildSupport.title,
                      value: 'childSupport',
                      subLabel:
                        m.childSupportPayments.radioChildSupport.description,
                    },
                  ],
                }),
                buildAlertMessageField({
                  id: 'alert',
                  title: '',
                  message: m.childSupportPayments.general.alert,
                  alertType: 'info',
                  condition: (values) =>
                    (values as unknown as Answers).selectChildSupportPayment ===
                    'agreement',
                }),
                buildDescriptionField({
                  id: 'infoText',
                  title: '',
                  space: 2,
                  description: m.childSupportPayments.general.infoText,
                }),
              ],
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
              childInputIds: selectDurationInputs,
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
        buildSubSection({
          id: 'approveTerms',
          title: m.terms.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'approveTerms',
              title: m.terms.general.pageTitle,
              component: 'Terms',
            }),
          ],
        }),
        buildSubSection({
          id: 'approveChildSupportTerms',
          title: m.childSupport.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'approveChildSupportTerms',
              title: m.childSupport.general.pageTitle,
              component: 'ChildSupport',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.section.overview,
      children: [
        buildMultiField({
          id: 'confirmContract',
          title: m.contract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'confirmContract',
              title: m.contract.general.pageTitle,
              childInputIds: confirmContractIds,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assign',
              title: '',
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: m.application.confirm,
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
