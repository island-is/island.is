import {
  buildForm,
  buildSection,
  buildTextField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildDateField,
  Application,
  buildCustomField,
  buildRadioField,
  buildDescriptionField,
  FormValue,
  buildSelectField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
} from '@island.is/application/core'
import { User } from '@island.is/api/domains/national-registry'
import { format } from 'kennitala'
import { QualityPhotoData } from '../types'
import {
  NationalRegistryUser,
  UserProfile,
  Jurisdiction,
} from '../types/schema'
import { m } from '../lib/messages'

export const getApplication = (): Form => {
  return buildForm({
    id: 'PMarkApplicationDraftForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'conditions',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.dataCollectionTitle,
            subTitle: m.dataCollectionSubtitle,
            description: m.dataCollectionDescription,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: m.dataCollectionDoctorsNoteTitle,
                subTitle: m.dataCollectionDoctorsNoteSubtitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                id: 'qualityPhoto',
                type: 'QualityPhotoProvider',
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                id: 'jurisdictions',
                type: 'JurisdictionProvider',
                title: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'information',
        title: m.informationSectionTitle,
        children: [
          buildMultiField({
            id: 'list',
            title: m.informationTitle,
            children: [
              buildTextField({
                id: 'name',
                title: m.applicantsName,
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) => {
                  const nationalRegistry = application.externalData
                    .nationalRegistry.data as User
                  return nationalRegistry.fullName
                },
              }),
              buildTextField({
                id: 'nationalId',
                title: m.applicantsNationalId,
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) =>
                  format(application.applicant),
              }),
              buildTextField({
                id: 'address',
                title: m.applicantsAddress,
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) => {
                  const nationalRegistry = application.externalData
                    .nationalRegistry.data as User
                  return nationalRegistry.address.streetAddress
                },
              }),
              buildTextField({
                id: 'city',
                title: m.applicantsCity,
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) => {
                  const nationalRegistry = application.externalData
                    .nationalRegistry.data as User
                  return (
                    nationalRegistry.address.postalCode +
                    ', ' +
                    nationalRegistry.address.city
                  )
                },
              }),
              buildTextField({
                id: 'email',
                title: m.applicantsEmail,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const data = application.externalData.userProfile
                    .data as UserProfile
                  return data.email
                },
              }),
              buildTextField({
                id: 'phone',
                title: m.applicantsPhoneNumber,
                variant: 'tel',
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const data = application.externalData.userProfile
                    .data as UserProfile
                  return data.mobilePhoneNumber
                },
              }),
              buildDateField({
                id: 'validityPeriod',
                title: m.cardValidityPeriod,
                width: 'half',
                backgroundColor: 'white',
                defaultValue: () => new Date().toISOString(),
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'photo',
        title: m.qualityPhotoSectionTitle,
        children: [
          buildMultiField({
            id: 'info',
            title: m.qualityPhotoTitle,
            condition: (_, externalData) => {
              return (
                (externalData.qualityPhoto as QualityPhotoData)?.data
                  ?.success === true
              )
            },
            children: [
              buildDescriptionField({
                id: 'descriptionPhoto',
                title: '',
                description: m.qualityPhotoExistingPhotoText,
              }),
              buildCustomField({
                title: '',
                id: 'qphoto',
                component: 'QualityPhoto',
              }),
              buildRadioField({
                id: 'qualityPhoto',
                title: '',
                width: 'half',
                disabled: false,
                options: [
                  { value: 'yes', label: m.qualityPhotoUseExistingPhoto },
                  { value: 'no', label: m.qualityPhotoUploadNewPhoto },
                ],
              }),
              buildCustomField({
                id: 'photdesc',
                title: '',
                component: 'Bullets',
                condition: (answers) => answers.qualityPhoto === 'no',
              }),
              buildCustomField({
                id: 'photoAttachment',
                title: '',
                component: 'PhotoUpload',
                condition: (answers: FormValue) =>
                  answers.qualityPhoto === 'no',
              }),
            ],
          }),
          buildMultiField({
            id: 'photoUpload',
            title: m.qualityPhotoTitle,
            condition: (_, externalData) => {
              return (
                (externalData.qualityPhoto as QualityPhotoData)?.data
                  ?.success === false
              )
            },
            children: [
              buildDescriptionField({
                id: 'descriptionNoPhoto',
                title: '',
                description: m.qualityPhotoNoPhotoDescription,
              }),
              buildCustomField({
                id: 'photdesc',
                title: '',
                component: 'Bullets',
                condition: (answers: FormValue) => !answers.photoAttachment,
              }),
              buildCustomField({
                id: 'photoAttachment',
                title: '',
                component: 'PhotoUpload',
              }),
              buildDescriptionField({
                id: 'attachmentFileName',
                title: '',
                description: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'delivery',
        title: m.deliveryMethodTitle,
        children: [
          buildMultiField({
            id: 'deliverySection',
            title: m.deliveryMethodTitle,
            children: [
              buildDescriptionField({
                id: 'deliveryDescription',
                title: '',
                description: m.deliveryMethodDescription,
              }),
              buildRadioField({
                id: 'deliveryMethod',
                title: '',
                width: 'half',
                disabled: false,
                options: [
                  { value: 'sendHome', label: m.deliveryMethodHomeDelivery },
                  { value: 'pickUp', label: m.deliveryMethodPickUp },
                ],
              }),
              buildSelectField({
                id: 'jurisdiction',
                title: m.deliveryMethodOfficeLabel,
                placeholder: m.deliveryMethodOfficeSelectPlaceholder,
                options: ({
                  externalData: {
                    jurisdictions: { data },
                  },
                }) => {
                  return (data as Jurisdiction[]).map(({ id, name, zip }) => ({
                    value: name,
                    label: name,
                    tooltip: `Póstnúmer ${zip}`,
                  }))
                },
                condition: (answers: FormValue) =>
                  answers.deliveryMethod === 'pickUp',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'overview',
        title: m.overviewSectionTitle,
        children: [
          buildMultiField({
            id: 'overview',
            title: m.overviewTitle,
            space: 1,
            description: m.overviewSectionDescription,
            children: [
              buildDividerField({}),
              buildKeyValueField({
                label: m.applicantsName,
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).fullName,
              }),
              buildKeyValueField({
                label: m.applicantsNationalId,
                width: 'half',
                value: (application: Application) =>
                  format(application.applicant),
              }),
              buildKeyValueField({
                label: m.applicantsAddress,
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).address
                    ?.streetAddress,
              }),
              buildKeyValueField({
                label: m.applicantsCity,
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).address
                    ?.postalCode +
                  ', ' +
                  (nationalRegistry.data as NationalRegistryUser).address?.city,
              }),
              buildKeyValueField({
                label: m.applicantsEmail,
                width: 'half',
                value: ({ externalData: { userProfile } }) =>
                  (userProfile.data as UserProfile).email as string,
              }),
              buildKeyValueField({
                label: m.applicantsPhoneNumber,
                width: 'half',
                value: ({ externalData: { userProfile } }) =>
                  (userProfile.data as UserProfile).mobilePhoneNumber as string,
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: m.cardValidityPeriod,
                width: 'half',
                value: () => '19/10/24',
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: m.qualityPhotoTitle,
                width: 'half',
                value: '',
              }),
              buildCustomField({
                id: 'userPhoto',
                title: '',
                component: 'Photo',
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: m.deliveryMethodTitle,
                value: (application: Application) =>
                  application.answers.deliveryMethod === 'pickUp'
                    ? `Þú hefur valið að sækja P-merkið sjálf/ur/t á: ${application.answers.jurisdiction}`
                    : m.overviewDeliveryText,
              }),
              buildSubmitField({
                id: 'submit',
                title: '',
                placement: 'footer',
                actions: [
                  {
                    event: 'SUBMIT',
                    name: 'Senda inn umsókn',
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
