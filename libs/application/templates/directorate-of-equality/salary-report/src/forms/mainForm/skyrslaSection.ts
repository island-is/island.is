import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'
import { DEFAULT_CRITERIA_ANSWERS } from '../../lib/constants'

export const skyrslaSection = buildSection({
  id: 'report',
  title: messages.report.section.sectionTitle,
  children: [
    buildSubSection({
      id: 'dataEntry',
      title: messages.report.dataEntry.sectionTitle,
      children: [
        buildMultiField({
          id: 'dataEntryMultiField',
          title: messages.report.dataEntry.title,
          description: messages.report.dataEntry.intro,
          children: [
            buildCustomField({
              id: 'dataEntry.excelTemplateDownload',
              component: 'ExcelTemplateDownload',
              doesNotRequireAnswer: true,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'criteria',
      title: messages.report.criteria.sectionTitle,
      children: [
        buildMultiField({
          id: 'criteriaMultiField',
          title: messages.report.criteria.title,
          description: messages.report.criteria.intro,
          children: [
            buildCustomField({
              id: 'criteria',
              component: 'CriteriaEditor',
              doesNotRequireAnswer: false,
              defaultValue: DEFAULT_CRITERIA_ANSWERS,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'subCriteria',
      title: messages.report.subCriteria.sectionTitle,
      children: [
        buildMultiField({
          id: 'subCriteriaMultiField',
          title: messages.report.subCriteria.title,
          description: messages.report.subCriteria.intro,
          children: [
            buildCustomField({
              id: 'subCriteria',
              component: 'SubCriteriaEditor',
              doesNotRequireAnswer: false,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'employees',
      title: messages.report.employees.sectionTitle,
      children: [
        buildMultiField({
          id: 'employeesMultiField',
          title: messages.report.employees.title,
          description: messages.report.employees.intro,
          children: [
            buildCustomField({
              id: 'employees',
              component: 'EmployeesEditor',
              doesNotRequireAnswer: true,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'jobClassification',
      title: messages.report.jobClassification.sectionTitle,
      children: [
        buildMultiField({
          id: 'jobClassificationMultiField',
          title: messages.report.jobClassification.title,
          description: messages.report.jobClassification.intro,
          children: [
            buildCustomField({
              id: 'roles',
              component: 'JobClassificationEditor',
              doesNotRequireAnswer: true,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'employeeClassification',
      title: messages.report.employeeClassification.sectionTitle,
      children: [
        buildMultiField({
          id: 'employeeClassificationMultiField',
          title: messages.report.employeeClassification.title,
          description: messages.report.employeeClassification.intro,
          children: [
            buildDescriptionField({
              id: 'employeeClassification.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
