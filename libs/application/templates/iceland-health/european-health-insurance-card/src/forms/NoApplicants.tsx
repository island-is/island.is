import { Application } from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  formatText,
} from '@island.is/application/core'

import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import {
  getEhicResponse,
  getFullName,
  getPlasticExpiryDate,
  hasAPDF,
  hasPlastic,
  someAreInsuredButCannotApply,
  someAreNotInsured,
  someHavePDF,
} from '../lib/helpers/applicantHelper'
import { Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

export const NoApplicants: Form = buildForm({
  id: 'NoApplicants',
  mode: FormModes.COMPLETED,

  children: [
    buildMultiField({
      id: 'noApplicantsMultifield',
      description: '',
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
              if (
                x.isInsured &&
                !x.canApply &&
                !x.canApplyForPDF &&
                hasAPDF(x) &&
                hasPlastic(x)
              ) {
                applying.push({
                  value: x.applicantNationalId ?? '',
                  label: getFullName(application, x.applicantNationalId) ?? '',
                  disabled: true,
                  subLabel: getPlasticExpiryDate(x)
                    ? formatText(
                        e.temp.sectionPlasticExpiryDate,
                        application,
                        useLocale().formatMessage,
                      ) +
                      ' ' +
                      getPlasticExpiryDate(x)?.toLocaleDateString('is-IS')
                    : '',
                })
              }
            })
            return applying
          },
        }),

        buildDescriptionField({
          id: 'break3',
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
          condition: (_, externalData) =>
            someAreNotInsured(externalData) ||
            someAreInsuredButCannotApply(externalData),
        }),

        buildCheckboxField({
          id: 'notApplicable',
          backgroundColor: 'white',
          title: e.no.sectionTitle,
          description: e.no.sectionDescription,
          condition: (_, externalData) =>
            someAreNotInsured(externalData) ||
            someAreInsuredButCannotApply(externalData),
          options: (application: Application) => {
            const applying: Array<Option> = []
            getEhicResponse(application).forEach((x) => {
              if (
                !x.canApply &&
                !x.canApplyForPDF &&
                !hasAPDF(x) &&
                !hasPlastic(x)
              ) {
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
    }),
  ],
})

export default NoApplicants
