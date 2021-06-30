import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { Table as T, Text } from '@island.is/island-ui/core'
import { AuthCustomDelegation } from '@island.is/api/schema'
import {
  CheckboxController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import type { Scope } from '../../Access'

type TableDataProps = React.ComponentProps<typeof T.Data>

interface PropTypes {
  apiScopes: Scope[]
  authDelegation: AuthCustomDelegation
}

function AccessItem({ apiScopes, authDelegation }: PropTypes) {
  const { lang } = useLocale()
  const { setValue, getValues } = useFormContext()

  const toggleCheckboxGroup = () => {
    const values = apiScopes
      .filter((apiScope) => apiScope.__typename !== 'AuthApiScopeGroup')
      .map((apiScope) => getValues(`${apiScope.model}.name`))
    setValue(
      `${apiScopes[0].model}.name`,
      values.every((value) => value?.length > 0) ? [apiScopes[0].name] : [],
    )
  }

  const toggleDatePickerGroup = () => {
    const values = apiScopes
      .filter((apiScope) => apiScope.__typename !== 'AuthApiScopeGroup')
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
    if (item.__typename === 'AuthApiScopeGroup') {
      apiScopes.forEach((apiScope) => {
        setValue(
          `${apiScope.model}.name`,
          value.length > 0 ? [apiScope.name] : [],
        )
      })
    } else {
      toggleCheckboxGroup()
    }
  }

  const onChange = (item: Scope, value: string) => {
    if (item.__typename === 'AuthApiScopeGroup') {
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
        const tdStyling: TableDataProps['box'] = {
          borderBottomWidth: isLastItem ? 'standard' : undefined,
          paddingBottom: isLastItem ? 'p5' : 'p1',
          paddingTop: isFirstItem ? 'p5' : 'p1',
        }

        const existingScope = authDelegation.scopes.find(
          (scope) => scope.name === item.name,
        )

        return (
          <T.Row key={index}>
            <T.Data
              box={{
                ...tdStyling,
                paddingLeft: isFirstItem ? 3 : 8,
              }}
            >
              <CheckboxController
                id={`${item.model}.name`}
                spacing={0}
                labelVariant={isFirstItem ? 'default' : 'small'}
                defaultValue={existingScope ? [existingScope.name] : []}
                options={[
                  {
                    label: item.displayName,
                    value: item.name,
                  },
                ]}
                onSelect={(value) => onSelect(item, value)}
              />
            </T.Data>
            <T.Data box={tdStyling}>
              <Text variant={isFirstItem ? 'default' : 'small'}>
                {item.description}
              </Text>
            </T.Data>
            <T.Data box={tdStyling}>
              <DatePickerController
                id={`${item.model}.validTo`}
                size="sm"
                label=""
                defaultValue={existingScope?.validTo}
                locale={lang}
                placeholder="-"
                onChange={(value) => onChange(item, value)}
              />
            </T.Data>
          </T.Row>
        )
      })}
    </>
  )
}

export default AccessItem
