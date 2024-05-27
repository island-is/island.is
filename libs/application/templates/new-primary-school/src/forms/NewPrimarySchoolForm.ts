import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
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
} from '@island.is/application/types'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { format as formatKennitala } from 'kennitala'
import Logo from '../assets/Logo'
import { RelationOptions } from '../lib/constants'
import { newPrimarySchoolMessages } from '../lib/messages'
import {
  getApplicationExternalData,
  getOtherParent,
  getRelationOptionLabel,
  getRelationOptions,
  canApply,
} from '../lib/newPrimarySchoolUtils'

export const NewPrimarySchoolForm: Form = buildForm({
  id: 'newPrimarySchoolDraft',
  title: newPrimarySchoolMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: newPrimarySchoolMessages.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'childrenNParentsSection',
      title: newPrimarySchoolMessages.childrenNParents.sectionTitle,
      children: [
        buildSubSection({
          id: 'childrenSection',
          title: newPrimarySchoolMessages.childrenNParents.childrenSectionTitle,
          children: [
            buildMultiField({
              id: 'childrenMultiField',
              title: newPrimarySchoolMessages.childrenNParents.children,
              description:
                newPrimarySchoolMessages.childrenNParents.childrenDescription,
              children: [
                buildAlertMessageField({
                  id: 'childrenAlertField',
                  title:
                    newPrimarySchoolMessages.childrenNParents.childrenInfoTitle,
                  alertType: 'info',
                  doesNotRequireAnswer: true,
                  marginBottom: 5,
                  message:
                    newPrimarySchoolMessages.childrenNParents
                      .childrenInfoDescription,
                }),
                buildRadioField({
                  id: 'childNationalId',
                  title:
                    newPrimarySchoolMessages.childrenNParents
                      .childrenRadioTitle,
                  description: '',

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
          id: 'parentsSection',
          title: newPrimarySchoolMessages.childrenNParents.parentsSection,
          children: [
            buildMultiField({
              id: 'parents',
              title: '',
              children: [
                buildDescriptionField({
                  id: 'parentsSection',
                  title:
                    newPrimarySchoolMessages.childrenNParents.parentsSection,
                  description:
                    newPrimarySchoolMessages.childrenNParents.description,
                  titleVariant: 'h3',
                  marginBottom: 5,
                  space: 'gutter',
                }),
                buildDescriptionField({
                  id: 'parentsInfo1',
                  title: newPrimarySchoolMessages.childrenNParents.parent,
                  titleVariant: 'h4',
                }),
                buildTextField({
                  title: newPrimarySchoolMessages.childrenNParents.name,
                  dataTestId: 'name1',
                  id: 'parent1.fullName',
                  readOnly: true,
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.nationalRegistry?.data as {
                        fullName?: string
                      }
                    )?.fullName,
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.nationalId,
                  dataTestId: 'nationalId1',
                  id: 'parent1.nationalId',
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
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.address,
                  dataTestId: 'address1',
                  id: 'parent1.address.streetAddress',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantAddress
                  },
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.postalcode,
                  dataTestId: 'postalcode1',
                  id: 'parent1.address.postalcode',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantPostalCode
                  },
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.municipality,
                  dataTestId: 'city1',
                  id: 'parent1.address.city',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    return getApplicationExternalData(application.externalData)
                      .applicantCity
                  },
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.email,
                  dataTestId: 'email',
                  id: 'parent1.email',
                  variant: 'email',
                  defaultValue: (application: Application) =>
                    (
                      application.externalData.userProfile?.data as {
                        email?: string
                      }
                    )?.email,
                }),
                buildPhoneField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.phoneNumber,
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
                  id: 'parent1.phoneNumber',
                  dataTestId: 'phone1',
                  placeholder: '000-0000',
                }),

                buildDescriptionField({
                  id: 'parentsInfo2',
                  title: newPrimarySchoolMessages.childrenNParents.otherParent,
                  titleVariant: 'h4',
                  marginTop: 'containerGutter',
                }),
                buildTextField({
                  title: newPrimarySchoolMessages.childrenNParents.name,
                  dataTestId: 'name2',
                  id: 'parent2.fullName',
                  readOnly: true,
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.fullName,
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.nationalId,
                  dataTestId: 'nationalId2',
                  id: 'parent2.nationalId',
                  format: '######-####',
                  readOnly: true,
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.nationalId,
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.address,
                  dataTestId: 'address2',
                  id: 'parent2.address.streetAddress',
                  readOnly: true,
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.streetAddress,
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.postalcode,
                  dataTestId: 'postalcode2',
                  id: 'parent2.address.postalcode',
                  readOnly: true,
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.postalCode,
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.municipality,
                  dataTestId: 'city2',
                  id: 'parent2.address.city',
                  readOnly: true,
                  defaultValue: (application: Application) =>
                    getOtherParent(application)?.address.city,
                }),
                buildTextField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.email,
                  dataTestId: 'email2',
                  id: 'parent2.email',
                  variant: 'email',
                }),
                buildPhoneField({
                  width: 'half',
                  title: newPrimarySchoolMessages.childrenNParents.phoneNumber,

                  id: 'parent2.phoneNumber',
                  dataTestId: 'phone2',
                  placeholder: '000-0000',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'schoolSection',
      title: newPrimarySchoolMessages.school.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'relativesSection',
      title: newPrimarySchoolMessages.relatives.sectionTitle,
      children: [
        buildMultiField({
          id: 'relatives',
          title: newPrimarySchoolMessages.relatives.title,
          description: newPrimarySchoolMessages.relatives.description,
          children: [
            buildAlertMessageField({
              id: 'relatives.alertMessage',
              title: newPrimarySchoolMessages.shared.alertTitle,
              message: newPrimarySchoolMessages.relatives.alertMessage,
              doesNotRequireAnswer: true,
              alertType: 'info',
            }),
            buildTableRepeaterField({
              id: 'relatives',
              title: '',
              formTitle: newPrimarySchoolMessages.relatives.registrationTitle,
              addItemButtonText: newPrimarySchoolMessages.relatives.addRelative,
              saveItemButtonText:
                newPrimarySchoolMessages.relatives.registerRelative,
              removeButtonTooltipText:
                newPrimarySchoolMessages.relatives.deleteRelative,
              marginTop: 0,
              fields: {
                fullName: {
                  component: 'input',
                  label: newPrimarySchoolMessages.relatives.fullName,
                  width: 'half',
                  type: 'text',
                  dataTestId: 'relative-full-name',
                },
                phoneNumber: {
                  component: 'input',
                  label: newPrimarySchoolMessages.relatives.phoneNumber,
                  width: 'half',
                  type: 'tel',
                  format: '###-####',
                  placeholder: '000-0000',
                  dataTestId: 'relative-phone-number',
                },
                nationalId: {
                  component: 'input',
                  label: newPrimarySchoolMessages.relatives.nationalId,
                  width: 'half',
                  type: 'text',
                  format: '######-####',
                  placeholder: '000000-0000',
                  dataTestId: 'relative-national-id',
                },
                relation: {
                  component: 'select',
                  label: newPrimarySchoolMessages.relatives.relation,
                  width: 'half',
                  placeholder:
                    newPrimarySchoolMessages.relatives.relationPlaceholder,
                  options: getRelationOptions(),
                  dataTestId: 'relative-relation',
                },
              },
              table: {
                format: {
                  phoneNumber: (value) =>
                    formatPhoneNumber(removeCountryCode(value ?? '')),
                  nationalId: (value) => formatKennitala(value),
                  relation: (value) =>
                    getRelationOptionLabel(value as RelationOptions),
                },
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'mealSection',
      title: newPrimarySchoolMessages.meal.sectionTitle,
      children: [],
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
