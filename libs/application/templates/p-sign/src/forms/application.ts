import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  Application,
  buildCustomField,
  buildRadioField,
  buildDescriptionField,
  FormValue,
  buildSelectField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
  DefaultEvents,
  buildFileUploadField,
  buildTextField,
  buildDateField,
  getValueViaPath,
} from '@island.is/application/core'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import {
  NationalRegistryUser,
  UserProfile,
  DistrictCommissionerAgencies,
} from '../types/schema'
import { m } from '../lib/messages'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { HasQualityPhotoData } from '../fields/QualityPhoto/hooks/useQualityPhoto'
import { UPLOAD_ACCEPT } from '../lib/constants'

export const getApplication = (): Form => {
  return buildForm({
    id: 'PMarkApplicationDraftForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
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
                id: 'doctorsNote',
                type: 'DoctorsNoteProvider',
                title: m.dataCollectionDoctorsNoteTitle,
                subTitle: m.dataCollectionDoctorsNoteSubtitle,
              }),
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: m.dataCollectionNationalRegistryTitle,
                subTitle: m.dataCollectionNationalRegistrySubtitle,
              }),
              buildDataProviderItem({
                id: 'qualityPhoto',
                type: 'QualityPhotoProvider',
                title: m.dataCollectionQualityPhotoTitle,
                subTitle: m.dataCollectionQualityPhotoSubtitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                id: 'districts',
                type: 'DistrictsProvider',
                title: '',
                subTitle: '',
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
            description: m.informationSubtitle,
            children: [
              buildTextField({
                id: 'name',
                title: m.applicantsName,
                width: 'half',
                backgroundColor: 'white',
                disabled: true,
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
                disabled: true,
                defaultValue: (application: Application) =>
                  formatNationalId(application.applicant),
              }),
              buildTextField({
                id: 'address',
                title: m.applicantsAddress,
                width: 'half',
                backgroundColor: 'white',
                disabled: true,
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
                disabled: true,
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
                disabled: true,
                defaultValue: (application: Application) => {
                  const data = application.externalData.doctorsNote.data as any
                  return data?.expirationDate
                },
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
                getValueViaPath<HasQualityPhotoData>(
                  externalData,
                  'qualityPhoto',
                )?.data?.hasQualityPhoto ?? false
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
                defaultValue: 'yes',
              }),
              buildCustomField({
                id: 'bullets',
                title: '',
                component: 'Bullets',
                condition: (answers: FormValue) =>
                  answers.qualityPhoto === 'no',
              }),
              buildFileUploadField({
                id: 'attachments',
                title: '',
                uploadHeader: m.qualityPhotoFileUploadTitle,
                uploadDescription: m.qualityPhotoFileUploadDescription,
                uploadButtonLabel: m.qualityPhotoUploadButtonLabel,
                forImageUpload: true,
                uploadMultiple: false,
                uploadAccept: UPLOAD_ACCEPT,
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
                (externalData.qualityPhoto as HasQualityPhotoData)?.data
                  ?.hasQualityPhoto === false
              )
            },
            children: [
              buildDescriptionField({
                id: 'descriptionNoPhoto',
                title: '',
                description: m.qualityPhotoNoPhotoDescription,
              }),
              buildCustomField({
                id: 'bullets',
                title: '',
                component: 'Bullets',
              }),
              buildFileUploadField({
                id: 'attachments',
                title: '',
                uploadHeader: m.qualityPhotoFileUploadTitle,
                uploadDescription: m.qualityPhotoFileUploadDescription,
                uploadButtonLabel: m.qualityPhotoUploadButtonLabel,
                forImageUpload: true,
                uploadMultiple: false,
                uploadAccept: UPLOAD_ACCEPT,
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
                defaultValue: 'sendHome',
              }),
              buildSelectField({
                id: 'district',
                title: m.deliveryMethodOfficeLabel,
                placeholder: m.deliveryMethodOfficeSelectPlaceholder,
                options: ({
                  externalData: {
                    districts: { data },
                  },
                }) => {
                  return (data as DistrictCommissionerAgencies[]).map(
                    ({ id, name, place, address }) => ({
                      value: id,
                      label: `${name}, ${place}`,
                      tooltip: `${address}`,
                    }),
                  )
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
                  formatNationalId(application.applicant),
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
                value: ({ externalData: { doctorsNote } }) =>
                  format(
                    new Date((doctorsNote.data as any).expirationDate),
                    'dd/MM/yyyy',
                    { locale: is },
                  ),
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: m.qualityPhotoTitle,
                width: 'half',
                value: '',
              }),
              buildCustomField({
                id: 'uploadedPhoto',
                title: '',
                component: 'UploadedPhoto',
                condition: (answers) =>
                  answers.qualityPhoto === 'no' || !answers.qualityPhoto,
              }),
              buildCustomField({
                id: 'qphoto',
                title: '',
                component: 'QualityPhoto',
                condition: (answers) => answers.qualityPhoto === 'yes',
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: m.deliveryMethodTitle,
                value: ({
                  externalData: {
                    districts: { data },
                  },
                  answers,
                }) => {
                  const district = (data as DistrictCommissionerAgencies[]).find(
                    (d) => d.id === answers.district,
                  )
                  return `Þú hefur valið að sækja stæðiskortið sjálf/ur/t hjá: ${district?.name}, ${district?.place}`
                },
                condition: (answers) => answers.deliveryMethod === 'pickUp',
              }),
              buildKeyValueField({
                label: m.deliveryMethodTitle,
                value: () => m.overviewDeliveryText,
                condition: (answers) => answers.deliveryMethod === 'sendHome',
              }),
              buildSubmitField({
                id: 'submit',
                title: '',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
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
