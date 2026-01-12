import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'
import { getFinancialLimit } from '../../../utils/helpers'
import { GREATER, LESS } from '../../../utils/constants'

export const financialLimitSection = buildSection({
  id: 'financialLimit',
  title: m.financialLimit,
  children: [
    buildMultiField({
      id: 'financialLimit',
      title: m.financialLimit,
      children: [
        buildRadioField({
          id: 'incomeLimit.limit',
          options: (application) => {
            const limit = getFinancialLimit(application)

            return [
              {
                value: LESS,
                label: {
                  ...m.lessThanLimit,
                  values: {
                    limit: formatCurrency(limit?.toString() ?? ''),
                  },
                },
              },
              {
                value: GREATER,
                label: {
                  ...m.moreThanLimit,
                  values: {
                    limit: formatCurrency(limit?.toString() ?? ''),
                  },
                },
              },
            ]
          },
        }),
      ],
    }),
  ],
})
