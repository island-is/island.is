import {
  Application,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/core'
import { complainee, dataProvider, information, section } from '../lib/messages'

export const ComplaintsToAlthingiOmbudsmanApplication: Form = buildForm({
  id: 'ComplaintsToAlthingiOmbudsmanDraftForm',
  title: 'Kvörtun til umboðsmanns Alþingis',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: section.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: dataProvider.dataProviderHeader,
          subTitle: dataProvider.dataProviderSubTitle,
          checkboxLabel: dataProvider.dataProviderCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: dataProvider.nationalRegistryTitle,
              subTitle: dataProvider.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: dataProvider.userProfileTitle,
              subTitle: dataProvider.userProfileSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: section.information,
      children: [
        buildMultiField({
          id: 'information.aboutTheComplainer',
          title: information.general.aboutTheComplainerTitle,
          children: [
            buildTextField({
              id: 'information.name',
              title: information.aboutTheComplainer.name,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  fullName?: string
                })?.fullName || '',
            }),
            buildTextField({
              id: 'information.ssn',
              title: information.aboutTheComplainer.ssn,
              format: '######-####',
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  nationalId?: string
                })?.nationalId || '',
            }),
            buildTextField({
              id: 'information.address',
              title: information.aboutTheComplainer.address,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  address?: {
                    streetAddress?: string
                  }
                })?.address?.streetAddress || '',
            }),
            buildTextField({
              id: 'information.postcode',
              title: information.aboutTheComplainer.postcode,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  address?: {
                    postalCode?: string
                  }
                })?.address?.postalCode || '',
            }),
            buildTextField({
              id: 'information.city',
              title: information.aboutTheComplainer.city,
              backgroundColor: 'white',
              disabled: true,
              width: 'half',
              defaultValue: (application: Application) =>
                (application.externalData?.nationalRegistry?.data as {
                  address?: {
                    city?: string
                  }
                })?.address?.city || '',
            }),
            buildTextField({
              id: 'information.email',
              title: information.aboutTheComplainer.email,
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              variant: 'email',
              defaultValue: (application: Application) =>
                (application.externalData?.userProfile?.data as {
                  email?: string
                })?.email,
            }),
            buildTextField({
              id: 'information.phone',
              title: information.aboutTheComplainer.phone,
              format: '###-####',
              backgroundColor: 'blue',
              required: true,
              width: 'half',
              variant: 'tel',
              defaultValue: (application: Application) =>
                (application.externalData?.userProfile?.data as {
                  mobilePhoneNumber?: string
                })?.mobilePhoneNumber,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'complainee',
      title: section.complainee,
      children: [
        buildMultiField({
          id: 'complaineeInformation',
          title: complainee.general.complaineeTitle,
          children: [
            buildRadioField({
              id: 'complaineeInformation.radio',
              title: '',
              options: [
                { value: 'myself', label: 'Mig' },
                { value: 'other', label: 'Annan' },
              ],
              largeButtons: true,
              width: 'half',
            }),
            buildDescriptionField({
              id: 'complaineeInformation.description',
              title: 'Athugið',
              description: 'hello',
              condition: (formValue) => {
                const radioValue = (formValue.complaineeInformation as FormValue)
                  ?.radio
                return radioValue === 'myself'
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'stepOne',
      title: 'section title',
      children: [
        buildDescriptionField({
          id: 'confirmationCustomField',
          title: 'name',
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
