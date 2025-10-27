import {
  buildForm,
  buildSection,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
  YesOrNoEnum,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { contactInfoParentBIds } from '../fields/ContactInfoParentB'
import * as m from '../lib/messages'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: DistrictCommissionersLogo,
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
      condition: (answers) => answers.acceptContract === YesOrNoEnum.YES,
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
      condition: (answers) => answers.acceptContract === YesOrNoEnum.YES,
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
      condition: (answers) => answers.acceptContract === YesOrNoEnum.YES,
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
      condition: (answers) => answers.acceptContract === YesOrNoEnum.YES,
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
      condition: (answers) => answers.acceptContract === YesOrNoEnum.NO,
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
      condition: (answers) => answers.acceptContract === YesOrNoEnum.NO,
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
