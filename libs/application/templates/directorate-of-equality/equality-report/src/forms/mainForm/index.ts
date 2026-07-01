import {
  buildAlertMessageField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'

import { FormModes } from '@island.is/application/types'
import { aboutTheCompanySection } from './aboutTheCompanySection'
import { equalityReportSection } from './equalityReportSection'
import { overviewSection } from './overview'
import { messages } from '../../lib/messages'
import format from 'date-fns/format'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'forsendur',
      title: messages.prerequisites.section.sectionTitle,
      children: [
        buildSubSection({
          id: 'previousEqualityPlan',
          title: messages.equalityReport.previousEqualityPlan.sectionTitle,
          condition: (_answers, externalData) =>
            getValueViaPath(
              externalData,
              'activeEqualityReport.data.hasActiveEqualityReport',
            ) === true,
          children: [
            buildMultiField({
              id: 'previousEqualityPlanMultiField',
              title: messages.equalityReport.previousEqualityPlan.title,
              description: messages.equalityReport.previousEqualityPlan.intro,
              children: [
                buildAlertMessageField({
                  id: 'previousEqualityPlan.alert',
                  title:
                    messages.equalityReport.previousEqualityPlan.alertTitle,
                  message: (application: Application) => {
                    const date = getValueViaPath<string>(
                      application.externalData,
                      'activeEqualityReport.data.validUntil',
                    )
                    const formatted = date
                      ? format(new Date(date), 'dd.MM.yyyy')
                      : ''
                    return `Þú ert með gilda jafnréttisáætlun til þann ${formatted}`
                  },
                  alertType: 'success',
                }),
                buildTextField({
                  id: 'previousEqualityPlan.approvedAt',
                  title:
                    messages.equalityReport.previousEqualityPlan.approvedAt,
                  width: 'half',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const date = getValueViaPath<string>(
                      application.externalData,
                      'activeEqualityReport.data.approvedAt',
                    )
                    return date ? format(new Date(date), 'dd.MM.yyyy') : ''
                  },
                }),
                buildTextField({
                  id: 'previousEqualityPlan.validUntil',
                  title:
                    messages.equalityReport.previousEqualityPlan.validUntil,
                  width: 'half',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const date = getValueViaPath<string>(
                      application.externalData,
                      'activeEqualityReport.data.validUntil',
                    )
                    return date ? format(new Date(date), 'dd.MM.yyyy') : ''
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    aboutTheCompanySection,
    equalityReportSection,
    overviewSection,
  ],
})
