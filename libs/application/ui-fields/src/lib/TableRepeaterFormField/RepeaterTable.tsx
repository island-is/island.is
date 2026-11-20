import { Box, Icon, Table as T, Tooltip } from '@island.is/island-ui/core'
import { ReactNode } from 'react'

export type RepeaterTableRow = {
  key: string | number
  cells: ReactNode[]
  disabled?: boolean
  actions?: ReactNode
}

type RepeaterTableProps = {
  headers: ReactNode[]
  rows: RepeaterTableRow[]
}

export const RepeaterTable = ({ headers, rows }: RepeaterTableProps) => (
  <T.Table>
    <T.Head>
      <T.Row>
        <T.HeadData></T.HeadData>
        {headers.map((header, index) => (
          <T.HeadData key={index}>{header}</T.HeadData>
        ))}
      </T.Row>
    </T.Head>
    <T.Body>
      {rows.map((row) => (
        <T.Row key={row.key}>
          <T.Data>
            {row.actions && (
              <Box display="flex" alignItems="center">
                {row.actions}
              </Box>
            )}
          </T.Data>
          {row.cells.map((cell, index) => (
            <T.Data key={index} disabled={row.disabled}>
              {cell}
            </T.Data>
          ))}
        </T.Row>
      ))}
    </T.Body>
  </T.Table>
)

type RowActionButtonProps = {
  icon: 'trash' | 'pencil'
  iconSize?: 'small'
  locked: boolean
  disabled?: boolean
  tooltip?: string
  onClick: () => void
}

export const RowActionButton = ({
  icon,
  iconSize,
  locked,
  disabled,
  tooltip,
  onClick,
}: RowActionButtonProps) => {
  // aria-disabled rather than disabled so the tooltip still
  // receives hover events on locked rows
  const button = (
    <button
      type="button"
      aria-disabled={locked}
      style={locked ? { cursor: 'default' } : undefined}
      onClick={locked ? undefined : onClick}
      disabled={disabled}
    >
      <Icon
        icon={icon}
        type="outline"
        color={locked ? 'dark300' : 'blue400'}
        size={iconSize}
      />
    </button>
  )

  return tooltip ? (
    <Tooltip placement="left" text={tooltip}>
      {button}
    </Tooltip>
  ) : (
    button
  )
}
