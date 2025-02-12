import {
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { ApproveOptions } from '../../lib/types'
import { Routes } from '../../lib/constants'
import { incomeOptions } from '../../utils/options'
import * as m from '../../lib/messages'

export const spouseIncomeSection = buildSection({
  id: Routes.SPOUSEINCOME,
  title: m.incomeForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'incomeMultiField',
      title: m.incomeForm.general.pageTitle,
      children: [
        buildRadioField({
          id: Routes.SPOUSEINCOME,
          width: 'half',
          options: incomeOptions,
          marginBottom: 2,
        }),
        buildHiddenInput({
          condition: (answers) => {
            const income = getValueViaPath<ApproveOptions>(
              answers,
              Routes.SPOUSEINCOME,
            )
            return income === ApproveOptions.Yes
          },
          id: 'incomeBulletlistTitleHidden',
        }),
        buildDescriptionField({
          id: 'incomeBulletlistTitle',
          title: m.incomeForm.bulletList.headline,
          titleVariant: 'h3',
        }),
        buildDescriptionField({
          id: 'incomeBulletList',
          description: m.incomeForm.bulletList.bullets,
        }),
      ],
    }),
  ],
})
