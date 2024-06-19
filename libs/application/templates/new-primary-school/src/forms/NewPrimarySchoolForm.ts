import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildCheckboxField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildForm,
  buildHiddenInput,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTableRepeaterField,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  NO,
  YES,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { format as formatKennitala } from 'kennitala'
import {
  ReasonForApplicationOptions,
  RelationOptions,
  SiblingRelationOptions,
} from '../lib/constants'
import { newPrimarySchoolMessages } from '../lib/messages'
import {
  canApply,
  formatGender,
  getApplicationAnswers,
  getApplicationExternalData,
  getFoodAllergiesOptions,
  getFoodIntolerancesOptions,
  getLanguageCodes,
  getGenderOptions,
  getOtherParent,
  getReasonForApplicationOptions,
  getRelationOptionLabel,
  getRelationOptions,
  getSelectedChild,
  getSiblingRelationOptionLabel,
  getSiblingRelationOptions,
  hasOtherParent,
} from '../lib/newPrimarySchoolUtils'

export const NewPrimarySchoolForm: Form = buildForm({
  id: 'newPrimarySchoolDraft',
  title: newPrimarySchoolMessages.shared.formTitle,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: newPrimarySchoolMessages.pre.externalDataSection,
      children: [],
    }),
    buildSection({
      id: 'childrenNParentsSection',
      title: newPrimarySchoolMessages.childrenNParents.sectionTitle,
      children: [
        buildSubSection({
          id: 'childrenSubSection',
          title:
            newPrimarySchoolMessages.childrenNParents.childrenSubSectionTitle,
          children: [
            buildMultiField({
              id: 'childrenMultiField',
              title:
                newPrimarySchoolMessages.childrenNParents
                  .childrenSubSectionTitle,
              description:
                newPrimarySchoolMessages.childrenNParents.childrenDescription,
              children: [
                buildRadioField({
                  id: 'childNationalId',
                  title:
                    newPrimarySchoolMessages.childrenNParents
                      .childrenRadioTitle,
                  options: (application) => {
                    const { children } = getApplicationExternalData(
                      application.externalData,
                    )

                    return children
                      .filter((child) => canApply(child))
                      .map((child) => {
                        return {
                          value: child.nationalId,
                          label: child.fullName,
                          subLabel: formatKennitala(child.nationalId),
                        }
                      })
                  },
                  required: true,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'childInfoSubSection',
          title:
            newPrimarySchoolMessages.childrenNParents.childInfoSubSectionTitle,
          children: [
            buildMultiField({
              id: 'childInfo',
              title: newPrimarySchoolMessages.childrenNParents.childInfoTitle,
              description:
                newPrimarySchoolMessages.childrenNParents.childInfoDescription,
              children: [
                buildTextField({
                  id: 'childInfo.name',
                  title: newPrimarySchoolMessages.shared.fullName,
                  disabled: true,
                  defaultValue: (application: Application) =>
                    getSelectedChild(application)?.fullName,
                }),
                buildTextField({
                  id: 'childInfo.nationalId',
                  title: newPrimarySchoolMessages.shared.nationalId,
                  width: 'half',
                  format: '######-####',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    getSelectedChild(application)?.nationalId,
                }),
                buildTextField({
                  id: 'childInfo.address.streetAddress',
                  title: newPrimarySchoolMessages.shared.address,
                  width: 'half',
                  disabled: true,
                  // TODO: Nota gögn frá Júní?
                  // TODO: Hægt að nota heimilisfang innskráðs foreldris? (foreldri getur ekki sótt um nema barn sé með sama lögheimili)
                  defaultValue: (application: Application) =>
                    getApplicationExternalData(application.externalData)
                      .applicantAddress,
                }),
                buildTextField({
                  id: 'childInfo.address.postalCode',
                  title: newPrimarySchoolMessages.shared.postalCode,
                  width: 'half',
                  disabled: true,
                  // TODO: Nota gögn frá Júní?
                  // TODO: Hægt að nota heimilisfang innskráðs foreldris? (foreldri getur ekki sótt um nema barn sé með sama lögheimili)
                  defaultValue: (application: Application) =>
                    getApplicationExternalData(application.externalData)
                      .applicantPostalCode,
                }),
                buildTextField({
                  id: 'childInfo.address.city',
                  title: newPrimarySchoolMessages.shared.municipality,
                  width: 'half',
                  disabled: true,
                  // TODO: Nota gögn frá Júní?
                  // TODO: Hægt að nota heimilisfang innskráðs foreldris? (foreldri getur ekki sótt um nema barn sé með sama lögheimili)
                  defaultValue: (application: Application) =>
                    getApplicationExternalData(application.externalData)
                      .applicantCity,
                }),
                buildTextField({
                  id: 'childInfo.chosenName',
                  title:
                    newPrimarySchoolMessages.childrenNParents
                      .childInfoChosenName,
                  width: 'half',
                }),
                buildSelectField({
                  id: 'childInfo.gender',
                  title:
                    newPrimarySchoolMessages.childrenNParents.childInfoGender,
                  placeholder:
                    newPrimarySchoolMessages.childrenNParents
                      .childInfoGenderPlaceholder,
                  width: 'half',
                  // TODO: Nota gögn fá Júní
                  options: getGenderOptions(),
                  defaultValue: (application: Application) =>
                    formatGender(getSelectedChild(application)?.genderCode),
                }),
                buildRadioField({
                  id: 'childInfo.differentPlaceOfResidence',
                  title:
                    newPrimarySchoolMessages.childrenNParents
                      .differentPlaceOfResidence,
                  width: 'half',
                  required: true,
                  space: 4,
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      value: NO,
                    },
                  ],
                }),
                buildTextField({
                  id: 'childInfo.placeOfResidence.streetAddress',
                  title:
                    newPrimarySchoolMessages.childrenNParents
                      .childInfoPlaceOfResidence,
                  width: 'half',
                  required: true,
                  condition: (answers) => {
                    const { differentPlaceOfResidence } =
                      getApplicationAnswers(answers)

                    return differentPlaceOfResidence === YES
                  },
                }),
                buildTextField({
                  id: 'childInfo.placeOfResidence.postalCode',
                  title: newPrimarySchoolMessages.shared.postalCode,
                  width: 'half',
                  format: '###',
                  required: true,
                  condition: (answers) => {
                    const { differentPlaceOfResidence } =
                      getApplicationAnswers(answers)

                    return differentPlaceOfResidence === YES
                  },
                }),
                buildCustomField({
                  id: 'childInfo.currentSchool',
                  title:
                    newPrimarySchoolMessages.childrenNParents
                      .childInfoCurrentSchool,
                  component: 'CurrentSchool',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'parentsSubSection',
          title:
            newPrimarySchoolMessages.childrenNParents.parentsSubSectionTitle,
          children: [
            buildMultiField({
              id: 'parents',
              title:
                newPrimarySchoolMessages.childrenNParents
                  .parentsSubSectionTitle,
              description:
                newPrimarySchoolMessages.childrenNParents.parentsDescription,
              children: [
                buildDescriptionField({
                  id: 'parentsInfo1',
                  title: newPrimarySchoolMessages.childrenNParents.parent,
                  titleVariant: 'h4',
                }),
                buildTextField({
                  id: 'parents.parent1.fullName',
                  title: newPrimarySchoolMessages.shared.fullName,
                  dataTestId: 'fullName1',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.nationalRegistry?.data as {
                        fullName?: string
                      }
                    )?.fullName,
                }),
                buildTextField({
                  id: 'parents.parent1.nationalId',
                  title: newPrimarySchoolMessages.shared.nationalId,
                  width: 'half',
                  dataTestId: 'nationalId1',
                  format: '######-####',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.nationalRegistry?.data as {
                        nationalId?: string
                      }
                    )?.nationalId,
                }),
                buildTextField({
                  id: 'parents.parent1.address.streetAddress',
                  title: newPrimarySchoolMessages.shared.address,
                  width: 'half',
                  dataTestId: 'address1',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantAddress
                  },
                }),
                buildTextField({
                  id: 'parents.parent1.address.postalCode',
                  title: newPrimarySchoolMessages.shared.postalCode,
                  width: 'half',
                  dataTestId: 'postalCode1',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantPostalCode
                  },
                }),
                buildTextField({
                  id: 'parents.parent1.address.city',
                  title: newPrimarySchoolMessages.shared.municipality,
                  width: 'half',
                  dataTestId: 'city1',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantCity
                  },
                }),
                buildTextField({
                  id: 'parents.parent1.email',
                  title: newPrimarySchoolMessages.shared.email,
                  width: 'half',
                  dataTestId: 'email',
                  variant: 'email',
                  required: true,
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.userProfile?.data as {
                        email?: string
                      }
                    )?.email,
                }),
                buildPhoneField({
                  id: 'parents.parent1.phoneNumber',
                  title: newPrimarySchoolMessages.shared.phoneNumber,
                  width: 'half',
                  defaultValue: (application: Application) => {
                    const phoneNumber = (
                      application.externalData.userProfile?.data as {
                        mobilePhoneNumber?: string
                      }
                    )?.mobilePhoneNumber

                    return formatPhoneNumber(
                      removeCountryCode(phoneNumber ?? ''),
                    )
                  },
                  dataTestId: 'phone1',
                  placeholder: '000-0000',
                  required: true,
                }),

                buildDescriptionField({
                  id: 'parentsInfo2',
                  title: newPrimarySchoolMessages.childrenNParents.otherParent,
                  titleVariant: 'h4',
                  marginTop: 'containerGutter',
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                }),
                buildTextField({
                  id: 'parents.parent2.fullName',
                  title: newPrimarySchoolMessages.shared.fullName,
                  dataTestId: 'fullName2',
                  disabled: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.fullName,
                }),
                buildTextField({
                  id: 'parents.parent2.nationalId',
                  title: newPrimarySchoolMessages.shared.nationalId,
                  width: 'half',
                  dataTestId: 'nationalId2',
                  format: '######-####',
                  disabled: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.nationalId,
                }),
                buildTextField({
                  id: 'parents.parent2.address.streetAddress',
                  title: newPrimarySchoolMessages.shared.address,
                  width: 'half',
                  dataTestId: 'address2',
                  disabled: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.streetAddress,
                }),
                buildTextField({
                  id: 'parents.parent2.address.postalCode',
                  title: newPrimarySchoolMessages.shared.postalCode,
                  width: 'half',
                  dataTestId: 'postalCode2',
                  disabled: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.postalCode,
                }),
                buildTextField({
                  id: 'parents.parent2.address.city',
                  title: newPrimarySchoolMessages.shared.municipality,
                  width: 'half',
                  dataTestId: 'city2',
                  disabled: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.city,
                }),
                buildTextField({
                  id: 'parents.parent2.email',
                  title: newPrimarySchoolMessages.shared.email,
                  width: 'half',
                  dataTestId: 'email2',
                  variant: 'email',
                  required: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                }),
                buildPhoneField({
                  id: 'parents.parent2.phoneNumber',
                  title: newPrimarySchoolMessages.shared.phoneNumber,
                  width: 'half',
                  dataTestId: 'phone2',
                  placeholder: '000-0000',
                  required: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'relativesSubSection',
          title:
            newPrimarySchoolMessages.childrenNParents.relativesSubSectionTitle,
          children: [
            buildMultiField({
              id: 'relatives',
              title: newPrimarySchoolMessages.childrenNParents.relativesTitle,
              description:
                newPrimarySchoolMessages.childrenNParents.relativesDescription,
              children: [
                buildTableRepeaterField({
                  id: 'relatives',
                  title: '',
                  formTitle:
                    newPrimarySchoolMessages.childrenNParents
                      .relativesRegistrationTitle,
                  addItemButtonText:
                    newPrimarySchoolMessages.childrenNParents
                      .relativesAddRelative,
                  saveItemButtonText:
                    newPrimarySchoolMessages.childrenNParents
                      .relativesRegisterRelative,
                  removeButtonTooltipText:
                    newPrimarySchoolMessages.childrenNParents
                      .relativesDeleteRelative,
                  marginTop: 0,
                  maxRows: 6,
                  fields: {
                    fullName: {
                      component: 'input',
                      label: newPrimarySchoolMessages.shared.fullName,
                      width: 'half',
                      type: 'text',
                      dataTestId: 'relative-full-name',
                    },
                    phoneNumber: {
                      component: 'input',
                      label: newPrimarySchoolMessages.shared.phoneNumber,
                      width: 'half',
                      type: 'tel',
                      format: '###-####',
                      placeholder: '000-0000',
                      dataTestId: 'relative-phone-number',
                    },
                    nationalId: {
                      component: 'input',
                      label: newPrimarySchoolMessages.shared.nationalId,
                      width: 'half',
                      type: 'text',
                      format: '######-####',
                      placeholder: '000000-0000',
                      dataTestId: 'relative-national-id',
                    },
                    relation: {
                      component: 'select',
                      label: newPrimarySchoolMessages.shared.relation,
                      width: 'half',
                      placeholder:
                        newPrimarySchoolMessages.shared.relationPlaceholder,
                      // TODO: Nota gögn fá Júní
                      options: getRelationOptions(),
                      dataTestId: 'relative-relation',
                    },
                    canPickUpChild: {
                      component: 'checkbox',
                      width: 'full',
                      large: true,
                      options: [
                        {
                          label:
                            newPrimarySchoolMessages.childrenNParents
                              .relativesCanPickUpChild,
                          value: YES,
                        },
                      ],
                      dataTestId: 'relative-can-pick-up-child',
                    },
                  },
                  table: {
                    format: {
                      phoneNumber: (value) =>
                        formatPhoneNumber(removeCountryCode(value ?? '')),
                      nationalId: (value) => formatKennitala(value),
                      relation: (value) =>
                        getRelationOptionLabel(value as RelationOptions),
                      canPickUpChild: (value) =>
                        value?.includes(YES)
                          ? newPrimarySchoolMessages.shared.yes
                          : newPrimarySchoolMessages.shared.no,
                    },
                    header: [
                      newPrimarySchoolMessages.shared.fullName,
                      newPrimarySchoolMessages.shared.phoneNumber,
                      newPrimarySchoolMessages.shared.nationalId,
                      newPrimarySchoolMessages.shared.relation,
                      newPrimarySchoolMessages.childrenNParents
                        .relativesCanPickUpChildTableHeader,
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'primarySchoolSection',
      title: newPrimarySchoolMessages.primarySchool.sectionTitle,
      children: [
        buildSubSection({
          id: 'reasonForApplicationSubSection',
          title:
            newPrimarySchoolMessages.primarySchool
              .reasonForApplicationSubSectionTitle,
          children: [
            buildMultiField({
              id: 'reasonForApplication',
              title:
                newPrimarySchoolMessages.primarySchool
                  .reasonForApplicationSubSectionTitle,
              description:
                newPrimarySchoolMessages.primarySchool
                  .reasonForApplicationDescription,
              children: [
                buildSelectField({
                  id: 'reasonForApplication.reason',
                  dataTestId: 'reason-for-application',
                  title:
                    newPrimarySchoolMessages.primarySchool
                      .reasonForApplicationSubSectionTitle,
                  placeholder:
                    newPrimarySchoolMessages.primarySchool
                      .reasonForApplicationPlaceholder,
                  options: getReasonForApplicationOptions(),
                }),
                buildSelectField({
                  id: 'reasonForApplication.movingAbroad.country',
                  dataTestId: 'reason-for-application-country',
                  title: newPrimarySchoolMessages.primarySchool.country,
                  placeholder:
                    newPrimarySchoolMessages.primarySchool.countryPlaceholder,
                  options: () => {
                    const countries = getAllCountryCodes()
                    return countries.map((country) => {
                      return {
                        label: country.name_is || country.name,
                        value: country.code,
                      }
                    })
                  },
                  condition: (answers) => {
                    const { reasonForApplication } =
                      getApplicationAnswers(answers)

                    return (
                      reasonForApplication ===
                      ReasonForApplicationOptions.MOVING_ABROAD
                    )
                  },
                }),
                buildTextField({
                  id: 'reasonForApplication.transferOfLegalDomicile.streetAddress',
                  title: newPrimarySchoolMessages.shared.address,
                  width: 'half',
                  required: true,
                  condition: (answers) => {
                    const { reasonForApplication } =
                      getApplicationAnswers(answers)

                    return (
                      reasonForApplication ===
                      ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
                    )
                  },
                }),
                buildTextField({
                  id: 'reasonForApplication.transferOfLegalDomicile.postalCode',
                  title: newPrimarySchoolMessages.shared.postalCode,
                  width: 'half',
                  required: true,
                  format: '###',
                  condition: (answers) => {
                    const { reasonForApplication } =
                      getApplicationAnswers(answers)

                    return (
                      reasonForApplication ===
                      ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
                    )
                  },
                }),
                buildAlertMessageField({
                  id: 'reasonForApplication.info',
                  title: newPrimarySchoolMessages.shared.alertTitle,
                  message:
                    newPrimarySchoolMessages.primarySchool
                      .registerNewDomicileAlertMessage,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  condition: (answers) => {
                    const {
                      reasonForApplication,
                      reasonForApplicationCountry,
                    } = getApplicationAnswers(answers)

                    return (
                      reasonForApplication ===
                        ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE ||
                      (reasonForApplication ===
                        ReasonForApplicationOptions.MOVING_ABROAD &&
                        reasonForApplicationCountry !== undefined)
                    )
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'siblingsSubSection',
          title: newPrimarySchoolMessages.primarySchool.siblingsSubSectionTitle,
          condition: (answers) => {
            // Only display section if "Siblings in the same primary school" selected as reason for application
            const { reasonForApplication } = getApplicationAnswers(answers)
            return (
              reasonForApplication ===
              ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL
            )
          },
          children: [
            buildMultiField({
              id: 'siblings',
              title: newPrimarySchoolMessages.primarySchool.siblingsTitle,
              children: [
                buildTableRepeaterField({
                  id: 'siblings',
                  title: '',
                  formTitle:
                    newPrimarySchoolMessages.primarySchool
                      .siblingsRegistrationTitle,
                  addItemButtonText:
                    newPrimarySchoolMessages.primarySchool.siblingsAddRelative,
                  saveItemButtonText:
                    newPrimarySchoolMessages.primarySchool
                      .siblingsRegisterRelative,
                  removeButtonTooltipText:
                    newPrimarySchoolMessages.primarySchool
                      .siblingsDeleteRelative,
                  marginTop: 0,
                  fields: {
                    fullName: {
                      component: 'input',
                      label: newPrimarySchoolMessages.shared.fullName,
                      width: 'half',
                      type: 'text',
                      dataTestId: 'sibling-full-name',
                    },
                    nationalId: {
                      component: 'input',
                      label: newPrimarySchoolMessages.shared.nationalId,
                      width: 'half',
                      type: 'text',
                      format: '######-####',
                      placeholder: '000000-0000',
                      dataTestId: 'sibling-national-id',
                    },
                    relation: {
                      component: 'select',
                      label: newPrimarySchoolMessages.shared.relation,
                      placeholder:
                        newPrimarySchoolMessages.shared.relationPlaceholder,
                      // TODO: Nota gögn fá Júní?
                      options: getSiblingRelationOptions(),
                      dataTestId: 'sibling-relation',
                    },
                  },
                  table: {
                    format: {
                      nationalId: (value) => formatKennitala(value),
                      relation: (value) =>
                        getSiblingRelationOptionLabel(
                          value as SiblingRelationOptions,
                        ),
                    },
                    header: [
                      newPrimarySchoolMessages.shared.fullName,
                      newPrimarySchoolMessages.shared.nationalId,
                      newPrimarySchoolMessages.shared.relation,
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'newSchoolSubSection',
          title:
            newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
          condition: (answers) => {
            // Only display section if "Moving abroad" is not selected as reason for application
            const { reasonForApplication } = getApplicationAnswers(answers)
            return (
              reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
            )
          },
          children: [
            buildMultiField({
              id: 'school',
              title:
                newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
              children: [
                buildAsyncSelectField({
                  id: 'schools.newSchool.municipality',
                  title: newPrimarySchoolMessages.shared.municipality,

                  loadOptions: async ({ apolloClient }) => {
                    return [{ value: 'Reykjavík', label: 'Reykjavík' }]
                    /*const { municipalities } = getApplicationExternalData(
                      application.externalData,
                    )

                    return municipalities.map(
                      (municipality: NationalRegistryMunicipality) => ({
                        value: municipality?.code || '',
                        label: municipality.name || '',
                      }),
                    )*/
                  },

                  placeholder:
                    newPrimarySchoolMessages.shared.municipalityPlaceholder,
                  dataTestId: 'new-school-municipality',
                }),

                buildAsyncSelectField({
                  id: 'schools.newSchool.school',
                  title: newPrimarySchoolMessages.shared.school,
                  condition: (answers) => {
                    const { schoolMunicipality } =
                      getApplicationAnswers(answers)
                    return !!schoolMunicipality
                  }, //Todo: get data from Juni
                  loadOptions: async ({ apolloClient }) => {
                    return [
                      {
                        value: 'Ártúnsskóli',
                        label: 'Ártúnsskóli',
                      },
                      {
                        value: 'Árbæjarskóli',
                        label: 'Árbæjarskóli',
                      },
                    ]
                  },
                  placeholder:
                    newPrimarySchoolMessages.shared.schoolPlaceholder,
                  dataTestId: 'new-school-school',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'startingSchoolSubSection',
          title:
            newPrimarySchoolMessages.primarySchool
              .startingSchoolSubSectionTitle,
          condition: (answers) => {
            // Only display section if "Moving abroad" is not selected as reason for application
            const { reasonForApplication } = getApplicationAnswers(answers)
            return (
              reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
            )
          },
          children: [
            buildMultiField({
              id: 'startingSchoolMultiField',
              title: newPrimarySchoolMessages.primarySchool.startingSchoolTitle,
              description:
                newPrimarySchoolMessages.primarySchool
                  .startingSchoolDescription,
              children: [
                buildDateField({
                  id: 'startDate',
                  title: newPrimarySchoolMessages.shared.date,
                  placeholder: newPrimarySchoolMessages.shared.datePlaceholder,
                  defaultValue: null,
                  minDate: () => new Date(),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'differentNeedsSection',
      title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
      condition: (answers) => {
        // Only display section if "Moving abroad" is not selected as reason for application
        const { reasonForApplication } = getApplicationAnswers(answers)
        return (
          reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
        )
      },
      children: [
        buildSubSection({
          id: 'languageSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          children: [
            buildMultiField({
              id: 'languages',
              title: newPrimarySchoolMessages.differentNeeds.languageTitle,
              description:
                newPrimarySchoolMessages.differentNeeds.languageDescription,
              children: [
                buildDescriptionField({
                  id: 'languages.nativeLanguage.title',
                  title:
                    newPrimarySchoolMessages.differentNeeds.childNativeLanguage,
                  titleVariant: 'h4',
                }),
                buildSelectField({
                  id: 'languages.nativeLanguage',
                  dataTestId: 'languages-native-language',
                  title:
                    newPrimarySchoolMessages.differentNeeds
                      .languageSubSectionTitle,
                  placeholder:
                    newPrimarySchoolMessages.differentNeeds.languagePlaceholder,
                  options: getLanguageCodes(),
                }),
                buildRadioField({
                  id: 'languages.otherLanguagesSpokenDaily',
                  title:
                    newPrimarySchoolMessages.differentNeeds
                      .otherLanguagesSpokenDaily,
                  width: 'half',
                  required: true,
                  space: 4,
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      dataTestId: 'other-languages',
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      dataTestId: 'no-other-languages',
                      value: NO,
                    },
                  ],
                }),
                buildSelectField({
                  id: 'languages.otherLanguages',
                  dataTestId: 'languages-other-languages',
                  title:
                    newPrimarySchoolMessages.differentNeeds
                      .languageSubSectionTitle,
                  placeholder:
                    newPrimarySchoolMessages.differentNeeds.languagePlaceholder,
                  options: getLanguageCodes(),
                  isMulti: true,
                  condition: (answers) => {
                    const { otherLanguagesSpokenDaily } =
                      getApplicationAnswers(answers)

                    return otherLanguagesSpokenDaily === YES
                  },
                }),
                buildCheckboxField({
                  id: 'languages.icelandicNotSpokenAroundChild',
                  title: '',
                  options: (application) => {
                    const { nativeLanguage, otherLanguages } =
                      getApplicationAnswers(application.answers)

                    return [
                      {
                        label:
                          newPrimarySchoolMessages.differentNeeds
                            .icelandicNotSpokenAroundChild,
                        value: YES,
                        disabled:
                          nativeLanguage === 'is' ||
                          otherLanguages?.includes('is'),
                      },
                    ]
                  },
                  condition: (answers) => {
                    const { otherLanguagesSpokenDaily } =
                      getApplicationAnswers(answers)

                    return otherLanguagesSpokenDaily === YES
                  },
                }),
                buildHiddenInput({
                  // Needed to trigger an update on options in the checkbox above
                  id: 'languages.icelandicSelectedHiddenInput',
                  condition: (answers) => {
                    const { nativeLanguage, otherLanguages } =
                      getApplicationAnswers(answers)

                    return (
                      nativeLanguage === 'is' || otherLanguages?.includes('is')
                    )
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'allergiesAndIntolerancesSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds
              .allergiesAndIntolerancesSubSectionTitle,
          children: [
            buildMultiField({
              id: 'allergiesAndIntolerances',
              title:
                newPrimarySchoolMessages.differentNeeds
                  .foodAllergiesAndIntolerancesTitle,
              description:
                newPrimarySchoolMessages.differentNeeds
                  .foodAllergiesAndIntolerancesDescription,
              children: [
                buildCheckboxField({
                  id: 'allergiesAndIntolerances.hasFoodAllergies',
                  title: '',
                  spacing: 0,
                  options: [
                    {
                      value: YES,
                      label:
                        newPrimarySchoolMessages.differentNeeds
                          .childHasFoodAllergies,
                    },
                  ],
                }),
                buildSelectField({
                  id: 'allergiesAndIntolerances.foodAllergies',
                  title:
                    newPrimarySchoolMessages.differentNeeds.typeOfAllergies,
                  dataTestId: 'food-allergies',
                  placeholder:
                    newPrimarySchoolMessages.differentNeeds
                      .typeOfAllergiesPlaceholder,
                  // TODO: Nota gögn fá Júní?
                  options: getFoodAllergiesOptions(),
                  isMulti: true,
                  condition: (answers) => {
                    const { hasFoodAllergies } = getApplicationAnswers(answers)

                    return hasFoodAllergies?.includes(YES)
                  },
                }),
                buildAlertMessageField({
                  id: 'allergiesAndIntolerances.info',
                  title: newPrimarySchoolMessages.shared.alertTitle,
                  message:
                    newPrimarySchoolMessages.differentNeeds
                      .confirmFoodAllergiesAlertMessage,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                  marginBottom: 4,
                  condition: (answers) => {
                    const { hasFoodAllergies } = getApplicationAnswers(answers)

                    return hasFoodAllergies?.includes(YES)
                  },
                }),
                buildCheckboxField({
                  id: 'allergiesAndIntolerances.hasFoodIntolerances',
                  title: '',
                  spacing: 0,
                  options: [
                    {
                      value: YES,
                      label:
                        newPrimarySchoolMessages.differentNeeds
                          .childHasFoodIntolerances,
                    },
                  ],
                }),
                buildSelectField({
                  id: 'allergiesAndIntolerances.foodIntolerances',
                  title:
                    newPrimarySchoolMessages.differentNeeds.typeOfIntolerances,
                  dataTestId: 'food-intolerances',
                  placeholder:
                    newPrimarySchoolMessages.differentNeeds
                      .typeOfIntolerancesPlaceholder,
                  // TODO: Nota gögn fá Júní?
                  options: getFoodIntolerancesOptions(),
                  isMulti: true,
                  condition: (answers) => {
                    const { hasFoodIntolerances } =
                      getApplicationAnswers(answers)

                    return hasFoodIntolerances?.includes(YES)
                  },
                }),
                buildDescriptionField({
                  // Needed to add space
                  id: 'allergiesAndIntolerances.divider',
                  title: '',
                  marginBottom: 4,
                  condition: (answers) => {
                    const { hasFoodIntolerances } =
                      getApplicationAnswers(answers)

                    return hasFoodIntolerances?.includes(YES)
                  },
                }),
                buildCheckboxField({
                  id: 'allergiesAndIntolerances.isUsingEpiPen',
                  title: '',
                  spacing: 0,
                  options: [
                    {
                      value: YES,
                      label:
                        newPrimarySchoolMessages.differentNeeds
                          .usesEpinephrinePen,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'supportSubSection',
          title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
          children: [
            buildMultiField({
              id: 'support',
              title: newPrimarySchoolMessages.differentNeeds.support,
              description:
                newPrimarySchoolMessages.differentNeeds.supportDescription,
              children: [
                buildRadioField({
                  id: 'support.developmentalAssessment',
                  title:
                    newPrimarySchoolMessages.differentNeeds
                      .developmentalAssessment,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      dataTestId: 'yes-option',
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      dataTestId: 'no-option',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'support.specialSupport',
                  title: newPrimarySchoolMessages.differentNeeds.specialSupport,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      dataTestId: 'yes-option',
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      dataTestId: 'no-option',
                      value: NO,
                    },
                  ],
                }),
                buildCheckboxField({
                  id: 'support.requestMeeting',
                  title: '',
                  description:
                    newPrimarySchoolMessages.differentNeeds.requestMeeting,
                  options: [
                    {
                      value: YES,
                      label:
                        newPrimarySchoolMessages.differentNeeds
                          .requestMeetingDescription,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'useOfFootageSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds.useOfFootageSubSectionTitle,
          children: [
            buildMultiField({
              id: 'photography',
              title: newPrimarySchoolMessages.differentNeeds.photography,
              description:
                newPrimarySchoolMessages.differentNeeds.photographyDescription,
              children: [
                buildRadioField({
                  id: 'photography.photographyConsent',
                  title:
                    newPrimarySchoolMessages.differentNeeds.photographyConsent,
                  width: 'half',
                  required: true,
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      dataTestId: 'yes-option',
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      dataTestId: 'no-option',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'photography.photoSchoolPublication',
                  condition: (answers) => {
                    const { photographyConsent } =
                      getApplicationAnswers(answers)
                    return photographyConsent === YES
                  },
                  title:
                    newPrimarySchoolMessages.differentNeeds
                      .photoSchoolPublication,
                  width: 'half',
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      dataTestId: 'yes-option',
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      dataTestId: 'no-option',
                      value: NO,
                    },
                  ],
                }),
                buildRadioField({
                  id: 'photography.photoMediaPublication',
                  condition: (answers) => {
                    const { photographyConsent } =
                      getApplicationAnswers(answers)
                    return photographyConsent === YES
                  },
                  title:
                    newPrimarySchoolMessages.differentNeeds
                      .photoMediaPublication,
                  width: 'half',
                  options: [
                    {
                      label: newPrimarySchoolMessages.shared.yes,
                      dataTestId: 'yes-option',
                      value: YES,
                    },
                    {
                      label: newPrimarySchoolMessages.shared.no,
                      dataTestId: 'no-option',
                      value: NO,
                    },
                  ],
                }),
                buildAlertMessageField({
                  id: 'differentNeeds.photographyInfo',
                  title: newPrimarySchoolMessages.shared.alertTitle,
                  message:
                    newPrimarySchoolMessages.differentNeeds.photographyInfo,
                  doesNotRequireAnswer: true,
                  alertType: 'info',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSection',
      title: newPrimarySchoolMessages.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: '',
          description: '',
          children: [
            buildCustomField(
              {
                id: 'overviewScreen',
                title: newPrimarySchoolMessages.overview.overviewTitle,
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: newPrimarySchoolMessages.overview.submitButton,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: newPrimarySchoolMessages.overview.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      expandableIntro: '',
      expandableDescription:
        newPrimarySchoolMessages.conclusion.expandableDescription,
    }),
  ],
})
