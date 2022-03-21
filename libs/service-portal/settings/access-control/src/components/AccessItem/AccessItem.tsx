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
import { useLocale } from '@island.is/localization'

import type { Scope } from '../../screens/Access/Access'
import * as styles from './AccessItem.css'
import add from 'date-fns/add'
import format from 'date-fns/format'

interface PropTypes {
  apiScopes: Scope[]
  authDelegation: AuthCustomDelegation
}

function AccessItem({ apiScopes, authDelegation }: PropTypes) {
  const { lang, formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()

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
                  paddingBottom={isLastItem ? 'p3' : 'p1'}
                  paddingTop={isFirstItem ? 'p3' : 'p1'}
                  paddingLeft={isFirstItem ? 0 : [0, 0, 4]}
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
                  paddingBottom={isLastItem ? 'p3' : 'p1'}
                  paddingTop={isFirstItem ? 'p3' : 'p1'}
                  paddingLeft={[0, 0, 3]}
                >
                  <Text variant={isFirstItem ? 'default' : 'medium'}>
                    {item.description}
                  </Text>
                </Box>
              </GridColumn>
              <GridColumn span={['8/12', '8/12', '5/12', '4/12']}>
                <Box
                  paddingBottom={isLastItem ? 'p3' : 'p1'}
                  paddingTop={isFirstItem ? 'p3' : 'p1'}
                  paddingLeft={[0, 0, 3]}
                >
                  <div className={cs(isSelected ? undefined : styles.hidden)}>
                    <DatePickerController
                      id={`${item.model}.validTo`}
                      size="sm"
                      label={formatMessage({
                        id:
                          'sp.settings-access-control:access-item-datepicker-label',
                        defaultMessage: 'Dagsetning til',
                      })}
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
                    />
                  </div>
                </Box>
              </GridColumn>
            </GridRow>
            <Divider />
          </>
        )
      })}
    </>
  )
}

export default AccessItem
