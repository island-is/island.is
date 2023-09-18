import { FC, useState, useEffect } from 'react'
import {
  FieldErrors,
  FieldValues,
  useFormContext,
  Controller,
} from 'react-hook-form'
import {
  extractRepeaterIndexFromField,
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Box,
  AlertMessage,
  Checkbox,
  GridRow,
  GridColumn,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../lib/messages'
import {
  InputController,
  DatePickerController,
  CheckboxController,
} from '@island.is/shared/form-fields'
import {
  FieldBaseProps,
  FieldTypes,
  FieldComponents,
  Application,
  Option,
  RecordObject,
} from '@island.is/application/types'

import { IdentityInput, Query } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { TextFormField } from '@island.is/application/ui-fields'
import { IDENTITY_QUERY } from '../../graphql/queries'
import subYears from 'date-fns/subYears'
import startOfYear from 'date-fns/startOfYear'
import * as kennitala from 'kennitala'
import { getChildPensionReasonOptions } from '../../lib/childPensionUtils'
import { ChildPensionReason as ChildPensionReasonEnum } from '../../lib/constants'

interface ParentIsDead {
  application: Application
  option?: Option
  repeaterIndex?: number
  errors?: RecordObject
}

const ParentIsDead: FC<React.PropsWithChildren<ParentIsDead>> = ({
  // error,
  // field,
  // application,
  // errors,
  application,
  option,
  repeaterIndex,
  errors,
}) => {
  // const { id } = field
  const { setValue } = useFormContext()
  const { formatMessage, lang } = useLocale()

  // const [repeaterIndex, setRepeaterIndex] = useState<number>(-1)
  const [parentDoesNotHaveNationalId, setParentDoesNotHaveNationalId] =
    useState(false)

  // TODO: Breyta í Array (byrja á að athuga hvort ehv er til, ef ekki þá er index=0 annars er index=1)
  const parentIsDeadNameFieldId = `registerChildRepeater[${repeaterIndex}].parentIsDead.name`
  const parentIsDeadDoesNotHaveNationalIdFieldId = `registerChildRepeater[${repeaterIndex}].parentIsDead.parentDoesNotHaveNationalIdFieldId`
  const parentIsDeadNationalIdOrBirthDateFieldId = `registerChildRepeater[${repeaterIndex}].parentIsDead.nationalIdOrBirthDateFieldId`

  console.log('=======> (ParentIsDead) errors: ', errors)
  console.log('=======> (ParentIsDead) repeaterIndex: ', repeaterIndex)
  console.log(
    '=======> (ParentIsDead) parentIsDeadNameFieldId: ',
    parentIsDeadNameFieldId,
  )
  console.log(
    '=======> (ParentIsDead) parentIsDeadDoesNotHaveNationalIdFieldId: ',
    parentIsDeadDoesNotHaveNationalIdFieldId,
  )
  console.log(
    '=======> (ParentIsDead) parentIsDeadNationalIdOrBirthDateFieldId: ',
    parentIsDeadNationalIdOrBirthDateFieldId,
  )

  // console.log('=======> (Reason) error: ', error)
  // console.log('=======> (Reason) id: ', id)

  // const defaultValue = getValueViaPath(
  //   application.answers,
  //   id as string,
  //   false,
  // ) as boolean

  const parentIsDeadNameError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    parentIsDeadNameFieldId,
  )

  const parentIsDeadNationalIdOrBirthDateError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    parentIsDeadNationalIdOrBirthDateFieldId,
  )

  console.log(
    '=======> (ParentIsDead) parentIsDeadNameError: ',
    parentIsDeadNameError,
  )
  console.log(
    '=======> (ParentIsDead) parentIsDeadNationalIdOrBirthDateError: ',
    parentIsDeadNationalIdOrBirthDateError,
  )

  // TODO: Athuga hvort þetta er rétt tímabil
  const finalMinDate = startOfYear(subYears(new Date(), 17))
  const finalMaxDate = new Date()


  return (
    <GridColumn
      span="1/1"
      paddingBottom={2}
    >
      <Box
        marginBottom={5}
        padding={3}
        borderRadius="large"
        borderColor="blue200"
        border="standard"
      >
        <Text variant="h4" as="h3" marginBottom={1}>
          {formatText(
            childPensionFormMessage.info.childPensionReasonParentIsDeadTitle,
            application,
            formatMessage,
          )}
        </Text>
        <Box marginTop={2}>
          <Controller
            name={parentIsDeadDoesNotHaveNationalIdFieldId}
            // defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => {
              return (
                <Box>
                  <Checkbox
                    id={parentIsDeadDoesNotHaveNationalIdFieldId}
                    name={parentIsDeadDoesNotHaveNationalIdFieldId}
                    label={formatText(
                      childPensionFormMessage.info
                        .childPensionParentDoesNotHaveNationalId,
                      application,
                      formatMessage,
                    )}
                    // hasError={!!error}
                    checked={value}
                    onChange={(e) => {
                      onChange(e.target.checked)
                      setValue(
                        parentIsDeadDoesNotHaveNationalIdFieldId,
                        e.target.checked,
                      )

                      setParentDoesNotHaveNationalId(e.target.checked)
                      setValue(
                        parentIsDeadNationalIdOrBirthDateFieldId,
                        undefined,
                      )
                      // setHasError(undefined)
                      setValue(parentIsDeadNameFieldId, '')
                      // setIdentityFound(true)
                    }}
                  />
                </Box>
              )
            }}
          />
        </Box>

        <GridRow marginTop={2}>
          {parentDoesNotHaveNationalId ? (
            <>
              <GridColumn span="1/2">
                <DatePickerController
                  id={parentIsDeadNationalIdOrBirthDateFieldId}
                  locale={lang}
                  minDate={finalMinDate}
                  maxDate={finalMaxDate}
                  backgroundColor="blue"
                  label={formatText(
                    childPensionFormMessage.info.registerChildBirthDate,
                    application,
                    formatMessage,
                  )}
                  placeholder={formatText(
                    childPensionFormMessage.info
                      .registerChildBirthDatePlaceholder,
                    application,
                    formatMessage,
                  )}
                  // error={hasError}
                  error={parentIsDeadNationalIdOrBirthDateError}
                  onChange={(d) => {
                    setValue(
                      parentIsDeadNationalIdOrBirthDateFieldId as string,
                      d,
                    )
                  }}
                />
              </GridColumn>
              <GridColumn span="1/2">
                <InputController
                  id={parentIsDeadNameFieldId}
                  label={formatText(
                    childPensionFormMessage.info.registerChildFullName,
                    application,
                    formatMessage,
                  )}
                  error={parentIsDeadNameError}
                  onChange={(e) => {
                    setValue(parentIsDeadNameFieldId as string, e.target.value)
                  }}
                  backgroundColor="blue"
                />
              </GridColumn>
            </>
          ) : (
            <>
              <GridColumn span="1/2">
                <InputController
                  id={parentIsDeadNationalIdOrBirthDateFieldId}
                  placeholder="000000-0000"
                  label={formatText(
                    childPensionFormMessage.info.registerChildNationalId,
                    application,
                    formatMessage,
                  )}
                  // error={hasError}
                  error={parentIsDeadNationalIdOrBirthDateError}
                  onChange={(e) => {
                    setValue(
                      parentIsDeadNationalIdOrBirthDateFieldId as string,
                      e.target.value,
                    )
                  }}
                  format="######-####"
                  backgroundColor="blue"
                  // loading={queryLoading}
                />
              </GridColumn>
              <GridColumn span="1/2">
                <InputController
                  id={parentIsDeadNameFieldId}
                  label={formatText(
                    childPensionFormMessage.info.registerChildFullName,
                    application,
                    formatMessage,
                  )}
                  error={parentIsDeadNameError}
                  onChange={(e) => {
                    setValue(parentIsDeadNameFieldId as string, e.target.value)
                  }}
                  backgroundColor="blue"
                  disabled={true}
                />
                {/* <TextFormField
                                    application={application}
                                    showFieldName
                                    field={{
                                      type: FieldTypes.TEXT,
                                      title:
                                        childPensionFormMessage.info
                                          .registerChildFullName,
                                      id: parentIsDeadNameFieldId,
                                      children: undefined,
                                      component: FieldComponents.TEXT,
                                      disabled: true,
                                    }}
                                  /> */}
              </GridColumn>
            </>
          )}
        </GridRow>
        {/* {field.props.tag && (
                            <Box marginTop={1}>
                              <Tag disabled>
                                {field.props.tag(application) === ''
                                  ? formatMessage(m.selectOptionNobody)
                                  : field.props.tag(application)}
                              </Tag>
                            </Box>
                          )} */}
      </Box>
    </GridColumn>
  )
}

export default ParentIsDead
