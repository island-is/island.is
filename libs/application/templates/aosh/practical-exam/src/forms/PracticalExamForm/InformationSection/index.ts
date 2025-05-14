import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { shared } from '../../../lib/messages'
import { Application, FormValue } from '@island.is/application/types'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { SelfOrOthers } from '../../../utils/enums'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      title: information.general.pageTitle,
      id: 'information',
      description: information.general.pageDescription,
      children: [
        buildTextField({
          id: 'information.nationalId',
          title: shared.labels.ssn,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
            )
            return nationalId
          },
        }),
        buildTextField({
          id: 'information.name',
          title: shared.labels.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            )
            return name
          },
        }),
        buildTextField({
          id: 'information.email',
          title: shared.labels.email,
          backgroundColor: 'blue',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            ) ?? '',
        }),
        buildPhoneField({
          id: 'information.phone',
          title: shared.labels.phone,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildDescriptionField({
          id: 'information.descriptionField',
          title: information.general.descriptionField,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'information.selfOrOthers',
          width: 'half',
          options: [
            {
              value: SelfOrOthers.self,
              label: information.general.registerSelf,
            },
            {
              value: SelfOrOthers.others,
              label: information.general.registerOthers,
            },
          ],
          clearOnChange: [
            'information.countryOfIssue',
            'information.licenseNumber',
          ],
        }),
        buildTextField({
          id: 'information.licenseNumber',
          title: information.general.licenseNumberLabel,
          width: 'half',
          format: '########',
          required: true,
          condition: (answers: FormValue) => {
            const isForSelf = getValueViaPath<SelfOrOthers>(
              answers,
              'information.selfOrOthers',
            )

            return isForSelf === SelfOrOthers.self ? true : false
          },
        }),
        buildSelectField({
          id: `information.countryOfIssue`,
          width: 'half',
          title: information.general.countryLabel,
          defaultValue: SelfOrOthers.self,
          condition: (answers: FormValue) => {
            const isForSelf = getValueViaPath<SelfOrOthers>(
              answers,
              'information.selfOrOthers',
            )
            return isForSelf === SelfOrOthers.self ? true : false
          },
          options: () => {
            const iceland = {
              name: 'Iceland',
              name_is: 'Ísland',
              format: '###-####',
              flag: '🇮🇸',
              code: 'IS',
              dial_code: '+354',
            }

            const countries = getAllCountryCodes().filter(
              (country) => country.code !== 'IS',
            )

            return [
              {
                label: iceland.name_is || iceland.name,
                value: iceland.name_is,
              },
              ...countries.map((country) => ({
                label: country.name_is || country.name,
                value: country.name_is || country.name,
              })),
            ]
          },
          required: true,
          isClearable: true,
        }),
        buildCustomField({
          id: '',
          component: 'InformationValidation',
          condition: (answers: FormValue) => {
            const selfOrOthers = getValueViaPath<SelfOrOthers>(
              answers,
              'information.selfOrOthers',
            )
            return selfOrOthers === SelfOrOthers.self ? true : false
          },
        }),
      ],
    }),
  ],
})
