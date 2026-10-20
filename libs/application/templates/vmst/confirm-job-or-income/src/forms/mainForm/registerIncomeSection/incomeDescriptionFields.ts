import { buildDescriptionField } from '@island.is/application/core'
import * as m from '../../../lib/messages'

// The month title and the "see all income" link are separate fields so the
// link gets its own spacing; rendered together the link sat tight under the
// title and was awkward to hover/click.
export const buildIncomeDescriptionFields = (id: string) => [
  buildDescriptionField({
    id: `${id}Title`,
    title: () => {
      const month = new Date().toLocaleDateString('is-IS', {
        month: 'long',
      })
      return {
        ...m.application.incomeTitle,
        values: { month },
      }
    },
    description: m.application.incomeDescriptionLink,
    marginBottom: 2,
    titleVariant: 'h4',
  }),
]
