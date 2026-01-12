import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Select,
} from '@island.is/island-ui/core'
import { FC, SetStateAction, useCallback, useEffect, useState } from 'react'
import {
  ExamCategoryType,
  ExamineeType,
  InstructorType,
} from '../../lib/dataSchema'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { ExamCategoryDto } from '@island.is/clients/practical-exams-ver'
import { useLocale } from '@island.is/localization'
import { examCategories } from '../../lib/messages'
import { InstructorInformationInput } from '../../utils/types'
import { useLazyValidateExaminee } from '../../hooks/useLazyValidateExaminee'
import { WorkMachineExamineeInput } from '@island.is/api/schema'
import { MultiValue } from 'react-select'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { FileUpload } from './FileUpload'

type ExamInputProps = {
  instructors: InstructorType
  idx: number
  onSave: () => void
  setTable: React.Dispatch<SetStateAction<string[][]>>
  tableData: string[][]
}

type Option = {
  value: string
  label: string
  disabled?: boolean
}

const hasValidCategoryCode = (
  category: ExamCategoryDto,
): category is ExamCategoryDto & { categoryCode: string } => {
  return typeof category.categoryCode === 'string'
}

export const ExamInputs: FC<
  React.PropsWithChildren<FieldBaseProps & ExamInputProps>
