import { Fragment, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { VisuallyHidden } from 'reakit/VisuallyHidden'
import addYears from 'date-fns/addYears'
import {
  Text,
  Box,
  Divider,
  useBreakpoint,
  Button,
} from '@island.is/island-ui/core'
import {
  CheckboxController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import * as styles from './AccessItem.css'
import format from 'date-fns/format'
import { isDefined } from '@island.is/shared/utils'
import { Scope } from '../access.types'
import { DATE_FORMAT, isApiScopeGroup } from '../access.utils'
import classNames from 'classnames'
import { AuthCustomDelegation } from '../../../types/customDelegation'
import * as commonAccessStyles from '../access.css'

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
  const { md, lg } = useBreakpoint()
  const grantTranslation = formatMessage(m.permission)

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
        const indent = index !== 0
        const isLast = index === apiScopes.length - 1
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
        const fadeDivider = (indent && !isLast) || isGroup

        return (
          <Fragment key={index}>
            <Box
              paddingLeft={indent ? [2, 2, 2, 4] : [0, 0, 0, 2]}
              display="flex"
              alignItems="flexStart"
              className={commonAccessStyles.gridItem}
            >
              <CheckboxController
                id={`${item.model}.name`}
                spacing={0}
                defaultValue={existingScope ? [existingScope.name] : []}
                options={[
                  {
                    label: (
                      <>
                        <VisuallyHidden>
                          {formatMessage(m.accessControlAccess)}
                        </VisuallyHidden>
                        {item.displayName}
                      </>
                    ),
                    value: item.name,
                  },
                ]}
                onSelect={(value) => onSelect(item, value, index)}
              />
            </Box>
            {((!lg && item.description?.trim()) || lg) && (
              <Box
                display="flex"
                flexDirection="column"
                className={classNames(
                  commonAccessStyles.gridItem,
                  styles.rowGap,
                )}
                {...(indent && { paddingLeft: [2, 2, 2, 0] })}
              >
                {lg && item.description?.trim() ? (
                  <VisuallyHidden>{grantTranslation}</VisuallyHidden>
                ) : !lg ? (
                  <Text variant="small" fontWeight="semiBold">
                    {grantTranslation}
                  </Text>
                ) : null}
                <Text fontWeight="light">{item.description}</Text>
              </Box>
            )}
            {!validityPeriod && !isApiScopeGroup(item) && (
              <>
                <Box
                  {...(indent && { paddingLeft: [2, 2, 2, 0] })}
                  className={classNames(
                    showDatePicker
                      ? [commonAccessStyles.gridItem, styles.dateContainer]
                      : styles.hidden,
                  )}
                >
                  <DatePickerController
                    id={`${item.model}.validTo`}
                    size="sm"
                    label={formatMessage(m.validTo)}
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
                {((!showDatePicker && isSelected) ||
                  (!md && isSelected && !showDatePicker)) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    columnGap={3}
                    {...(indent && { paddingLeft: [2, 2, 2, 0] })}
                    className={classNames(
                      commonAccessStyles.gridItem,
                      styles.dateContainer,
                      styles.rowGap,
                    )}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      className={styles.rowGap}
                    >
                      {!md && (
                        <Text variant="small" fontWeight="semiBold">
                          {formatMessage(m.validTo)}
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
              </>
            )}
            <div className={commonAccessStyles.divider}>
              <Divider {...(fadeDivider && { weight: 'faded' })} />
            </div>
          </Fragment>
        )
      })}
    </>
  )
}
