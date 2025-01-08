import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { TextFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import {
  formatGrade,
  getApplicationExternalData,
} from '../../lib/newPrimarySchoolUtils'
import { newPrimarySchoolMessages } from '../../lib/messages'

const GradeField: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { lang, formatMessage } = useLocale()
  const { title, id, width, disabled } = field
  const { childGradeLevel } = getApplicationExternalData(
    application.externalData,
  )

  const grade = formatMessage(newPrimarySchoolMessages.overview.currentGrade, {
    grade: formatGrade(childGradeLevel, lang),
  })

  return (
    <TextFormField
      application={application}
      showFieldName
      field={{
        id,
        disabled,
        defaultValue: grade,
        title,
        width,
        type: FieldTypes.TEXT,
        component: FieldComponents.TEXT,
        children: undefined,
      }}
    />
  )
}

export default GradeField
