import { FormValue } from '@island.is/application/types'
import { getCommentFromExternalData } from '../../utils'
import {
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { buildDescriptionField } from '@island.is/application/core'
import { buildAlertMessageField } from '@island.is/application/core'
import { getFullNameFromExternalData } from '../../utils'
import { buildCheckboxField } from '@island.is/application/core'
import * as m from '../../lib/messages'

export const noHealthInsuranceSection = buildSection({
  id: 'notHealthInsuredSection',
  title: m.application.notHealthInusred.sectionTitle,
  children: [
    buildMultiField({
      id: 'notHealthInsuredMultiField',
      title: m.application.notHealthInusred.sectionDescription,
      children: [
        buildDescriptionField({
          id: 'notHealthInsuredDescriptionField',
          description:
            m.application.notHealthInusred.descriptionFieldDescription,
        }),
        buildAlertMessageField({
          id: 'notHealthInsuredAlertMessage',
          alertType: 'warning',
          message: ({ externalData }) =>
            getCommentFromExternalData(externalData),
          condition: (answers) => {
            const isHealthInsuredComment =
              getValueViaPath<string>(answers, 'isHealthInsuredComment') ?? ''
            return isHealthInsuredComment?.length > 0
          },
        }),
        buildCheckboxField({
          id: 'notHealthInsuredCheckboxField',
          disabled: true,
          options: () => [
            {
              value: '',
              label: ({ externalData }) =>
                getFullNameFromExternalData(externalData),
            },
          ],
        }),
      ],
    }),
  ],
  condition: (answers: FormValue) => {
    const isHealthInsured = getValueViaPath<boolean>(answers, 'isHealthInsured')
    return isHealthInsured !== undefined && !isHealthInsured
  },
})
