import { FormValue, KeyValueItem } from '@island.is/application/types'
import { overview } from '../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { Information } from '..'
import { ExamCategoryType } from '../lib/dataSchema'

export const getExamInformationSelfForOverview = (
  answers: FormValue,
): Array<KeyValueItem> => {
  const information = getValueViaPath<Information>(answers, 'information')
  const examCategories = getValueViaPath<ExamCategoryType[]>(
    answers,
    'examCategories',
  )

  if (!examCategories)
    return [
      {
        width: 'full',
        valueText: [],
      },
    ]
  const categoriesString = examCategories?.[0]?.categories.flatMap(
    (cat) => cat.label,
  )

  const categoryAndListValueTexts =
    examCategories[0].categories.map((cat, idx) => {
      const instructor = examCategories[0].instructor[idx].label
      return {
        ...overview.examInfoSelf.instructor,
        values: {
          category: cat.value,
          instructor: instructor,
        },
      }
    }) || []

  return [
    {
      width: 'full',
      keyText: overview.exam.title,
      valueText: [
        {
          ...overview.examInfoSelf.examinee,
          values: {
            value: information?.name || '',
          },
        },
        {
          ...overview.examInfoSelf.categories,
          values: {
            value: categoriesString.join(),
          },
        },
        categoryAndListValueTexts?.flat(),
      ],
    },
  ]
}
