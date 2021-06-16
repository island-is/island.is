import { buildDescriptionField, buildForm, buildSection, Form, FormModes } from "@island.is/application/core";

export const ComplaintsToAlthingiOmbudsmanApplication: Form = buildForm({
	id: 'ComplaintsToAlthingiOmbudsmanDraftForm',
	title: 'title',
  mode: FormModes.APPLYING,
  children: [
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