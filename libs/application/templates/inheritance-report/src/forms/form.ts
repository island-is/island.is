import {
  buildCheckboxField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { UserProfile, Application } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import { removeCountryCode } from '@island.is/application/ui-components'

export const form: Form = buildForm({
  id: 'inheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'dataCollection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              id: 'estateNoticeProvider',
              type: '', //'EstateNoticeProvider'
              title: m.deceasedInfoProviderTitle,
              subTitle: m.deceasedInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.personalInfoProviderTitle,
              subTitle: m.personalInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              id: 'financialInformation',
              type: '',
              title: m.financialInformationProviderTitle,
              subTitle: m.financialInformationProviderSubtitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.settingsInfoProviderTitle,
              subTitle: m.settingsInfoProviderSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicantsInformation',
      title: m.applicantsInfo,
      children: [
        buildMultiField({
          id: 'applicant',
          title: m.applicantsInfo,
          description: m.applicantsInfoSubtitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return formatNationalId(
                  externalData.nationalRegistry?.data.nationalId,
                )
              },
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.address.streetName
              },
            }),
            buildTextField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              format: '###-####',
              defaultValue: (application: Application) => {
                const phone =
                  (application.externalData.userProfile?.data as {
                    mobilePhoneNumber?: string
                  })?.mobilePhoneNumber ?? ''

                return removeCountryCode(phone)
              },
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                const data = externalData.userProfile?.data as UserProfile
                return data?.email
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'inheritanceReportSubmit',
      title: m.irSubmitTitle,
      children: [
        buildMultiField({
          id: 'deceasedInfo',
          title: m.irSubmitTitle,
          description: m.irSubmitSubtitle,
          children: [
            buildKeyValueField({
              label: m.nameOfTheDeceased,
              value:
                /*({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (isEstateInfo(data) ? data.estate.nameOfDeceased : '')*/ '',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.nationalId,
              value:
                /*({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateInfo(data)
                  ? formatKennitala(data.estate.nationalIdOfDeceased)
                  : ''*/ '',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'spaceDIF',
              space: 'gutter',
              title: '',
            }),
            buildKeyValueField({
              label: m.address,
              value:
                /*({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (isEstateInfo(data) ? data.estate.addressOfDeceased : '')*/ '',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.deathDate,
              value:
                /*({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateInfo(data)
                  ? format(new Date(data.estate.dateOfDeath), 'dd/MM/yyyy')
                  : m.deathDateNotRegistered */ '',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'undividedEstate',
              title: '',
              defaultValue: '',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: 'YES',
                  label: 'Arfleifandi sat í óskiptu búi',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
