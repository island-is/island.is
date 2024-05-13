import { YES, buildCheckboxField, buildDescriptionField, buildDividerField, buildKeyValueField, buildMultiField, buildSection, buildSubmitField } from "@island.is/application/core";
import { m } from "../../../lib/messages"
import { DefaultEvents } from "@island.is/application/types";

export const prepaidOverview = buildSection({
  id: 'prepaidOverview',
  title: 'Yfirlit',
  children: [
    buildMultiField({
      id: 'prepaidOverview',
      title: m.overview,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'temp',
          title: 'Boop meep',
          titleVariant: 'h3',
          space: 'gutter',
          marginBottom: 'gutter',
        }),
        buildKeyValueField({
          label: 'Trala',
          value: 'yes',
        }),
        buildDescriptionField({
          id: 'space',
          title: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: 'Trolo',
          value: 'yes',
        }),
        buildDescriptionField({
          id: 'space1',
          title: '',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'temp',
          title: 'Boop meep',
          titleVariant: 'h3',
          space: 'gutter',
          marginBottom: 'gutter',
        }),
        buildKeyValueField({
          label: 'Trala',
          value: 'yes',
        }),
        buildDescriptionField({
          id: 'space',
          title: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: 'Trolo',
          value: 'yes',
        }),
        buildDescriptionField({
          id: 'space2',
          title: '',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildCheckboxField({
          id: 'confirmActionPrepaid',
          title: '',
          large: false,
          backgroundColor: 'white',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: 'Ég staðfesti að ofangreindar upplýsingar séu réttar',
            },
          ],
        }),
        buildSubmitField({
          id: 'prepaid.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Staðfesta',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})

