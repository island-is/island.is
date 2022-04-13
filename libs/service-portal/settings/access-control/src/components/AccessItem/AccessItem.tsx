import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import cs from 'classnames'

import {
  Text,
  Box,
  GridRow,
  GridColumn,
  Divider,
} from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  CheckboxController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from './AccessItem.css'
import add from 'date-fns/add'
import format from 'date-fns/format'
import { Scope } from '../../utils/types'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface PropTypes {
  apiScopes: Scope[]
  authDelegation: AuthCustomDelegation
}

function AccessItem({ apiScopes, authDelegation }: PropTypes) {
  useNamespaces('sp.settings-access-control')
  const { lang, formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const isApiScopeGroup = (item: Scope): boolean =>
    item.__typename === 'AuthApiScopeGroup'

  const toggleCheckboxGroup = () => {
    const values = apiScopes
      .filter((apiScope) => !isApiScopeGroup(apiScope))
      .map((apiScope) => getValues(`${apiScope.model}.name`))
    setValue(
      `${apiScopes[0].model}.name`,
      values.every((value) => value?.length > 0) ? [apiScopes[0].name] : [],
    )
  }

  const toggleDatePickerGroup = () => {
    const values = apiScopes
      .filter((apiScope) => !isApiScopeGroup(apiScope))
      .map((apiScope) => getValues(`${apiScope.model}.validTo`))
    setValue(
      `${apiScopes[0].model}.validTo`,
      values.every((value) => value === values[0]) ? values[0] : undefined,
    )
  }

  useEffect(() => {
    toggleCheckboxGroup()
    toggleDatePickerGroup()
  }, [toggleCheckboxGroup, toggleDatePickerGroup])

  const onSelect = (item: Scope, value: string[]) => {
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
    } else {
      toggleCheckboxGroup()
      if (value.length === 0) {
        setValue(`${item.model}.validTo`, undefined)
      }
    }
  }

  const onChange = (item: Scope, value: string) => {
    if (isApiScopeGroup(item)) {
      apiScopes.forEach((apiScope) => {
        setValue(`${apiScope.model}.validTo`, value)
      })
    } else {
      toggleDatePickerGroup()
    }
  }

  return (
    <>
      {apiScopes.map((item, index) => {
        const isLastItem = index === apiScopes.length - 1
        const isFirstItem = index === 0

        const existingScope = isApiScopeGroup(item)
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

        const isSelected =
          checkboxValue === undefined
            ? Boolean(existingScope?.name)
            : checkboxValue.length > 0
        const defaultDate = add(new Date(), { months: 3 })

        return (
          <>
            <GridRow key={index}>
              <GridColumn
                span={['12/12', '12/12', '3/12']}
                className={styles.item}
              >
                <Box
                  paddingBottom={2}
                  paddingTop={isFirstItem ? 3 : 2}
                  paddingLeft={isFirstItem ? 0 : [2, 2, 4]}
                  display="flex"
                  alignItems="center"
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
                    onSelect={(value) => onSelect(item, value)}
                  />
                </Box>
              </GridColumn>
              <GridColumn
                span={['12/12', '12/12', '4/12', '5/12']}
                className={styles.item}
              >
                <Box
                  paddingBottom={2}
                  paddingTop={isFirstItem ? 3 : 2}
                  paddingLeft={isFirstItem ? 0 : [2, 2, 0]}
                >
                  <Text
                    variant={isFirstItem ? 'default' : 'medium'}
                    fontWeight="light"
                  >
                    {item.description}
                  </Text>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '8/12', '5/12', '4/12']}>
                <div className={cs(isSelected ? undefined : styles.hidden)}>
                  <Box
                    paddingBottom={2}
                    paddingTop={isFirstItem ? 3 : 2}
                    paddingLeft={isFirstItem ? 0 : [2, 2, 0]}
                  >
                    <DatePickerController
                      id={`${item.model}.validTo`}
                      size="sm"
                      label={
                        isMobile
                          ? formatMessage({
                              id:
                                'sp.settings-access-control:access-item-datepicker-label-mobile',
                              defaultMessage: 'Í gildi til',
                            })
                          : formatMessage({
                              id:
                                'sp.settings-access-control:access-item-datepicker-label',
                              defaultMessage: 'Dagsetning til',
                            })
                      }
                      backgroundColor="blue"
                      minDate={new Date()}
                      defaultValue={
                        existingScope?.name
                          ? existingScope.validTo
                          : format(defaultDate, 'yyyy-MM-dd')
                      }
                      locale={lang}
                      placeholder={undefined}
                      onChange={(value) => onChange(item, value)}
                      required
                    />
                  </Box>
                </div>
              </GridColumn>
            </GridRow>
            <Box paddingY={1} paddingLeft={isFirstItem ? 0 : [3, 3, 0]}>
              <Divider />
            </Box>
          </>
        )
      })}
    </>
  )
}

export default AccessItem
