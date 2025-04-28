import { getInsuranceStatus } from '../../utils'
import * as m from '../../lib/messages'
import {
  buildSection,
  buildMultiField,
  buildCheckboxField,
  buildHiddenInput,
} from '@island.is/application/core'
import { HealthInsuranceDeclarationApplication } from '../../types'
import { getChildrenAsOptions } from '../../utils'
import { getSpouseAsOptions } from '../../utils'
import { getApplicantAsOption } from '../../utils'

export const registerPersonsSection = buildSection({
  id: 'registerPersonsSection',
  title: m.application.registerPersons.sectionTitle,
  children: [
    buildMultiField({
      id: 'registerPersonsMultiFiled',
      title: m.application.registerPersons.sectionDescription,
      children: [
        buildCheckboxField({
          id: 'selectedApplicants.registerPersonsApplicantCheckboxField',
          title: m.application.registerPersons.applicantTitle,
          defaultValue: (
            application: HealthInsuranceDeclarationApplication,
          ) => [getApplicantAsOption(application.externalData)[0]?.value],
          options: ({ externalData }) => getApplicantAsOption(externalData),
        }),
        buildCheckboxField({
          id: 'selectedApplicants.registerPersonsSpouseCheckboxField',
          title: m.application.registerPersons.spousetitle,
          options: ({ externalData }) => getSpouseAsOptions(externalData),
          condition: (answers) => {
            return answers?.hasSpouse as boolean
          },
        }),
        buildCheckboxField({
          id: 'selectedApplicants.registerPersonsChildrenCheckboxField',
          title: m.application.registerPersons.childrenTitle,
          options: ({ externalData }) => getChildrenAsOptions(externalData),
          condition: (answers) => {
            return answers?.hasChildren as boolean
          },
        }),
        buildHiddenInput({
          id: 'selectedApplicants.isHealthInsured',
          defaultValue: (application: HealthInsuranceDeclarationApplication) =>
            getInsuranceStatus(application.externalData),
        }),
      ],
    }),
  ],
})
