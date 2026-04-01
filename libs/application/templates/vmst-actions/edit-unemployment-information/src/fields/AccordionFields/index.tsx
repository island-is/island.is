import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  YES,
  NO,
  coreMessages,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { BankAccountFormField } from '@island.is/application/ui-fields'
import {
  InputController,
  SelectController,
  CheckboxController,
  RadioController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { application as applicationMessages } from '../../lib/messages'
import { getSortedJobCodes } from '../../utils/getJobCodeOptions'
import {
  getDegreeOptions,
  getCourseOfStudy,
  getLevelsOfStudyOptions,
  getYearOptions,
} from '../../utils/educationInformation'
import {
  getOtherAddressDefault,
  getOtherPostcodeDefault,
  getPasswordDefault,
  getBankAccountDefault,
  getDefaultJobWishes,
  getDefaultEducation,
  getDefaultDrivingLicenses,
  getDefaultLanguages,
  getDefaultEures,
} from '../../utils/defaultValues'
import {
  getPostcodeOptions,
  getDrivingLicenseOptions,
  getHeavyMachineryOptions,
  getLanguageOptions,
  getLanguageAbilityOptions,
} from '../../utils/selectOptions'
import { BankAccountInAnswers } from '../..'
import {
  GaldurDomainModelsSettingsBanksBankDTO,
  GaldurDomainModelsSettingsLedgersLedgerDTO,
} from '@island.is/clients/vmst-unemployment'
import { MessageDescriptor } from 'react-intl'

export const AccordionFields: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setBeforeSubmitCallback } = props
  const { getValues, setValue, watch } = useFormContext()
  const { formatMessage, locale } = useLocale()
  const [invalidError, setInvalidError] = useState<boolean>()
  const [errors, setErrors] = useState<Array<MessageDescriptor | string>>([])

  setBeforeSubmitCallback?.(async () => {
    setInvalidError(false)

    const bankOptions =
      getValueViaPath<Array<GaldurDomainModelsSettingsBanksBankDTO>>(
        externalData,
        'currentApplicationInformation.data.supportData.banks',
        [],
      ) || []

    const ledgerOptions =
      getValueViaPath<Array<GaldurDomainModelsSettingsLedgersLedgerDTO>>(
        externalData,
        'currentApplicationInformation.data.supportData.ledgers',
        [],
      ) || []

    const accountInformation: BankAccountInAnswers | undefined =
      getValues('bankAccount')
    const bankNumberValidity = /^\d{4}$/.test(
      accountInformation?.bankNumber || '',
    )
    const ledgerValidity = /^\d{2}$/.test(accountInformation?.ledger || '')
    const accountNumberValidity = /^\d{4,6}$/.test(
      accountInformation?.accountNumber || '',
    )

    if (!accountNumberValidity) {
      setErrors((prev) => [
        ...prev,
        applicationMessages.accountNumberValidationError,
      ])
    }

    // Set the errors, this will set a general error if the format is wrong, or a specific error if the bank or ledger number is not in the support data
    if (!bankNumberValidity || !ledgerValidity || !accountNumberValidity) {
      setInvalidError(true)
      return [false, '']
    }

    const ledgerSupportData =
      ledgerOptions?.find((val) => val.number === accountInformation?.ledger) ||
      undefined
    const bankNumberSupportData =
      bankOptions?.find(
        (val) => val.bankNo === accountInformation?.bankNumber,
      ) || undefined

    if (!ledgerSupportData) {
      setErrors((prev) => [...prev, applicationMessages.ledgerValidationError])
    }
    if (!bankNumberSupportData) {
      setErrors((prev) => [...prev, applicationMessages.bankValidationError])
    }

    if (!ledgerSupportData || !bankNumberSupportData) {
      return [false, '']
    }

    return [true, null]
  })

  const { externalData } = application

  // --- Defaults from external data ---
  const otherAddressDefault = useMemo(
    () => getOtherAddressDefault(externalData),
    [externalData],
  )
  const otherPostcodeDefault = useMemo(
    () => getOtherPostcodeDefault(externalData),
    [externalData],
  )
  const passwordDefault = useMemo(
    () => getPasswordDefault(externalData),
    [externalData],
  )
  const bankAccountDefault = useMemo(
    () => getBankAccountDefault(externalData),
    [externalData],
  )
  const defaultJobWishes = useMemo(
    () => getDefaultJobWishes(externalData),
    [externalData],
  )
  const defaultEducation = useMemo(
    () => getDefaultEducation(externalData),
    [externalData],
  )
  const defaultDrivingLicenses = useMemo(
    () => getDefaultDrivingLicenses(externalData),
    [externalData],
  )
  const defaultLanguages = useMemo(
    () => getDefaultLanguages(externalData),
    [externalData],
  )
  const defaultEures = useMemo(
    () => getDefaultEures(externalData),
    [externalData],
  )

  // --- Select options from support data ---
  const postcodeOptions = useMemo(
    () => getPostcodeOptions(externalData),
    [externalData],
  )
  const jobCodeOptions = useMemo(() => {
    const sorted = getSortedJobCodes(externalData, locale as Locale)
    return sorted.map((job) => ({
      value: job.id ?? '',
      label: (locale === 'is' ? job.name : job.english ?? job.name) || '',
    }))
  }, [externalData, locale])
  const drivingLicenseOptions = useMemo(
    () => getDrivingLicenseOptions(externalData),
    [externalData],
  )
  const heavyMachineryOptions = useMemo(
    () => getHeavyMachineryOptions(externalData, locale as Locale),
    [externalData, locale],
  )
  const languageOptions = useMemo(
    () => getLanguageOptions(externalData, locale as Locale),
    [externalData, locale],
  )
  const languageAbilityOptions = useMemo(
    () => getLanguageAbilityOptions(externalData, locale as Locale),
    [externalData, locale],
  )
  const levelOfStudyOptions = useMemo(
    () => getLevelsOfStudyOptions(application, (locale ?? 'is') as Locale),
    [application, locale],
  )

  // --- Seed form with defaults on mount ---
  useEffect(() => {
    const currentEdu = getValues('educationHistory')
    if (
      (!currentEdu || currentEdu.length === 0) &&
      defaultEducation.length > 0
    ) {
      setValue('educationHistory', defaultEducation)
    }
  }, [defaultEducation, getValues, setValue])

  useEffect(() => {
    const currentLang = getValues('languageSkills')
    if (
      (!currentLang || currentLang.length === 0) &&
      defaultLanguages.length > 0
    ) {
      setValue('languageSkills', defaultLanguages)
    }
  }, [defaultLanguages, getValues, setValue])

  // --- Repeater state ---
  const educationRows: Array<Record<string, string> & { readOnly?: boolean }> =
    watch('educationHistory') ?? []
  const languageRows: Array<Record<string, string> & { readOnly?: boolean }> =
    watch('languageSkills') ?? []
  const hasDrivingLicense: string[] = watch('licenses.hasDrivingLicense') ?? []
  const hasHeavyMachineryLicense: string[] =
    watch('licenses.hasHeavyMachineryLicense') ?? []

  const editableEducationCount = educationRows.filter((r) => !r.readOnly).length
  const editableLanguageCount = languageRows.filter((r) => !r.readOnly).length
  const addRow = (field: string) => {
    const current = getValues(field) ?? []
    setValue(field, [...current, {}])
  }
  const removeRow = (field: string, index: number) => {
    const current: Array<Record<string, string>> = getValues(field) ?? []
    setValue(
      field,
      current.filter((_, i) => i !== index),
    )
  }

  return (
    <Box marginTop={3}>
      <Accordion singleExpand={false}>
        {/* ========== 1. Address ========== */}
        <AccordionItem
          key="addressInformation"
          id="addressInformation"
          label={formatMessage(applicationMessages.addressTitle)}
        >
          <Text marginBottom={2}>
            {formatMessage(applicationMessages.addressDescription)}
          </Text>
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={2}>
              <InputController
                id="otherAddress.otherAddress"
                name="otherAddress"
                label={formatMessage(applicationMessages.addressLabel)}
                backgroundColor="blue"
                defaultValue={otherAddressDefault}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={2}>
              <SelectController
                id="otherAddress.otherPostcode"
                name="otherPostcode"
                label={formatMessage(applicationMessages.postCodeLabel)}
                options={postcodeOptions}
                backgroundColor="blue"
                defaultValue={otherPostcodeDefault}
              />
            </GridColumn>
          </GridRow>
        </AccordionItem>

        {/* ========== 2. Password ========== */}
        <AccordionItem
          key="passwordInformation"
          id="passwordInformation"
          label={formatMessage(applicationMessages.passwordTitle)}
        >
          <Text marginBottom={2}>
            {formatMessage(applicationMessages.passwordDescription)}
          </Text>
          <InputController
            id="password"
            name="password"
            label={formatMessage(applicationMessages.passwordLabel)}
            defaultValue={passwordDefault}
            maxLength={10}
            backgroundColor="blue"
          />
        </AccordionItem>

        {/* ========== 3. Bank Account ========== */}
        <AccordionItem
          key="bankAccount"
          id="bankAccount"
          label={formatMessage(applicationMessages.accountTitle)}
        >
          <BankAccountFormField
            application={application}
            field={{
              id: 'bankAccount',
              title: applicationMessages.accountTitle,
              defaultValue: () => bankAccountDefault,
              type: FieldTypes.BANK_ACCOUNT,
              component: FieldComponents.BANK_ACCOUNT,
              children: undefined,
            }}
          />
        </AccordionItem>

        {/* ========== 4. Job Wishes ========== */}
        <AccordionItem
          key="jobWishes"
          id="jobWishes"
          label={formatMessage(applicationMessages.jobWishesTitle)}
        >
          <Text marginBottom={2}>
            {formatMessage(applicationMessages.jobWishesDescription)}
          </Text>
          <SelectController
            id="jobWishes"
            name="jobWishes"
            label={formatMessage(applicationMessages.jobWishesLabel)}
            options={jobCodeOptions}
            defaultValue={defaultJobWishes as unknown as string}
            isMulti
            backgroundColor="blue"
          />
        </AccordionItem>

        {/* ========== 5. Education ========== */}
        <AccordionItem
          key="educationHistory"
          id="educationHistory"
          label={formatMessage(applicationMessages.educationTitle)}
        >
          <Text marginBottom={2}>
            {formatMessage(applicationMessages.educationDescription)}
          </Text>

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
                  {formatMessage(applicationMessages.educationTitle)}{' '}
                  {index + 1}
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
                        label={formatMessage(
                          applicationMessages.educationEndLabel,
                        )}
                        value={yearLabel}
                        readOnly
                      />
                    ) : (
                      <SelectController
                        id={`${prefix}.endDate`}
                        name={`${prefix}.endDate`}
                        label={formatMessage(
                          applicationMessages.educationEndLabel,
                        )}
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
                onClick={() =>
                  removeRow('educationHistory', educationRows.length - 1)
                }
              >
                {formatMessage(coreMessages.buttonRemove)}
              </Button>
            )}
            <Button
              variant="ghost"
              size="small"
              onClick={() => addRow('educationHistory')}
            >
              {formatMessage(applicationMessages.addNewEducation)}
            </Button>
          </Box>
        </AccordionItem>

        {/* ========== 7. Driving & Machinery Licenses ========== */}
        <AccordionItem
          key="licenses"
          id="licenses"
          label={formatMessage(applicationMessages.driversLicenseTitle)}
        >
          <Box marginBottom={2}>
            <CheckboxController
              id="licenses.hasDrivingLicense"
              name="licenses.hasDrivingLicense"
              options={[
                {
                  value: YES,
                  label: formatMessage(
                    applicationMessages.driversLicenseCheckbox,
                  ),
                },
              ]}
            />
          </Box>

          {hasDrivingLicense.includes(YES) && (
            <Box marginBottom={2}>
              <Text variant="h5" marginBottom={1}>
                {formatMessage(applicationMessages.driversLicenseDescription)}
              </Text>
              <CheckboxController
                id="licenses.drivingLicenseTypes"
                name="licenses.drivingLicenseTypes"
                options={drivingLicenseOptions}
                large={true}
                defaultValue={defaultDrivingLicenses}
                backgroundColor="blue"
              />
            </Box>
          )}

          <Box marginBottom={2}>
            <CheckboxController
              id="licenses.hasHeavyMachineryLicense"
              name="licenses.hasHeavyMachineryLicense"
              options={[
                {
                  value: YES,
                  label: formatMessage(applicationMessages.workMachineCheckbox),
                },
              ]}
            />
          </Box>

          {hasHeavyMachineryLicense.includes(YES) && (
            <SelectController
              id="licenses.heavyMachineryLicensesTypes"
              name="licenses.heavyMachineryLicensesTypes"
              label={formatMessage(applicationMessages.workMachineTitle)}
              options={heavyMachineryOptions}
              isMulti
              backgroundColor="blue"
            />
          )}
        </AccordionItem>

        {/* ========== 8. Languages ========== */}
        <AccordionItem
          key="languageSkills"
          id="languageSkills"
          label={formatMessage(applicationMessages.languageTitle)}
        >
          {languageRows.map((row, index) => {
            const isReadOnly = !!row.readOnly
            const prefix = `languageSkills[${index}]`

            const languageLabel =
              languageOptions.find((o) => o.value === row.language)?.label ?? ''
            const skillLabel =
              languageAbilityOptions.find((o) => o.value === row.skill)
                ?.label ?? ''

            return (
              <Box key={`lang-${index}`} marginBottom={3}>
                <Text variant="h5" marginBottom={1}>
                  {formatMessage(applicationMessages.languageTitle)} {index + 1}
                </Text>
                <GridRow>
                  <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={1}>
                    {isReadOnly ? (
                      <Input
                        name={`${prefix}.language`}
                        label={formatMessage(
                          applicationMessages.languageNameLabel,
                        )}
                        value={languageLabel}
                        readOnly
                      />
                    ) : (
                      <SelectController
                        id={`${prefix}.language`}
                        name={`${prefix}.language`}
                        label={formatMessage(
                          applicationMessages.languageNameLabel,
                        )}
                        options={languageOptions}
                        backgroundColor="blue"
                      />
                    )}
                  </GridColumn>
                  <GridColumn span={['1/1', '1/1', '1/2']} paddingBottom={1}>
                    {isReadOnly ? (
                      <Input
                        name={`${prefix}.skill`}
                        label={formatMessage(
                          applicationMessages.languageAbilityLabel,
                        )}
                        value={skillLabel}
                        readOnly
                      />
                    ) : (
                      <SelectController
                        id={`${prefix}.skill`}
                        name={`${prefix}.skill`}
                        label={formatMessage(
                          applicationMessages.languageAbilityLabel,
                        )}
                        options={languageAbilityOptions}
                        backgroundColor="blue"
                      />
                    )}
                  </GridColumn>
                </GridRow>
              </Box>
            )
          })}
          <Box display="flex" justifyContent="flexEnd" columnGap={1}>
            {editableLanguageCount > 0 && (
              <Button
                variant="ghost"
                colorScheme="destructive"
                size="small"
                onClick={() =>
                  removeRow('languageSkills', languageRows.length - 1)
                }
              >
                {formatMessage(coreMessages.buttonRemove)}
              </Button>
            )}
            <Button
              variant="ghost"
              size="small"
              onClick={() => addRow('languageSkills')}
            >
              {formatMessage(applicationMessages.addLanguageLabel)}
            </Button>
          </Box>
        </AccordionItem>

        {/* ========== 9. EURES ========== */}
        <AccordionItem
          key="euresAgreement"
          id="euresAgreement"
          label={formatMessage(applicationMessages.euresTitle)}
        >
          <Text marginBottom={2}>
            {formatMessage(applicationMessages.euresDescription)}
          </Text>
          <Box marginBottom={3}>
            <RadioController
              id="euresAgreement"
              name="euresAgreement"
              defaultValue={defaultEures}
              split="1/2"
              options={[
                { value: YES, label: formatMessage(coreMessages.radioYes) },
                { value: NO, label: formatMessage(coreMessages.radioNo) },
              ]}
            />
          </Box>
          <AlertMessage
            type="info"
            message={formatMessage(applicationMessages.euresInfoBox)}
          />
        </AccordionItem>
      </Accordion>
      <Box marginTop={3}>
        {invalidError && (
          <AlertMessage
            title={formatMessage(
              applicationMessages.bankAccountValidationErrorTitle,
            )}
            message={formatMessage(
              applicationMessages.bankAccountValidationErrorTitle,
            )}
            type="warning"
          />
        )}
        {errors &&
          errors.length > 0 &&
          errors.map((val, index) => (
            <Box key={index} marginBottom={2}>
              <AlertMessage
                title={formatMessage(
                  applicationMessages.bankAccountValidationErrorTitle,
                )}
                message={formatMessage(val)}
                type="warning"
              />
            </Box>
          ))}
      </Box>
    </Box>
  )
}
