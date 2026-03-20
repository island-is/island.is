import { Application } from '@island.is/api/schema'
import {
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSelectField,
  buildTextField,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { ApplicantRelation } from '../../lib/constants'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'

export const registrant = buildSection({
  id: 'registrant',
  title: m.registrantTitle,
  children: [
    buildMultiField({
      id: 'registrant',
      title: m.registrantTitle,
      description: m.applicantsInfoSubtitle,
      children: [
        buildCustomField(
          {
            id: 'registrant',
            component: 'LookupPerson',
            defaultValue: ({ externalData }: Application) => ({
              nationalId: formatNationalId(
                getValueViaPath(
                  externalData,
                  'nationalRegistry.data.nationalId',
                ) ?? '',
              ),
              name:
                getValueViaPath(
                  externalData,
                  'nationalRegistry.data.fullName',
                ) ?? '',
            }),
          },
          {},
        ),
        buildTextField({
          id: 'registrant.address',
          title: m.address,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'nationalRegistry.data.address.streetAddress',
            ) ?? '',
        }),
        buildPhoneField({
          id: 'registrant.phone',
          title: m.phone,
          width: 'half',
          required: true,
          enableCountrySelector: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(
              externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildTextField({
          id: 'registrant.email',
          title: m.email,
          width: 'half',
          required: true,
          defaultValue: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'userProfile.data.email') ?? '',
        }),
        buildSelectField({
          id: 'registrant.relation',
          title: m.applicantRelation,
          width: 'half',
          required: true,
          options: [
            {
              label: m.spouse,
              value: ApplicantRelation.SPOUSE,
            },
            {
              label: m.heir,
              value: ApplicantRelation.HEIR,
            },
            {
              label: m.representative,
              value: ApplicantRelation.REPRESENTATIVE,
            },
            {
              label: m.exchangeManager,
              value: ApplicantRelation.EXCHANGE_MANAGER,
            },
          ],
        }),
      ],
    }),
  ],
})
