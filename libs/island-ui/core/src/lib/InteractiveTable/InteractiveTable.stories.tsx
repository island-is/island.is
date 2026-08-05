import React, { useState } from 'react'
import { Meta } from '@storybook/react'

import { Box } from '../Box/Box'
import { Tag } from '../Tag/Tag'
import { Text } from '../Text/Text'
import {
  InteractiveTable,
  createColumnHelper,
  SortingState,
} from './InteractiveTable'

export default {
  title: 'Core/InteractiveTable',
  component: InteractiveTable,
  parameters: {
    docs: {
      description: {
        component:
          'A data table built on TanStack React Table v8. Supports sorting, expandable rows, and a mobile-friendly card view. All state management is handled internally — opt into controlled mode via `sorting`/`onSortingChange`.',
      },
    },
  },
} as Meta

// --- Basic ---

type License = { school: string; programme: string; date: string }

const licenseHelper = createColumnHelper<License>()
const licenseColumns = [
  licenseHelper.accessor('school', { header: 'School' }),
  licenseHelper.accessor('programme', { header: 'Programme' }),
  licenseHelper.accessor('date', { header: 'Date' }),
]
const licenseData: License[] = [
  {
    school: 'Menntamálaráðuneytið',
    programme: 'Kennararéttindi',
    date: '2010-09-01',
  },
  {
    school: 'Viðskiptaráð',
    programme: 'Próf í verðbréfaviðskiptum',
    date: '2005-05-25',
  },
  { school: 'Háskóli Íslands', programme: 'Lagafræði', date: '2015-06-15' },
  { school: 'HR', programme: 'Viðskiptafræði', date: '2018-01-10' },
]

export const Basic = () => (
  <InteractiveTable
    columns={licenseColumns}
    data={licenseData}
    emptyMessage="No licenses found."
    mobileTitleKey="school"
  />
)

// --- Sortable ---

type Vehicle = {
  regno: string
  make: string
  year: number
  status: 'valid' | 'expired'
}

const vehicleHelper = createColumnHelper<Vehicle>()
const vehicleColumns = [
  vehicleHelper.accessor('regno', { header: 'Reg. no.' }),
  vehicleHelper.accessor('make', { header: 'Make', enableSorting: true }),
  vehicleHelper.accessor('year', {
    header: 'Year',
    enableSorting: true,
    meta: { align: 'right' },
  }),
  vehicleHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    meta: { type: 'interactive' },
    cell: (info) => (
      <Tag
        variant={info.getValue() === 'valid' ? 'mint' : 'red'}
        outlined
        disabled
      >
        {info.getValue() === 'valid' ? 'Valid' : 'Expired'}
      </Tag>
    ),
  }),
]
const vehicleData: Vehicle[] = [
  { regno: 'AB-123', make: 'Toyota', year: 2018, status: 'valid' },
  { regno: 'CD-456', make: 'Ford', year: 2015, status: 'expired' },
  { regno: 'EF-789', make: 'BMW', year: 2021, status: 'valid' },
  { regno: 'GH-012', make: 'Audi', year: 2012, status: 'expired' },
]

export const Sortable = () => (
  <InteractiveTable
    columns={vehicleColumns}
    data={vehicleData}
    emptyMessage="No vehicles found."
    mobileTitleKey="regno"
    srCaption="Vehicle registrations table."
    sortHint="Click a column header to sort."
  />
)

// --- Controlled sorting ---

export const ControlledSorting = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'year', desc: true },
  ])
  return (
    <InteractiveTable
      columns={vehicleColumns}
      data={vehicleData}
      emptyMessage="No vehicles found."
      mobileTitleKey="regno"
      sorting={sorting}
      onSortingChange={setSorting}
      manualSorting
    />
  )
}

// --- Expandable rows ---

type Permit = { id: string; type: string; issued: string; detail: string }

const permitHelper = createColumnHelper<Permit>()
const permitColumns = [
  permitHelper.accessor('id', { header: 'ID' }),
  permitHelper.accessor('type', { header: 'Type' }),
  permitHelper.accessor('issued', { header: 'Issued' }),
]
const permitData: Permit[] = [
  {
    id: 'P-001',
    type: 'Fishing',
    issued: '2023-01-15',
    detail: 'Valid for coastal waters, zone A–C. Renewal due Jan 2025.',
  },
  {
    id: 'P-002',
    type: 'Hunting',
    issued: '2022-09-01',
    detail: 'Restricted to highland regions. Valid season: Aug–Nov.',
  },
  {
    id: 'P-003',
    type: 'Building',
    issued: '2024-03-20',
    detail: 'Single-family dwelling, lot 42B. Expires 2026-03-20.',
  },
]

export const Expandable = () => (
  <InteractiveTable
    columns={permitColumns}
    data={permitData}
    emptyMessage="No permits found."
    mobileTitleKey="id"
    expanderLabel="Expand row"
    renderExpandedRow={(row) => (
      <Box paddingY={2}>
        <Text fontWeight="semiBold">Details</Text>
        <Text>{row.original.detail}</Text>
      </Box>
    )}
  />
)

// --- Loading state ---

export const Loading = () => (
  <InteractiveTable
    columns={licenseColumns}
    data={[]}
    loading
    emptyMessage="No licenses found."
  />
)

// --- Error state ---

export const Error = () => (
  <InteractiveTable
    columns={licenseColumns}
    data={[]}
    errorMessage="Could not load data. Please try again later."
    emptyMessage="No licenses found."
  />
)

// --- Empty state ---

export const Empty = () => (
  <InteractiveTable
    columns={licenseColumns}
    data={[]}
    emptyMessage="No licenses found for this individual."
  />
)
