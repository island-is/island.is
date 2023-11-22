import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { information } from '../../lib/messages'
import { HealthcareLicense } from '@island.is/clients/health-directorate'
import { formatDate } from '../../utils'

export const SelectLicenseSection = buildSection({
  id: 'selectLicenseSection',
  title: information.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'selectLicence.multiField',
      title: 'test',
      children: [
        buildCheckboxField({
          id: 'selectLicence.professions',
          title: '',
          large: true,
          backgroundColor: 'white',
          defaultValue: [],
          options: (application) => {
            const healtcareLicenses = application?.externalData
              ?.healthcareLicenses?.data as HealthcareLicense[]

            return healtcareLicenses.map((x) => ({
              value: x.professionId || '',
              //TODOx translate
              label: x.professionNameIs || '',
              subLabel:
                (x.specialityList.length > 0
                  ? 'Sérgrein: ' +
                    x.specialityList.map((x) => x.specialityNameIs).join(', ')
                  : '') +
                (x.specialityList.length > 0 ? '<br/>' : '') +
                (x.isTemporary
                  ? `Tímabundið starfsleyfi - Gildir til: ${formatDate(
                      x.validTo || new Date(),
                    )}`
                  : ''),
              rightContent: x.isRestricted
                ? 'Takmörkun á starfsleyfi'
                : undefined,
              disabled: x.isRestricted,
            }))
          },
        }),
      ],
    }),
  ],
})
