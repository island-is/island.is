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
  buildFileUploadField,
  FormValue,
  buildSelectField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
} from '@island.is/application/core'
import { User } from '@island.is/api/domains/national-registry'
import { format } from 'kennitala'
import { syslumenn } from './mocks'
import { QualityPhotoData } from '../types'
import { NationalRegistryUser, UserProfile } from '../types/schema'

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
        title: 'Gagnaöflun',
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: 'Gagnaöflun',
            subTitle: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
            description:
              'Til þess að athuga hvort þú sért með gilt P-merki þá verða upplýsingar verða sóttar  úr kerfi sýslumanna.',
            checkboxLabel: 'Ég skil að persónuuplýsinga verði aflað ',
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: 'Læknisvottorð',
                subTitle: 'Nisi at fermentum adipiscing montes, mi.',
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
            ],
          }),
        ],
      }),
      buildSection({
        id: 'information',
        title: 'Upplýsingar',
        children: [
          buildMultiField({
            id: 'list',
            title: 'Upplýsingar um stæðiskort',
            children: [
              buildTextField({
                id: 'name',
                title: 'Nafn',
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) => {
                  const nationalRegistry = application.externalData
                    .nationalRegistry.data as User
                  return nationalRegistry.fullName
                },
              }),
              buildTextField({
                id: 'id',
                title: 'Kennitala',
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) =>
                  format(application.applicant),
              }),
              buildTextField({
                id: 'address',
                title: 'Heimilisfang',
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
                title: 'Staður',
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
                title: 'Netfang',
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
                title: 'Símanúmer',
                variant: 'number',
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const data = application.externalData.userProfile
                    .data as UserProfile
                  return data.mobilePhoneNumber
                },
              }),
              buildDateField({
                id: 'date',
                title: 'Gildistími',
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
        title: 'Mynd',
        children: [
          buildMultiField({
            id: 'info',
            title: 'Mynd í stæðiskort',
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
                description:
                  'Hér er núverandi ljósmynd. Óskir þú eftir að nota nýja mynd þá þarf að hlaða henni hér inn að neðan.',
              }),
              buildCustomField({
                title: 'ok',
                component: 'QualityPhoto',
                id: 'qphoto',
              }),
              buildRadioField({
                id: 'qualityPhoto',
                title: '',
                width: 'half',
                disabled: false,
                options: [
                  { value: 'yes', label: 'Nota núverandi mynd' },
                  { value: 'no', label: 'Hlaða inn mynd' },
                ],
              }),
              buildCustomField({
                id: 'photdesc',
                title: '',
                component: 'Bullets',
                condition: (answers) => answers.qualityPhoto === 'no',
              }),
              buildFileUploadField({
                id: 'photoAttachment',
                title: 'Dragðu mynd hingað til að hlaða upp',
                uploadAccept: '.jpg, .png',
                uploadHeader: 'Dragðu mynd hingað til að hlaða upp',
                uploadDescription: 'Tekið er við mynd með endingu: .jpg, .png',
                uploadButtonLabel: 'Velja mynd til að hlaða upp',
                introduction: '',
                condition: (answers: FormValue) =>
                  answers.qualityPhoto === 'uploadNew',
              }),
            ],
          }),
          buildMultiField({
            id: 'photoUpload',
            title: 'Mynd í stæðiskort',
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
                description:
                  'Texti sem útskýrir að það þarf að hlaða inn mynd fyrir stæðiskort.',
              }),
              buildCustomField({
                title: 'ok',
                component: 'QualityPhoto',
                id: 'qphoto',
              }),
              buildFileUploadField({
                id: 'photoAttachment',
                title: 'Dragðu mynd hingað til að hlaða upp',
                uploadAccept: '.jpg, .png',
                uploadHeader: 'Dragðu mynd hingað til að hlaða upp',
                uploadDescription: 'Tekið er við mynd með endingu: .jpg, .png',
                uploadButtonLabel: 'Velja mynd til að hlaða upp',
                introduction: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'delivery',
        title: 'Afhending',
        children: [
          buildMultiField({
            id: 'deliveryView',
            title: 'Afhending',
            children: [
              buildDescriptionField({
                id: 'deliveryDescription',
                title: '',
                description:
                  'Stæðiskort er sjálfkrafa sent með pósti á uppgefið heimilisfang eftir 3-5 virka daga. Óskir þú eftir að fá stæðiskortið afhent fyrr þá getur þú valið um að sækja það sjálfur á valda staðsetningu hér að neðan.',
              }),
              buildRadioField({
                id: 'deliveryMethod',
                title: '',
                width: 'half',
                disabled: false,
                options: [
                  { value: 'sendHome', label: 'Fá sent heim í pósti' },
                  { value: 'pickUp', label: 'Sækja til Sýslumanns' },
                ],
              }),
              buildSelectField({
                id: 'districtCommitioners',
                title: 'Embætti',
                placeholder: 'Veldu embætti',
                options: syslumenn,
                condition: (answers: FormValue) =>
                  answers.deliveryMethod === 'pickUp',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'overview',
        title: 'Yfirlit',
        children: [
          buildMultiField({
            id: 'overview',
            title: 'Yfirlit umsóknar',
            space: 1,
            description:
              'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
            children: [
              buildDividerField({}),
              buildKeyValueField({
                label: 'Nafn',
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).fullName,
              }),
              buildKeyValueField({
                label: 'Kennitala',
                width: 'half',
                value: (application: Application) =>
                  format(application.applicant),
              }),
              buildKeyValueField({
                label: 'Heimilisfang',
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).address
                    ?.streetAddress,
              }),
              buildKeyValueField({
                label: 'Staður',
                width: 'half',
                value: ({ externalData: { nationalRegistry } }) =>
                  (nationalRegistry.data as NationalRegistryUser).address
                    ?.postalCode,
              }),
              buildKeyValueField({
                label: 'Netfang',
                width: 'half',
                value: ({ externalData: { userProfile } }) =>
                  (userProfile.data as UserProfile).email as string,
              }),
              buildKeyValueField({
                label: 'Símanúmer',
                width: 'half',
                value: ({ externalData: { userProfile } }) =>
                  (userProfile.data as UserProfile).mobilePhoneNumber as string,
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: 'Gildistími',
                width: 'half',
                value: () => '19/10/24',
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: 'Mynd í stæðiskort',
                width: 'half',
                value: '',
              }),
              buildCustomField({
                title: 'Mynd í stæðiskort',
                component: 'QualityPhoto',
                id: 'qphoto',
              }),
              buildDividerField({}),
              buildKeyValueField({
                label: 'Afhending',
                width: 'half',
                value: (application) =>
                  application.answers.deliveryMethod === 'pickUp'
                    ? 'Þú hefur valið að sækja P-merkið sjálf/ur/t á: ' +
                      application.answers.districtCommitioners +
                      ' Hlíðasmári 1, Kópavogur'
                    : 'Þú hefur valið að fá P-merkið sent heim í pósti',
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
