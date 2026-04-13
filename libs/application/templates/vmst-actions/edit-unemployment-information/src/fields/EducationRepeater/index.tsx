import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { coreMessages } from '@island.is/application/core'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { application as applicationMessages } from '../../lib/messages'
import {
  getDegreeOptions,
  getCourseOfStudy,
  getLevelsOfStudyOptions,
  getYearOptions,
} from '../../utils/educationInformation'
import { getDefaultEducation } from '../../utils/defaultValues'

export const EducationRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { getValues, setValue, watch } = useFormContext()
  const { formatMessage, locale } = useLocale()

  const defaultEducation = useMemo(
    () => getDefaultEducation(application.externalData),
    [application.externalData],
  )

  const levelOfStudyOptions = useMemo(
    () => getLevelsOfStudyOptions(application, (locale ?? 'is') as Locale),
    [application, locale],
  )

  useEffect(() => {
    const currentEdu = getValues('educationHistory')
    if (
      (!currentEdu || currentEdu.length === 0) &&
      defaultEducation.length > 0
    ) {
      setValue('educationHistory', defaultEducation)
    }
  }, [defaultEducation, getValues, setValue])

  const educationRows: Array<Record<string, string> & { readOnly?: boolean }> =
    watch('educationHistory') ?? []

  const editableEducationCount = educationRows.filter((r) => !r.readOnly).length

  const addRow = () => {
    const current = getValues('educationHistory') ?? []
    setValue('educationHistory', [...current, {}])
  }

  const removeRow = (index: number) => {
    const current: Array<Record<string, string>> =
      getValues('educationHistory') ?? []
    setValue(
      'educationHistory',
      current.filter((_, i) => i !== index),
    )
  }

  return (
    <Box>
      {educationRows.map((row, index) => {
        const isReadOnly = !!row.readOnly
        const prefix = `educationHistory[${index}]`

        const levelLabel = isReadOnly
          ? levelOfStudyOptions.find((o) => o.value === row.levelOfStudy)
              ?.label ?? ''
          : ''
        const degreeLabel = isReadOnly
          ? getDegreeOptions(
              application,
              (locale ?? 'is') as Locale,
              row.levelOfStudy,
            ).find((o) => o.value === row.degree)?.label ?? ''
          : ''
        const courseLabel = isReadOnly
          ? getCourseOfStudy(
              application,
              row.levelOfStudy,
              row.degree,
              (locale ?? 'is') as Locale,
            ).find((o) => o.value === row.courseOfStudy)?.label ?? ''
          : ''
        const yearLabel = isReadOnly ? row.endDate : ''

        return (
          <Box key={`edu-${index}`} marginBottom={3}>
            <Text variant="h5" marginBottom={1}>
              {formatMessage(applicationMessages.educationTitle)} {index + 1}
            </Text>
            <GridRow>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={2}>
                {isReadOnly ? (
                  <Input
                    name={`${prefix}.levelOfStudy`}
                    label={formatMessage(
                      applicationMessages.educationLevelOfStudyLabel,
                    )}
                    value={levelLabel}
                    readOnly
                  />
                ) : (
                  <SelectController
                    id={`${prefix}.levelOfStudy`}
                    name={`${prefix}.levelOfStudy`}
                    label={formatMessage(
                      applicationMessages.educationLevelOfStudyLabel,
                    )}
                    options={levelOfStudyOptions}
                    backgroundColor="blue"
                  />
                )}
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={2}>
                {isReadOnly ? (
                  <Input
                    name={`${prefix}.degree`}
                    label={formatMessage(
                      applicationMessages.educationDegreeLabel,
                    )}
                    value={degreeLabel}
                    readOnly
                  />
                ) : (
                  <SelectController
                    id={`${prefix}.degree`}
                    name={`${prefix}.degree`}
                    label={formatMessage(
                      applicationMessages.educationDegreeLabel,
                    )}
                    options={getDegreeOptions(
                      application,
                      (locale ?? 'is') as Locale,
                      row.levelOfStudy,
                    )}
                    backgroundColor="blue"
                  />
                )}
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={2}>
                {isReadOnly ? (
                  <Input
                    name={`${prefix}.courseOfStudy`}
                    label={formatMessage(
                      applicationMessages.educationCourseOfStudyLabel,
                    )}
                    value={courseLabel}
                    readOnly
                  />
                ) : (
                  <SelectController
                    id={`${prefix}.courseOfStudy`}
                    name={`${prefix}.courseOfStudy`}
                    label={formatMessage(
                      applicationMessages.educationCourseOfStudyLabel,
                    )}
                    options={getCourseOfStudy(
                      application,
                      row.levelOfStudy,
                      row.degree,
                      (locale ?? 'is') as Locale,
                    )}
                    backgroundColor="blue"
                  />
                )}
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={2}>
                {isReadOnly ? (
                  <Input
                    name={`${prefix}.endDate`}
                    label={formatMessage(applicationMessages.educationEndLabel)}
                    value={yearLabel}
                    readOnly
                  />
                ) : (
                  <SelectController
                    id={`${prefix}.endDate`}
                    name={`${prefix}.endDate`}
                    label={formatMessage(applicationMessages.educationEndLabel)}
                    options={getYearOptions()}
                    backgroundColor="blue"
                  />
                )}
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box display="flex" justifyContent="flexEnd" columnGap={1}>
        {editableEducationCount > 0 && (
          <Button
            variant="ghost"
            colorScheme="destructive"
            size="small"
            onClick={() => removeRow(educationRows.length - 1)}
          >
            {formatMessage(coreMessages.buttonRemove)}
          </Button>
        )}
        <Button variant="ghost" size="small" onClick={() => addRow()}>
          {formatMessage(applicationMessages.addNewEducation)}
        </Button>
      </Box>
    </Box>
  )
}
