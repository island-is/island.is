import {
  buildAlertMessageField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
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
  getRelationOptionLabel,
  getRelationOptions,
  isChildAtPrimarySchoolAge,
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
          id: 'children',
          title: newPrimarySchoolMessages.childrenNParents.children,
          children: [
            buildRadioField({
              id: 'childsNationalId',
              title: newPrimarySchoolMessages.childrenNParents.children,
              description: '',
              options: (application) => {
                const { children } = getApplicationExternalData(
                  application.externalData,
                )

                return children
                  .filter((child) =>
                    isChildAtPrimarySchoolAge(child.nationalId),
                  )
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
