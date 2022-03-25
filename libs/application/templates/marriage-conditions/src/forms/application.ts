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

export const getApplication = (): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationDraftForm',
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
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: m.dataCollectionNationalRegistryTitle,
                subTitle: m.dataCollectionNationalRegistrySubtitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                id: 'birthCertificate',
                type: '',
                title: 'Fæðingarvottorð',
                subTitle: 'Vottorð um fæðingardag/kennitölu, kyn, fæðingarstað og nöfn foreldra.',
              }),
              buildDataProviderItem({
                id: 'maritalStatus',
                type: '',
                title: 'Hjúskaparvottorð',
                subTitle: 'Vottorð um núverandi hjúskaparstöðu.',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageSides',
        title: m.informationSectionTitle,
        children: [
          buildMultiField({
            id: 'sides',
            title: m.informationTitle,
            children: [
              buildDividerField({ title: 'Hjónaefni 1', color: 'dark400' }),
              buildTextField({
                id: 'nationalId1',
                title: m.applicantsNationalId,
                width: 'half',
                backgroundColor: 'white',
                defaultValue: (application: Application) =>
                  formatNationalId(application.applicant),
              }),
              buildTextField({
                id: 'name1',
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
                id: 'phone1',
                title: m.applicantsPhoneNumber,
                width: 'half',
                backgroundColor: 'blue',
                defaultValue: (application: Application) => {
                  const data = application.externalData.userProfile
                    .data as UserProfile
                  return data.mobilePhoneNumber
                },
              }),
              buildTextField({
                id: 'email1',
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
              buildDividerField({ title: 'Hjónaefni 2', color: 'dark400' }),
              buildCustomField({
                id: 'alert',
                title: '',
                component: 'InfoAlert',
              }),
              buildTextField({
                id: 'nationalId2',
                title: m.applicantsNationalId,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'name2',
                title: m.applicantsName,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'phone2',
                title: m.applicantsPhoneNumber,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'email2',
                title: m.applicantsEmail,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageWitnesses',
        title: 'Hjúskapavottar',
        children: [
          buildMultiField({
            id: 'witnesses',
            title: 'Hjúskapavottar',
            description: 'Undirritaðir aðilar munu ábyrgjast að enginn lagatálmi sé á fyrirhuguðum hjúskap.',
            children: [
              buildDividerField({ title: 'Votti 1', color: 'dark400' }),
              buildTextField({
                id: 'witnessNationalId1',
                title: m.applicantsNationalId,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'witnessName1',
                title: m.applicantsName,
                width: 'half',
                backgroundColor: 'white',
              }),
              buildTextField({
                id: 'witnessPhone1',
                title: m.applicantsPhoneNumber,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'witnessEmail1',
                title: m.applicantsEmail,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildDividerField({ title: 'Votti 2', color: 'dark400' }),
              buildTextField({
                id: 'witnessNationalId2',
                title: m.applicantsNationalId,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'witnessName2',
                title: m.applicantsName,
                width: 'half',
                backgroundColor: 'white',
              }),
              buildTextField({
                id: 'witnessPhone2',
                title: m.applicantsPhoneNumber,
                width: 'half',
                backgroundColor: 'blue',
              }),
              buildTextField({
                id: 'witnessEmail2',
                title: m.applicantsEmail,
                variant: 'email',
                width: 'half',
                backgroundColor: 'blue',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageWitnesses',
        title: 'Hjúskapavottar',
        children: [
          buildMultiField({
            id: 'witnesses',
            title: 'Yfirlit umsóknar',
            description: 'Vinsamlegast farðu yfir umsóknina til að vera viss um að réttar upplýsingar hafi verið gefnar upp. ',
            children: [
              buildDividerField({}),
              buildCustomField({
                id: 'efni1',
                title: 'Hjónaefni 1',
                component: 'ApplicationOverview',
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
