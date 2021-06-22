import {
  Application,
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { ComplaintsToAlthingiOmbudsman } from '../lib/dataSchema'
import { dataProvider, information, section } from '../lib/messages'

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
          title: dataProvider.header,
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
        buildCustomField({
          id: 'information.toComplainer',
          title: section.information,
          component: 'InformationToComplainer',
        }),
        buildSubSection({
          id: 'information.section.aboutTheComplainer',
          title: section.informationToComplainer,
          children: [
            buildMultiField({
              id: 'information.aboutTheComplainer',
              title: information.general.aboutTheComplainerTitle,
              children: [
                buildTextField({
                  id: 'information.name',
                  title: information.aboutTheComplainer.name,
                  backgroundColor: 'blue',
                  disabled: true,
                  required: true,
                  defaultValue: (application: ComplaintsToAlthingiOmbudsman) =>
                    application.externalData?.nationalRegistry?.data?.fullName,
                }),
                buildTextField({
                  id: 'information.ssn',
                  title: information.aboutTheComplainer.ssn,
                  format: '######-####',
                  backgroundColor: 'blue',
                  disabled: true,
                  width: 'half',
                  defaultValue: (application: Application) =>
                    (application.externalData.nationalRegistry?.data as {
                      nationalId?: string
                    })?.nationalId,
                }),
                buildTextField({
                  id: 'information.address',
                  title: information.aboutTheComplainer.address,
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                  defaultValue: (application: ComplaintsToAlthingiOmbudsman) =>
                    application.externalData?.nationalRegistry?.data?.address
                      ?.streetAddress,
                }),
                buildTextField({
                  id: 'information.postcode',
                  title: information.aboutTheComplainer.postcode,
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                  defaultValue: (application: ComplaintsToAlthingiOmbudsman) =>
                    application.externalData?.nationalRegistry?.data?.address
                      ?.postalCode,
                }),
                buildTextField({
                  id: 'information.city',
                  title: information.aboutTheComplainer.city,
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                  defaultValue: (application: ComplaintsToAlthingiOmbudsman) =>
                    application.externalData?.nationalRegistry?.data?.address
                      ?.city,
                }),
                buildTextField({
                  id: 'information.email',
                  title: information.aboutTheComplainer.email,
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                  variant: 'email',
                  defaultValue: (application: ComplaintsToAlthingiOmbudsman) =>
                    application.externalData?.userProfile?.data?.email,
                }),
                buildTextField({
                  id: 'information.phone',
                  title: information.aboutTheComplainer.phone,
                  format: '###-####',
                  backgroundColor: 'blue',
                  required: true,
                  width: 'half',
                  variant: 'tel',
                  defaultValue: (application: ComplaintsToAlthingiOmbudsman) =>
                    application.externalData?.userProfile?.data
                      ?.mobilePhoneNumber,
                }),
              ],
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
