import { Button, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SocialInsuranceTaxCardType } from '@island.is/api/schema'
import {
  createColumnHelper,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { type MessageDescriptor } from 'react-intl'
import AnimateHeight from 'react-animate-height'
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Fragment,
  useEffect,
  useId,
  useState,
  useMemo,
  type ReactNode,
} from 'react'
import { m } from '../../../lib/messages'
import type { GetPersonalTaxCreditQuery } from './PersonalTaxCredit.generated'

type TaxCards = NonNullable<
  NonNullable<
    GetPersonalTaxCreditQuery['socialInsurancePersonalTaxCredit']
  >['taxCards']
>

type TaxCard = TaxCards[number]

type PersonalTaxCreditTableProps = {
  taxCards: TaxCards
  renderExpandedRow?: (controls: { close: () => void }) => ReactNode
}

const taxCardTypeMessageMap: Record<
  SocialInsuranceTaxCardType,
  MessageDescriptor
> = {
  [SocialInsuranceTaxCardType.PERSONAL_TAX_ALLOWANCE]:
    m.taxCardTypePersonalTaxAllowance,
  [SocialInsuranceTaxCardType.SPOUSE_TAX_ALLOWANCE]:
    m.taxCardTypeSpouseTaxAllowance,
  [SocialInsuranceTaxCardType.SPOUSE_TAX_ALLOWANCE_GRANTED]:
    m.taxCardTypeSpouseUsing,
  [SocialInsuranceTaxCardType.REGARDING_THE_ESTATE]:
    m.taxCardTypeRegardingTheEstate,
  [SocialInsuranceTaxCardType.TAX_EXEMPTION]: m.taxCardTypeTaxExemption,
  [SocialInsuranceTaxCardType.UNKNOWN_TAX_CARD]: m.taxCardTypeUnknown,
}

const isPersonalAllowance = (card: TaxCard) =>
  card.type === SocialInsuranceTaxCardType.PERSONAL_TAX_ALLOWANCE

const isPreferredEditableCard = (candidate: TaxCard, current: TaxCard) => {
  if (!candidate.validTo) return true
  if (!current.validTo) return false
  return candidate.validTo > current.validTo
}

const getEditableRowIndex = (taxCards: TaxCards): number | null => {
  let editableRowIndex: number | null = null
  for (const [index, card] of taxCards.entries()) {
    if (!isPersonalAllowance(card)) continue
    if (
      editableRowIndex === null ||
      isPreferredEditableCard(card, taxCards[editableRowIndex])
    ) {
      editableRowIndex = index
    }
  }
  return editableRowIndex
}

const getRowId = (card: TaxCard, index: number) =>
  `${card.type ?? ''}-${card.validFrom ?? ''}-${index}`

const columnHelper = createColumnHelper<TaxCard>()

export const PersonalTaxCreditTable = ({
  taxCards,
  renderExpandedRow: renderExpandedRowProp,
}: PersonalTaxCreditTableProps) => {
  const { formatMessage, formatDate, locale } = useLocale()
  const tableId = useId()
  const editableRowIndex = getEditableRowIndex(taxCards)
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCollapsingRows(new Set())
  }, [taxCards]) // eslint-disable-line react-hooks/exhaustive-deps

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        id: 'type',
        header: formatMessage(m.type),
        cell: ({ getValue }) => {
          const type = getValue()
          return type ? formatMessage(taxCardTypeMessageMap[type]) : '-'
        },
      }),
      columnHelper.accessor('validFrom', {
        id: 'validFrom',
        header: formatMessage(m.dateFrom),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : '-'
        },
      }),
      columnHelper.accessor('validTo', {
        id: 'validTo',
        header: formatMessage(m.dateTo),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(value) : '-'
        },
      }),
      columnHelper.accessor('percentage', {
        id: 'percentage',
        header: formatMessage(m.percentage),
        cell: ({ getValue }) => (getValue() != null ? `${getValue()}%` : '-'),
      }),
      ...(renderExpandedRowProp
        ? [
            columnHelper.display({
              id: 'actions',
              header: () => null,
              cell: ({ row }) =>
                row.index === editableRowIndex ? (
                  <Button
                    variant="text"
                    size="small"
                    icon={row.getIsExpanded() ? 'close' : 'pencil'}
                    iconType="outline"
                    aria-expanded={row.getIsExpanded()}
                    aria-controls={`${tableId}-expanded-${row.id}`}
                    onClick={() => row.toggleExpanded()}
                  >
                    {formatMessage(
                      row.getIsExpanded()
                        ? coreMessages.buttonCancel
                        : coreMessages.buttonEdit,
                    )}
                  </Button>
                ) : null,
            }),
          ]
        : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, renderExpandedRowProp, editableRowIndex],
  )

  const table = useReactTable({
    data: taxCards,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId,
  })

  return (
    <T.Table box={renderExpandedRowProp ? { overflow: 'visible' } : undefined}>
      <T.Head>
        {table.getHeaderGroups().map((headerGroup) => (
          <T.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <T.HeadData
                key={header.id}
                scope={header.id === 'actions' ? undefined : 'col'}
                aria-hidden={header.id === 'actions' ? true : undefined}
                box={{ background: 'blue100' }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </T.HeadData>
            ))}
          </T.Row>
        ))}
      </T.Head>
      <T.Body>
        {table.getRowModel().rows.map((row) => {
          const isExpanded = row.getIsExpanded()
          const isCollapsing = collapsingRows.has(row.id)
          const rowBackground =
            isExpanded || isCollapsing ? 'blue100' : undefined
          const closeRow = () => {
            setCollapsingRows((prev) => new Set(prev).add(row.id))
            row.toggleExpanded()
          }

          return (
            <Fragment key={row.id}>
              <T.Row>
                {row.getVisibleCells().map((cell) => (
                  <T.Data
                    key={cell.id}
                    text={{ variant: 'medium' }}
                    box={{
                      background: rowBackground,
                      borderBottomWidth:
                        isExpanded || isCollapsing ? undefined : 'standard',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </T.Data>
                ))}
              </T.Row>
              {renderExpandedRowProp && (
                <tr aria-hidden={!isExpanded && !isCollapsing}>
                  <T.Data
                    colSpan={columns.length}
                    style={{
                      padding: 0,
                      ...(!isExpanded && !isCollapsing
                        ? { borderBottom: 'none' }
                        : {}),
                    }}
                    box={{
                      background: rowBackground,
                      borderBottomWidth:
                        isExpanded || isCollapsing ? 'standard' : undefined,
                    }}
                  >
                    <AnimateHeight
                      id={`${tableId}-expanded-${row.id}`}
                      duration={300}
                      height={isExpanded ? 'auto' : 0}
                      onHeightAnimationEnd={(h) => {
                        if (h === 0) {
                          setCollapsingRows((prev) => {
                            const next = new Set(prev)
                            next.delete(row.id)
                            return next
                          })
                        }
                      }}
                    >
                      {(isExpanded || isCollapsing) &&
                        renderExpandedRowProp({ close: closeRow })}
                    </AnimateHeight>
                  </T.Data>
                </tr>
              )}
            </Fragment>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