> = ({ instructors, application, idx, onSave, tableData, setTable, field }) => {
  const { externalData, answers } = application
  const { lang, formatMessage } = useLocale()
  const [categoryList, setCategoryList] = useState<Array<Option>>([])
  const [chosenCategories, setChosenCategories] = useState<Option[]>([])
  const [isInvalidInput, setIsInvalidInput] = useState<boolean>(false)
  const [isInvalidValidation, setIsInvalidValidation] = useState<boolean>(false)
  const [isMissingFileUpload, setIsMissingFileUpload] = useState<boolean>(false)
  const [isWebServiceFailure, setIsWebServiceFailure] = useState<boolean>(false)
  const [validationError, setValidationError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const getExamineeValidation = useLazyValidateExaminee()
  const getExamineeValidationCallback = useCallback(
    async (workMachineExaminee: WorkMachineExamineeInput) => {
      try {
        const { data } = await getExamineeValidation({
          input: {
            workMachineExamineeDto: workMachineExaminee,
            xCorrelationID: application.id,
          },
        })
        return data
      } catch (error) {
        // This does not interfere with validation errors as they are sent via 200 ok with an error message
        return undefined
      }
    },
    [application.id, getExamineeValidation],
  )
  const { control, getValues, setValue } = useFormContext()
  const externalExamCategories = getValueViaPath<Array<ExamCategoryDto>>(
    externalData,
    'examCategories.data',
  )
  const allCategoriesThatInclude =
    externalExamCategories
      ?.map((cat) => {
        if (cat.includedExamCategories && cat.includedExamCategories.length > 0)
          return cat.categoryCode
        return null
      })
      .filter(Boolean)
      .flat() || []
  const examCategoriesRequireMedicalCertificate =
    externalExamCategories
      ?.filter((category) => category.requiresMedicalCertificate)
      .map((i) => i.categoryCode) || []
  const showInfo = chosenCategories.some((cat) =>
    allCategoriesThatInclude.includes(cat.value),
  )
  const chosenMedicalCategories = chosenCategories
    .map((cat) => cat.value)
    .filter((cat) => examCategoriesRequireMedicalCertificate.includes(cat))
    .join(', ')

  useEffect(() => {
    const examCategories = getValueViaPath<Array<ExamCategoryDto>>(
      externalData,
      'examCategories.data',
    )

    if (!examCategories) {
      // Only update state if it's different from current state
      setCategoryList((prev) => (prev.length === 0 ? prev : []))
      return
    }

    const mappedCategories = examCategories
      .filter(hasValidCategoryCode)
      .map((category) => {
        const name = lang === 'is' ? category.name : category.nameEn
        return {
          value: category.categoryCode,
          label: `${category.categoryCode} - ${name}`,
          disabled: false,
        }
      })

    setCategoryList(mappedCategories)
  }, [externalData, lang])

  // Get the selected categories directly from form state
  const watchedCategories = useWatch({
    control,
    name: `examCategories[${idx}].categories`,
    defaultValue: [],
  }) as Option[]

  useEffect(() => {
    setChosenCategories(watchedCategories)
  }, [watchedCategories])

  useEffect(() => {
    const categories: ExamCategoryType[] = getValues('examCategories')
    if (!categories || !categories[idx].categories) {
      setChosenCategories([])
      return
    }

    setChosenCategories(categories[idx].categories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  const shouldShowUpload = chosenCategories.some((category) =>
    examCategoriesRequireMedicalCertificate.includes(category.value),
  )

  const onSubmit = async () => {
    // Reset Validation error
    setIsInvalidValidation(false)
    setIsWebServiceFailure(false)
    setValidationError('')
    setIsMissingFileUpload(false)
    setValue(`examCategories[${idx}].isValid`, false)

    const instructors: Option[] = getValues(`examCategories[${idx}].instructor`)
    const isUndefinedInstr = instructors.some(
      (instr: Option) => instr === undefined,
    )

    if (isUndefinedInstr || instructors.length < 1) {
      setIsInvalidInput(true)
      return null
    }
    setIsInvalidInput(false)

    const examinees = getValueViaPath<ExamineeType>(answers, 'examinees')
    const medicalCert: ExamCategoryType = getValues(`examCategories[${idx}]`)
    if (!examinees) return null
    if (
      shouldShowUpload &&
      (!medicalCert ||
        !medicalCert.medicalCertificate ||
        !medicalCert.medicalCertificate[0] ||
        !medicalCert.medicalCertificate[0].key ||
        !medicalCert.medicalCertificate[0].name)
    ) {
      setIsMissingFileUpload(true)
      return null
    }

    const { nationalId, email, phone, countryIssuer, licenseNumber } =
      examinees[idx]
    setValue(`examCategories[${idx}].nationalId`, nationalId.nationalId)
    const payload: WorkMachineExamineeInput = {
      nationalId: nationalId.nationalId,
      email: email,
      phoneNumber: phone,
      drivingLicenseNumber: licenseNumber,
      drivingLicenseCountryOfOrigin: countryIssuer,
      examCategories: chosenCategories.map((category) => category.value),
    }

    setIsLoading(true)
    const response = await getExamineeValidationCallback(payload)
    setIsLoading(false)

    if (response && response.getExamineeValidation.isValid) {
      setValue(`examCategories[${idx}].isValid`, true)
      setValue(
        `examCategories[${idx}].doesntHaveToPayLicenseFee`,
        response.getExamineeValidation.doesntHaveToPayLicenseFee,
      )
      let updatedTable: string[][] = []
      // Find if this person (by SSN) already exists in the table
      const existingIndex = tableData.findIndex(
        (row) => row[1] === nationalId.nationalId, // SSN is at index 1
      )

      // Create the new/updated entry (list of strings)
      const updatedEntry: string[] = [
        nationalId.name, // string (name)
        nationalId.nationalId, // string (SSN)
        chosenCategories.map((i) => i.label).join(', '),
      ]

      // Create a new array with either the updated or new entry
      updatedTable = [...tableData]
      if (existingIndex >= 0) {
        updatedTable[existingIndex] = updatedEntry // Update existing
      } else {
        updatedTable.push(updatedEntry) // Add new
      }
      setTable(updatedTable)

      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              examCategoryTable: updatedTable,
            },
          },
          locale: lang,
        },
      })
      onSave()

      return
    }

    if (response) {
      // Case where response is present with isValid == false
      const error =
        lang === 'is'
          ? response.getExamineeValidation.errorMessage
          : response.getExamineeValidation.errorMessageEn
      setValidationError(error || '')
      setIsInvalidValidation(true)
    } else {
      // Case where the is no response, indicating failure in web service
      setIsWebServiceFailure(true)
    }
  }

  const handleSelectOption = (
    value: Array<Option>,
    includedCategories: string[] | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void,
  ) => {
    if (!includedCategories || !Array.isArray(value)) return onChange(value)
    // Category added, requires validation again
    setValue(`examCategories[${idx}].isValid`, false)
    // Disable included categories
    const updatedOptions = categoryList.map((cat) => ({
      ...cat,
      disabled: cat.disabled || includedCategories.includes(cat.value),
    }))
    setCategoryList(updatedOptions)

    // Filter out any category that's now implicitly included
    const filteredValue = value.filter(
      (selected) => !includedCategories.includes(selected.value),
    )
    onChange(filteredValue)
  }

  const handleRemoveValue = (
    value: Array<Option>,
    includedCategories: string[] | null | undefined,
    removedValue: Option,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (...event: any[]) => void,
  ) => {
    onChange(value)
    // Something was removed, Requires validation again
    setValue(`examCategories[${idx}].isValid`, false)

    if (includedCategories && Array.isArray(value)) {
      const updatedOptions = categoryList.map((cat) => ({
        ...cat,
        disabled: cat.disabled
          ? !includedCategories.includes(cat.value)
          : false,
      }))
      setCategoryList(updatedOptions)
    }

    // Remove instructor input for removed category
    const allInstructors = getValues(`examCategories[${idx}].instructor`)
    const removeIndex = chosenCategories.findIndex(
      (cat) => cat.value === removedValue.value,
    )
    if (removeIndex === -1) return

    const updatedInstructors = allInstructors.filter(
      (_: InstructorInformationInput, i: number) => i !== removeIndex,
    )

    const currentlyChosen = chosenCategories.filter(
      (item) => item.value !== removedValue.value,
    )
    if (
      currentlyChosen.every(
        (item) => !examCategoriesRequireMedicalCertificate.includes(item.value),
      )
    ) {
      setValue(`examCategories[${idx}].medicalCertificate`, undefined)
    }

    setValue(`examCategories[${idx}].instructor`, updatedInstructors)
  }

  const handleClear = () => {
    setValue(`examCategories[${idx}].isValid`, false)
    setValue(`examCategories[${idx}].instructor`, [])
    setValue(`examCategories[${idx}].medicalCertificate`, undefined)
    setChosenCategories([])
    setCategoryList((prev) =>
      prev.map((option) => ({
        ...option,
        disabled: false,
      })),
    )
  }

  return (
    <Box paddingTop={2} display={'flex'} flexDirection={'column'} rowGap={2}>
      <Controller
        key={`examCategories[${idx}].categories`}
        name={`examCategories[${idx}].categories`}
        control={control}
        render={({ field: { ref, onChange, ...rest } }) => (
          <Select
            {...rest}
            backgroundColor="blue"
            options={categoryList}
            placeholder={formatMessage(
              examCategories.labels.chooseExamCategory,
            )}
            isMulti
            isSearchable={false}
            label={formatMessage(examCategories.general.pageTitle)}
            onChange={(value: MultiValue<Option>, action) => {
              const chosenCategory =
                action.option?.value || action.removedValue?.value
              const includedCategories = externalExamCategories?.find(
                (cat) => cat.categoryCode === chosenCategory,
              )?.includedExamCategories

              const mutableValue = [...value]
              switch (action.action) {
                case 'select-option':
                  return handleSelectOption(
                    mutableValue,
                    includedCategories,
                    onChange,
                  )
                case 'remove-value':
                  return handleRemoveValue(
                    mutableValue,
                    includedCategories,
                    action.removedValue,
                    onChange,
                  )
                case 'clear':
                  onChange(value)
                  return handleClear()
                default:
                  onChange(value)
              }
            }}
            icon="search"
          />
        )}
      />

      {chosenCategories.map((category, index) => (
        <Controller
          key={`examCategories[${idx}].instructor[${index}]`}
          name={`examCategories[${idx}].instructor[${index}]`}
          control={control}
          render={({ field: { ref, ...rest }, fieldState }) => {
            const filteredInstructor = instructors
              .filter((instructor) => {
                const instructorMayTeach =
                  instructor.categoriesMayTeach?.split(',') || []
                return instructorMayTeach.includes(category.value)
              })
              .map((instructor) => ({
                value: instructor.nationalId.nationalId,
                label: instructor.nationalId.name,
              }))
            return (
              <Select
                {...rest} // onChange, value, name
                label={`${formatMessage(
                  examCategories.labels.examCategoryLabel,
                )} - ${category.value}`}
                options={filteredInstructor}
                errorMessage={fieldState.error?.message}
                isSearchable={false}
                isDisabled={filteredInstructor.length === 0}
                placeholder={formatMessage(
                  examCategories.labels.examCategoryPlaceholder,
                )}
              />
            )
          }}
        />
      ))}
      {isLoading && (
        <Box
          width="full"
          display={'flex'}
          justifyContent={'center'}
          marginY={2}
        >
          <LoadingDots size="large" />
        </Box>
      )}
      <FileUpload
        showFileUpload={shouldShowUpload}
        idx={idx}
        chosenMedicalCategories={chosenMedicalCategories}
        field={field}
        application={application}
      />
      {isInvalidInput && (
        <AlertMessage
          type="warning"
          title={formatMessage(examCategories.labels.inputErrorTitle)}
          message={formatMessage(examCategories.labels.inputErrorMessage)}
        />
      )}
      {isInvalidValidation && (
        <AlertMessage
          type="warning"
          title={formatMessage(examCategories.labels.invalidValidationTitle)}
          message={validationError}
        />
      )}
      {isWebServiceFailure && (
        <AlertMessage
          type="error"
          title={formatMessage(examCategories.labels.webServiceFailureTitle)}
          message={formatMessage(
            examCategories.labels.webServiceFailureMessage,
          )}
        />
      )}
      {isMissingFileUpload && (
        <AlertMessage
          type="warning"
          title={formatMessage(examCategories.labels.missingFileUploadTitle)}
          message={formatMessage(
            examCategories.labels.missingFileUploadMessage,
          )}
        />
      )}
      {showInfo && (
        <AlertMessage
          type="info"
          title={formatMessage(
            examCategories.labels.includedCategoriesAlertInfoTitle,
          )}
          message={formatMessage(
            examCategories.labels.includedCategoriesAlertInfoMessage,
          )}
        />
      )}

      <Box paddingTop={2} display={'flex'} justifyContent={'flexEnd'}>
        <Button onClick={onSubmit} variant="ghost">
          {formatMessage(examCategories.labels.saveButton)}
        </Button>
      </Box>
    </Box>
  )
}
