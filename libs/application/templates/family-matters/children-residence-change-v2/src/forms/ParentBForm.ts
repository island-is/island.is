import {
  buildForm,
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import { contactInfoParentBIds } from '../fields/ContactInfoParentB'
import { ApproveContract } from '../lib/dataSchema'
import * as m from '../lib/messages'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'parentBIntro',
      title: m.parentBIntro.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'acceptContract',
          title: m.parentBIntro.general.pageTitle,
          component: 'ParentBIntro',
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.acceptContract === ApproveContract.Yes,
      id: 'termsParentB',
      title: m.section.effect,
      children: [
        buildSubSection({
          id: 'approveTermsParentB',
          title: m.terms.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'approveTermsParentB',
              title: m.terms.general.pageTitle,
              component: 'Terms',
            }),
          ],
        }),
        buildSubSection({
          id: 'approveChildSupportTermsParentB',
          title: m.childSupport.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'approveChildSupportTermsParentB',
              title: m.childSupport.general.pageTitle,
              component: 'ChildSupport',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.acceptContract === ApproveContract.Yes,
      id: 'contact',
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'contactInfo',
          title: m.contactInfo.general.pageTitle,
          childInputIds: contactInfoParentBIds,
          component: 'ContactInfoParentB',
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.acceptContract === ApproveContract.Yes,
      id: 'residenceChangeOverview',
      title: m.section.overview,
      children: [
        buildMultiField({
          id: 'confirmContractParentB',
          title: m.contract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'confirmContractParentB',
              title: m.contract.general.pageTitle,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
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
      condition: (answers) => answers.acceptContract === ApproveContract.Yes,
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'parentBConfirmation',
          title: m.parentBConfirmation.general.pageTitle,
          component: 'ParentBConfirmation',
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.acceptContract === ApproveContract.No,
      id: 'rejectContract',
      title: m.rejectContract.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'rejectContract',
          title: m.rejectContract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'rejectContract',
              title: m.rejectContract.general.pageTitle,
              component: 'RejectContract',
            }),
            buildSubmitField({
              id: 'reject',
              title: '',
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: m.rejectContract.general.rejectButton,
                  type: 'reject',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.acceptContract === ApproveContract.No,
      id: 'contractRejected',
      title: m.contractRejected.general.sectionTitle.confirmed,
      children: [
        buildCustomField({
          id: 'contractRejected',
          title: m.contractRejected.general.pageTitle,
          component: 'ParentBContractRejected',
        }),
      ],
    }),
  ],
})
