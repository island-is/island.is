import {
  buildDescriptionField,
  buildMultiField,
  buildPaginatedSearchableTableField,
  buildSubSection,
} from '@island.is/application/core'

export const paginatedSearchableTableSubsection = buildSubSection({
  id: 'paginatedSearchableTableSubsection',
  title: 'Paginated searchable table',
  children: [
    buildMultiField({
      id: 'paginatedSearchableTableMultiField',
      title: 'Paginated searchable table field',
      children: [
        buildDescriptionField({
          id: 'paginatedSearchableTableDescription',
          description:
            'Paginated searchable table displays rows with built-in search and pagination. You can configure editable columns and only persist specific changed values on submit.',
          marginBottom: 2,
        }),
        buildPaginatedSearchableTableField({
          id: 'paginatedSearchableTable',
          doesNotRequireAnswer: true,
          rowIdKey: 'id',
          rows: [
            {
              id: 'V0010',
              vehicle: 'Toyota Yaris',
              mileage: 42500,
              color: 'Blue',
            },
            {
              id: 'V0020',
              vehicle: 'Kia Ceed',
              mileage: 83210,
              color: 'White',
            },
            {
              id: 'V0030',
              vehicle: 'Tesla Model 3',
              mileage: 12340,
              color: 'Black',
            },
            {
              id: 'V0040',
              vehicle: 'Dacia Duster',
              mileage: 105920,
              color: 'Grey',
            },
            {
              id: 'V0050',
              vehicle: 'Volkswagen Golf',
              mileage: 65210,
              color: 'Red',
            },
            {
              id: 'V0060',
              vehicle: 'Suzuki Swift',
              mileage: 39100,
              color: 'Yellow',
            },
            {
              id: 'V0070',
              vehicle: 'Hyundai i30',
              mileage: 73440,
              color: 'Silver',
            },
            {
              id: 'V0080',
              vehicle: 'Skoda Octavia',
              mileage: 91200,
              color: 'Green',
            },
            {
              id: 'V0090',
              vehicle: 'Nissan Leaf',
              mileage: 28410,
              color: 'White',
            },
            { id: 'V0100', vehicle: 'Mazda 3', mileage: 56000, color: 'Blue' },
            {
              id: 'V0110',
              vehicle: 'Renault Clio',
              mileage: 68420,
              color: 'Black',
            },
            {
              id: 'V0120',
              vehicle: 'Ford Focus',
              mileage: 77990,
              color: 'Grey',
            },
          ],
          headers: [
            { key: 'id', label: 'ID' },
            { key: 'vehicle', label: 'Vehicle' },
            {
              key: 'mileage',
              label: 'Mileage',
              editable: true,
              inputType: 'number',
              min: 0,
            },
            { key: 'color', label: 'Color' },
          ],
          searchLabel: 'Search vehicles',
          searchPlaceholder: 'Search by ID, vehicle or color',
          emptyState: 'No rows match your search.',
          searchKeys: ['id', 'vehicle', 'color'],
          savePropertyNames: ['mileage'],
          pageSize: 5,
          callbackId: 'persistPaginatedSearchableTableExample',
        }),
      ],
    }),
  ],
})
