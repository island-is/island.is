import {
  buildCheckboxField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { assets } from './sections/assets'
import { debts } from './sections/debts'
import { heirs } from './sections/heirs'
import { funeralCost } from './sections/funeralCost'
import { applicant } from './sections/applicant'
import { dataCollection } from './sections/dataCollection'
import { deceased } from './sections/deceased'
import { YES } from '../lib/constants'
import { applicationInfo } from './sections/applicationInfo'
import { preSelection } from './sections/applicationTypeSelection'
import { prePaidHeirs } from './sections/prepaidInheritance/heirs'
import { prePaidDataCollection } from './sections/prepaidInheritance/dataCollection'
import { inheritanceExecutor } from './sections/prepaidInheritance/inheritanceExecutor'
import { inheritance } from './sections/prepaidInheritance/inheritance'
import { prepaidOverview } from './sections/prepaidInheritance/overview'

export const prePaidForm: Form = buildForm({
  id: 'prePaidInheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'setup',
      title: 'Tegund umsókna',
      children: [],
    }),
    prePaidDataCollection,
    inheritanceExecutor,
    inheritance,
    assets,
    prePaidHeirs,
    prepaidOverview
  ]
})

export const form: Form = buildForm({
  id: 'inheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    preSelection,
    deceased,
    dataCollection,
    applicationInfo,
    applicant,
    assets,
    funeralCost,
    debts,
    heirs,
    buildSection({
      id: 'finalStep',
      title: m.readyToSubmit,
      children: [
        buildMultiField({
          id: 'finalStep',
          title: m.readyToSubmit,
          description: m.beforeSubmitStatement,
          children: [
            buildCheckboxField({
              id: 'confirmAction',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label: m.inheritanceReportSubmissionCheckbox,
                },
              ],
            }),
            buildSubmitField({
              id: 'inheritanceReport.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitReport,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
