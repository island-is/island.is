import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import addYears from 'date-fns/addYears'
import {
  Text,
  Box,
  GridRow,
  GridColumn,
  Divider,
  useBreakpoint,
  Button,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  CheckboxController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import * as styles from './AccessItem.css'
import format from 'date-fns/format'
import { Scope } from './access.types'
import classNames from 'classnames'
import { isDefined } from '@island.is/shared/utils'
import { isApiScopeGroup } from './access.utils'

export const DATE_FORMAT = 'dd.MM.yyyy'

const messages = {
  dateValidTo: {
    id: 'sp.settings-access-control:access-item-datepicker-label-mobile',
    defaultMessage: 'Í gildi til',
  },
}

const getDefaultDate = () => addYears(new Date(), 1)

interface PropTypes {
  apiScopes: Scope[]
  authDelegation: AuthCustomDelegation
  validityPeriod: Date | null
}

export const AccessItem = ({
  apiScopes,
  authDelegation,
  validityPeriod,
}: PropTypes) => {
  const { lang, formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const { md } = useBreakpoint()
  const [datePickerVisibleGroup, setDatePickerVisibleGroup] = useState<
    boolean[]
  >(apiScopes.map(() => false))

  const toggleCheckboxGroup = useCallback(() => {
    const values = apiScopes
      .filter((apiScope) => !isApiScopeGroup(apiScope))
      .map((apiScope) => getValues(`${apiScope.model}.name`))

    setValue(
      `${apiScopes[0].model}.name`,
      values.every((value) => value?.length > 0) ? [apiScopes[0].name] : [],
    )
  }, [apiScopes, getValues, setValue])

  const toggleDatePickerGroup = useCallback(() => {
    apiScopes.forEach((apiScope) => {
      if (getValues(`${apiScope.model}.validTo`) || isApiScopeGroup(apiScope)) {
        return
      }

      setValue(`${apiScope.model}.validTo`, getDefaultDate().toISOString())
    })
  }, [apiScopes, getValues, setValue])

  const onSelect = (item: Scope, value: string[], index: number) => {
    if (isApiScopeGroup(item)) {
      apiScopes.forEach((apiScope) => {
        setValue(
          `${apiScope.model}.name`,
          value.length > 0 ? [apiScope.name] : [],
        )

        if (value.length === 0) {
          setValue(`${apiScope.model}.validTo`, undefined)
        }
      })
    }

    toggleCheckboxGroup()
    toggleDatePickerGroup()

    if (value.length === 0) {
      setDatePickerVisibleGroup((prevState) => {
        const newState = [...prevState]
        newState[index] = false
        return newState
      })
    }
  }

  const onChange = (item: Scope, value: string, index: number) => {
    if (isApiScopeGroup(item)) {
      apiScopes.forEach((apiScope) => {
        setValue(`${apiScope.model}.validTo`, value)
      })
    } else {
      toggleDatePickerGroup()
    }

    onEditDateHandler(index)
  }

  /**
   * Toggles date picker visibility
   */
  const onEditDateHandler = (index: number) => {
    setDatePickerVisibleGroup((prevState) => {
      const newState = [...prevState]
      newState[index] = !prevState[index]
      return newState
    })
  }

  return (
    <>
      {apiScopes.map((item, index) => {
        const isFirstItem = index === 0
        const defaultDate = getDefaultDate()
        const isGroup = isApiScopeGroup(item)

        const existingScope = isGroup
          ? apiScopes
              .filter((scope) => !isApiScopeGroup(scope))
              .every((scope) =>
                authDelegation.scopes
                  .map((scope) => scope.name)
                  .includes(scope.name),
              )
            ? { ...item, validTo: undefined }
            : undefined
          : authDelegation.scopes.find((scope) => scope.name === item.name)

        const checkboxValue = getValues(`${item.model}.name`)
        const dateValue = getValues(`${item.model}.validTo`)

        // Either use the existing date value or newly modified date value
        const formattedDate =
          dateValue || existingScope?.validTo
            ? format(new Date(dateValue ?? existingScope?.validTo), DATE_FORMAT)
            : format(defaultDate, DATE_FORMAT)

        const isSelected = !isDefined(checkboxValue)
          ? Boolean(existingScope?.name)
          : checkboxValue.length > 0

        // This scope has not been set yet
        const hasExisting = isDefined(existingScope)
        // Current state value for if the date picker is visible or not
        const stateDateIsActive = datePickerVisibleGroup[index]
        const showDatePicker =
          (isSelected && stateDateIsActive) || (!hasExisting && isSelected)

        return (
          <div key={index}>
            <GridRow className={styles.row}>
              <GridColumn
                span={['12/12', '12/12', '3/12']}
                className={styles.item}
              >
                <Box
                  paddingLeft={isFirstItem ? 0 : [2, 2, 4]}
                  display="flex"
                  alignItems="flexStart"
                >
                  <CheckboxController
                    id={`${item.model}.name`}
                    spacing={0}
                    labelVariant={isFirstItem ? 'default' : 'medium'}
                    defaultValue={existingScope ? [existingScope.name] : []}
                    options={[
                      {
                        label: item.displayName,
                        value: item.name,
                      },
                    ]}
                    onSelect={(value) => onSelect(item, value, index)}
                  />
                </Box>
              </GridColumn>
              {((!md && item.description?.trim()) || md) && (
                <GridColumn
                  span={['12/12', '12/12', '4/12', '5/12']}
                  className={styles.item}
                  paddingTop={[3, 3, 3, 0]}
                >
                  <Box
                    paddingLeft={isFirstItem ? 0 : [2, 2, 0]}
                    display="flex"
                    flexDirection="column"
                    className={styles.rowGap}
                  >
                    {!md && (
                      <Text variant="small" fontWeight="semiBold">
                        {formatMessage({
                          id: 'sp.access-control-delegations:grant',
                          defaultMessage: 'Heimild',
                        })}
                      </Text>
                    )}
                    <Text
                      variant={isFirstItem ? 'default' : 'medium'}
                      fontWeight="light"
                    >
                      {item.description}
                    </Text>
                  </Box>
                </GridColumn>
              )}
              {!validityPeriod && !isApiScopeGroup(item) && (
                <GridColumn
                  span={['12/12', '8/12', '5/12', '4/12']}
                  paddingTop={[2, 2, 2, 0]}
                >
                  <div
                    className={classNames({
                      [styles.hidden]: !showDatePicker,
                    })}
                  >
                    <Box paddingLeft={isFirstItem ? 0 : [2, 2, 0]}>
                      <DatePickerController
                        id={`${item.model}.validTo`}
                        size="sm"
                        label={
                          !md
                            ? formatMessage(messages.dateValidTo)
                            : formatMessage({
                                id:
                                  'sp.settings-access-control:access-item-datepicker-label',
                                defaultMessage: 'Dagsetning til',
                              })
                        }
                        backgroundColor="blue"
                        minDate={new Date()}
                        defaultValue={
                          validityPeriod
                            ? validityPeriod
                            : existingScope?.name && existingScope?.validTo
                            ? existingScope.validTo
                            : format(defaultDate, 'yyyy-MM-dd')
                        }
                        locale={lang}
                        placeholder={undefined}
                        onChange={(value) => onChange(item, value, index)}
                        required
                      />
                    </Box>
                  </div>
                  {((!showDatePicker && isSelected) ||
                    (!md && isSelected && !showDatePicker)) && (
                    <Box
                      display="flex"
                      alignItems="center"
                      columnGap={3}
                      className={styles.rowGap}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        className={styles.rowGap}
                      >
                        {!md && (
                          <Text variant="small" fontWeight="semiBold">
                            {formatMessage(messages.dateValidTo)}
                          </Text>
                        )}
                        <Box display="flex" className={styles.rowGap}>
                          <Text variant={md ? 'medium' : 'small'}>
                            {formattedDate}
                          </Text>
                        </Box>
                      </Box>
                      <Button
                        colorScheme="light"
                        circle
                        size="small"
                        icon="pencil"
                        onClick={() => onEditDateHandler(index)}
                      />
                    </Box>
                  )}
                </GridColumn>
              )}
            </GridRow>
            <Box
              paddingLeft={isFirstItem ? 0 : [3, 3, 0]}
              className={styles.dividerContainer}
            >
              <Divider />
            </Box>
          </div>
        )
      })}
    </>
  )
}
