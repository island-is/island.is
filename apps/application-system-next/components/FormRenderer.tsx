'use client'

import { useEffect, useMemo } from 'react'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { getFormExpressionDependencies } from '@island.is/application/core'
import { ComponentSwitch } from './form-renderer/ComponentSwitch'
import { groupComponentsIntoRows } from './form-renderer/layout'
import type {
  FormRendererProps,
  SdfFormDispatch,
} from './form-renderer/types'

export type { SdfFormDispatch }

export const FormRenderer = ({
  components,
  errors,
  answers,
  onAnswerChange,
  dispatch,
  displayValues,
  pendingRefetchTargets = [],
}: FormRendererProps) => {
  const errorMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const err of errors) {
      map[err.componentId] = err.message
    }
    return map
  }, [errors])

  const rows = groupComponentsIntoRows(components)

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return
    }

    const displayFieldIds = new Set(
      components
        .filter((component) => component.__typename === 'SdfDisplayField')
        .map((component) => component.id)
        .filter((id): id is string => typeof id === 'string'),
    )

    for (const component of components) {
      if (
        component.__typename !== 'SdfDisplayField' ||
        !component.id ||
        !component.clientValueExpression
      ) {
        continue
      }

      const dependencies = getFormExpressionDependencies(
        component.clientValueExpression,
      )
      for (const dependency of dependencies) {
        if (dependency !== component.id && displayFieldIds.has(dependency)) {
          console.warn(
            `SDF display field ${component.id} clientValueExpression depends on display field ${dependency}. Client expressions can only read answers; inline the source expression instead.`,
          )
        }
      }
    }
  }, [components])

  return (
    <Box>
      {rows.map((row, rowIdx) => {
        if (row.length === 1 && row[0].width !== 'HALF') {
          const component = row[0]
          return (
            <ComponentSwitch
              key={component.id ?? `component-${rowIdx}`}
              component={component}
              error={component.id ? errorMap[component.id] : undefined}
              answers={answers}
              onAnswerChange={onAnswerChange}
              dispatch={dispatch}
              displayValues={displayValues}
              pendingRefetchTargets={pendingRefetchTargets}
            />
          )
        }

        return (
          <GridRow key={`row-${rowIdx}`}>
            {row.map((component, colIdx) => (
              <GridColumn
                key={component.id ?? `col-${rowIdx}-${colIdx}`}
                span={['1/1', '1/2']}
                paddingBottom={0}
              >
                <ComponentSwitch
                  component={component}
                  error={component.id ? errorMap[component.id] : undefined}
                  answers={answers}
                  onAnswerChange={onAnswerChange}
                  dispatch={dispatch}
                  displayValues={displayValues}
                  pendingRefetchTargets={pendingRefetchTargets}
                />
              </GridColumn>
            ))}
          </GridRow>
        )
      })}
    </Box>
  )
}
