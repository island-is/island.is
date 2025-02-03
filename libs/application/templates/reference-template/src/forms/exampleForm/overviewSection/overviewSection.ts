import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildCustomField,
  buildSubmitField,
  buildOverviewField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: '',
      children: [
        buildDescriptionField({
          id: 'overview',
          title: 'Overview',
          description: m.overviewDescription,
        }),
        buildOverviewField({
          id: 'overviewX',
          title: 'asdf',
          description: m.overviewDescription,
          sections: (_answers, _externalData) => {
            return [
              {
                type: 'keyValue',
                title: 'asdf',
                backId: 'clearOnChangeMultiField',
                items: [
                  {
                    width: 'full',
                    keyValue: [
                      {
                        keyText: 'asdf',
                        valueText: 'asdf',
                      },
                      {
                        keyText: 'asdf',
                        valueText: 'asdf',
                      },
                    ],
                  },
                  {
                    width: 'half',
                    keyValue: [
                      {
                        keyText: 'asdf',
                        valueText: 'asdf',
                      },
                    ],
                    sum: {
                      keyText: 'asdf',
                      valueText: 'asdf',
                    },
                  },
                  {
                    width: 'half',
                    keyValue: [
                      {
                        keyText: 'asdf',
                        valueText: 'asdf',
                      },
                    ],
                    sum: {
                      keyText: 'asdf',
                      valueText: 'asdf',
                    },
                  },
                ],
              },
              {
                type: 'attachments',
                title: 'asdf',
                backId: 'conditionsCheckbox',
                attachmentItems: [
                  {
                    keyText: 'asdf',
                    valueText: 'asdf',
                  },
                ],
              },
            ]
          },
        }),
        buildCustomField({
          id: 'customComponent',
          title: '',
          component: 'Overview',
        }),
        buildSubmitField({
          id: 'submitApplication',
          title: '',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overviewSubmit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
