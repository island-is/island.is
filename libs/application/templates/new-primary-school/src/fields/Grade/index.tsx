import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { TextFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect } from 'react'
import {
  formatGrade,
  getApplicationExternalData,
} from '../../lib/newPrimarySchoolUtils'
import { newPrimarySchoolMessages } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'

const Grade: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { lang, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { title, id, width, disabled } = field
  const { childGradeLevel } = getApplicationExternalData(
    application.externalData,
  )

  const grade = formatMessage(
    newPrimarySchoolMessages.primarySchool.currentGrade,
    {
      grade: formatGrade(childGradeLevel, lang),
    },
  )

  useEffect(() => {
    setValue(id, grade)
  }, [id, grade, setValue])

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

export default Grade
