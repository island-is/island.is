import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { format as formatKennitala } from 'kennitala'
import Logo from '../assets/Logo'
import { newPrimarySchoolMessages } from '../lib/messages'
import {
  getApplicationExternalData,
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
      children: [],
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
        buildSubSection({
          id: '',
          title: '',
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
      ],
    }),
    buildFormConclusionSection({
      alertTitle: newPrimarySchoolMessages.conclusion.alertTitle,
      expandableHeader: newPrimarySchoolMessages.conclusion.nextStepsLabel,
      expandableDescription: newPrimarySchoolMessages.conclusion.accordionText,
    }),
  ],
})
