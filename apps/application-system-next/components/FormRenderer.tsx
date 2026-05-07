'use client'

import { useMemo } from 'react'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
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
