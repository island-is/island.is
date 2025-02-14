import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildDescriptionField,
  buildHiddenInput,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { incomeOptions } from '../../../utils/options'
import { ApproveOptions } from '../../../lib/types'

export const incomeSubsection = buildSubSection({
  id: Routes.INCOME,
  title: m.incomeForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'incomeMultiField',
      title: m.incomeForm.general.pageTitle,
      children: [
        buildRadioField({
          id: Routes.INCOME,
          width: 'half',
          options: incomeOptions,
          marginBottom: 2,
        }),
        buildHiddenInput({
          condition: (answers) => {
            const income = getValueViaPath<ApproveOptions>(answers, 'income')
            return income === ApproveOptions.Yes
          },
          id: 'incomeBulletlistTitleHidden',
        }),
        buildDescriptionField({
          id: 'incomeBulletListTitle',
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
