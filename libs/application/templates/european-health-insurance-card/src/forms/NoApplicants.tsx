import { Application } from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import { buildCheckboxField, buildForm } from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import {
  getEhicResponse,
  getFullName,
  hasAPDF,
  someHavePDF,
} from '../lib/helpers/applicantHelper'
import { Option } from '@island.is/application/types'

export const NoApplicants: Form = buildForm({
  id: 'NoApplicants',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildCheckboxField({
      id: 'havePdf',
      backgroundColor: 'white',
      title: e.noApplicants.checkboxTitle,
      description: e.noApplicants.checkboxDescription,
      condition: (_, externalData) => someHavePDF(externalData),
      options: (application: Application) => {
        const applying: Array<Option> = []
        getEhicResponse(application).forEach((x) => {
          if (x.isInsured && hasAPDF(x)) {
            applying.push({
              value: x.applicantNationalId ?? '',
              label: getFullName(application, x.applicantNationalId) ?? '',
              disabled: true,
            })
          }
        })
        return applying
      },
    }),
  ],
})

export default NoApplicants
