import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
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
  YES,
  NO,
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { format as formatKennitala } from 'kennitala'
import { RelationOptions } from '../lib/constants'
import { newPrimarySchoolMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getOtherParent,
  getRelationOptionLabel,
  getRelationOptions,
  hasOtherParent,
  canApply,
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
          children: [],
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
                  readOnly: true,
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
                  readOnly: true,
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
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantAddress
                  },
                }),
                buildTextField({
                  id: 'parents.parent1.address.postalcode',
                  title: newPrimarySchoolMessages.shared.postalcode,
                  width: 'half',
                  dataTestId: 'postalcode1',
                  readOnly: true,
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
                  readOnly: true,
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
                  readOnly: true,
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
                  readOnly: true,
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
                  readOnly: true,
                  condition: (answers, externalData) =>
                    hasOtherParent(answers, externalData),
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.streetAddress,
                }),
                buildTextField({
                  id: 'parents.parent2.address.postalcode',
                  title: newPrimarySchoolMessages.shared.postalcode,
                  width: 'half',
                  dataTestId: 'postalcode2',
                  readOnly: true,
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
                  readOnly: true,
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
                  maxValues: 6,
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
                      label:
                        newPrimarySchoolMessages.childrenNParents
                          .relativesRelation,
                      width: 'half',
                      placeholder:
                        newPrimarySchoolMessages.childrenNParents
                          .relativesRelationPlaceholder,
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
                      newPrimarySchoolMessages.childrenNParents
                        .relativesRelation,
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
          id: 'newSchoolSubSection',
          title:
            newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
          children: [
            buildMultiField({
              id: 'newSchoolMultiField',
              title:
                newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
              children: [
                buildCheckboxField({
                  id: 'school.moveAbroad',
                  title: '',
                  dataTestId: 'new-school-move-abroad',
                  backgroundColor: 'white',
                  options: [
                    {
                      value: YES,
                      label: newPrimarySchoolMessages.primarySchool.moveAbroad,
                    },
                  ],
                }),
                buildSelectField({
                  id: 'school.muncipality',
                  title: newPrimarySchoolMessages.shared.municipality,
                  /*  disabled: (application: Application) => {
                    const { moveAbroad } = getApplicationAnswers(
                      application.answers,
                    )
                    return moveAbroad === NO
                  },*/
                  options: [
                    {
                      value: 'Reykjavík',
                      label: 'Reykjavík',
                    },
                    {
                      value: 'Garðarbær',
                      label: 'Garðarbær',
                    },
                  ],
                  placeholder:
                    newPrimarySchoolMessages.shared.municipalityPlaceholder,
                  dataTestId: 'new-school-municipality',
                }),
                buildSelectField({
                  id: 'school.neighborhood',
                  title: newPrimarySchoolMessages.shared.neighborhood,
                  condition: (answers) => {
                    const { moveAbroad } = getApplicationAnswers(answers)
                    return moveAbroad === NO
                  },
                  options: [
                    {
                      value: 'Árbær',
                      label: 'Árbær',
                    },
                    {
                      value: 'Breiðholt',
                      label: 'Breiðholt',
                    },
                  ],
                  placeholder:
                    newPrimarySchoolMessages.shared.neighborhoodPlaceholder,
                  dataTestId: 'new-school-neighborhood',
                }),
                buildSelectField({
                  id: 'school.school',
                  title: newPrimarySchoolMessages.shared.school,
                  condition: (answers) => {
                    const { moveAbroad } = getApplicationAnswers(answers)
                    return moveAbroad === NO
                  },
                  options: [
                    {
                      value: 'Ártúnsskóli',
                      label: 'Ártúnsskóli',
                    },
                    {
                      value: 'Árbæjarskóli',
                      label: 'Árbæjarskóli',
                    },
                  ],
                  placeholder:
                    newPrimarySchoolMessages.shared.schoolPlaceholder,
                  dataTestId: 'new-school-school',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'reasonForTransferSubSection',
          title:
            newPrimarySchoolMessages.primarySchool
              .reasonForTransferSubSectionTitle,
          children: [],
        }),
        buildSubSection({
          id: 'siblingsSubSection',
          title: newPrimarySchoolMessages.primarySchool.siblingsSubSectionTitle,
          children: [],
        }),
        buildSubSection({
          id: 'startingSchoolSubSection',
          title:
            newPrimarySchoolMessages.primarySchool
              .startingSchoolSubSectionTitle,
          children: [],
        }),
      ],
    }),
    buildSection({
      id: 'differentNeedsSection',
      title: newPrimarySchoolMessages.differentNeeds.sectionTitle,
      children: [
        buildSubSection({
          id: 'languageSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds.languageSubSectionTitle,
          children: [],
        }),
        buildSubSection({
          id: 'schoolMealSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds.schoolMealSubSectionTitle,
          children: [],
        }),
        buildSubSection({
          id: 'supportSubSection',
          title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
          children: [],
        }),
        buildSubSection({
          id: 'schoolBusSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds.schoolBusSubSectionTitle,
          children: [],
        }),
        buildSubSection({
          id: 'useOfFootageSubSection',
          title:
            newPrimarySchoolMessages.differentNeeds.useOfFootageSubSectionTitle,
          children: [],
        }),
      ],
    }),
    buildSection({
      id: 'confirmationSection',
      title: newPrimarySchoolMessages.confirm.sectionTitle,
      children: [
        buildMultiField({
          id: 'confirmation',
          title: '',
          description: '',
          children: [
            buildCustomField(
              {
                id: 'confirmationScreen',
                title: newPrimarySchoolMessages.confirm.overviewTitle,
                component: 'Review',
              },
              {
                editable: true,
              },
            ),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: newPrimarySchoolMessages.confirm.submitButton,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: newPrimarySchoolMessages.confirm.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: newPrimarySchoolMessages.conclusion.alertTitle,
      expandableHeader: newPrimarySchoolMessages.conclusion.nextStepsLabel,
      expandableDescription: newPrimarySchoolMessages.conclusion.accordionText,
    }),
  ],
})
