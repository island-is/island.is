import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildPaginatedSearchableTableField,
  buildSection,
} from '@island.is/application/core'
import { Application, ExternalData } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  VehicleWithMileage,
  VehiclesResponse,
  SERVER_SIDE_VEHICLE_THRESHOLD,
} from '../../lib/types'
import { RegistrationType } from '../../utils/constants'
import { GetVehiclesListV2Query } from '../../graphql/queries'

const VEHICLE_TABLE_THRESHOLD = 5

const getVehiclesResponse = (
  externalData: ExternalData,
): VehiclesResponse | null =>
  getValueViaPath<VehiclesResponse>(externalData, 'getCurrentVehicles.data') ??
  null

const getVehicles = (externalData: ExternalData): VehicleWithMileage[] =>
  getVehiclesResponse(externalData)?.vehicles ?? []

const getTotalRecords = (externalData: ExternalData): number =>
  getVehiclesResponse(externalData)?.totalRecords ?? 0

const isServerSide = (externalData: ExternalData): boolean =>
  getTotalRecords(externalData) > SERVER_SIDE_VEHICLE_THRESHOLD

export const importVehiclesSection = buildSection({
  condition: (answers) => {
    const registrationTypeValue = getValueViaPath<string>(
      answers,
      'registrationType',
    )

    return registrationTypeValue === RegistrationType.IMPORT
  },
  id: 'importVehiclesSection',
  title: m.importVehicles.title,
  children: [
    buildMultiField({
      id: 'importVehiclesMultiField',
      title: m.importVehicles.title,
      children: [
        buildDescriptionField({
          id: 'importVehiclesDescription',
          description: m.importVehicles.description,
        }),
        buildCheckboxField({
          id: 'selectedImportVehicles',
          title: m.importVehicles.checkboxLabel,
          required: true,
          condition: (_formValue, externalData) => {
            if (isServerSide(externalData)) return false
            const vehicles = getVehicles(externalData)
            return (
              vehicles.filter((v) => v.permno).length <= VEHICLE_TABLE_THRESHOLD
            )
          },
          options: (application: Application) => {
            const vehicles = getVehicles(application.externalData)

            return vehicles
              .filter((v) => v.permno)
              .map((v) => ({
                label: {
                  ...m.commonVehicleMessages.vehicleCheckboxLabel,
                  values: {
                    permno: v.permno,
                    type: v.type ? ` - ${v.type}` : '',
                  },
                },
                subLabel: {
                  ...m.commonVehicleMessages.vehicleCheckboxSubLabel,
                  values: {
                    mileage: `<b>${
                      v.milage?.toLocaleString('is-IS') ?? '—'
                    }</b>`,
                  },
                },
                value: v.permno as string,
              }))
          },
        }),
        buildPaginatedSearchableTableField({
          id: 'selectedImportVehicles',
          doesNotRequireAnswer: true,
          condition: (_formValue, externalData) => {
            if (isServerSide(externalData)) return false
            const vehicles = getVehicles(externalData)
            return vehicles.length > VEHICLE_TABLE_THRESHOLD
          },
          rowIdKey: 'permno',
          rows: (application) => {
            const vehicles = getVehicles(application.externalData)

            return vehicles
              .filter((v) => v.permno)
              .map((v) => ({
                permno: v.permno as string,
                type: v.type ?? '',
                mileage: v.milage
                  ? `${v.milage.toLocaleString('is-IS')} km`
                  : '—',
              }))
          },
          headers: [
            {
              key: 'permno',
              label: m.importVehicles.tableHeaderPermno,
            },
            {
              key: 'type',
              label: m.importVehicles.tableHeaderType,
            },
            {
              key: 'mileage',
              label: m.importVehicles.tableHeaderMileage,
            },
          ],
          searchLabel: m.importVehicles.searchLabel,
          searchPlaceholder: m.importVehicles.searchPlaceholder,
          emptyState: m.importVehicles.emptyState,
          searchKeys: ['permno', 'type'],
          pageSize: VEHICLE_TABLE_THRESHOLD,
        }),
        buildPaginatedSearchableTableField({
          id: 'selectedImportVehicles',
          doesNotRequireAnswer: true,
          condition: (_formValue, externalData) => isServerSide(externalData),
          rowIdKey: 'permno',
          rows: [],
          headers: [
            {
              key: 'permno',
              label: m.importVehicles.tableHeaderPermno,
            },
            {
              key: 'type',
              label: m.importVehicles.tableHeaderType,
            },
            {
              key: 'mileage',
              label: m.importVehicles.tableHeaderMileage,
            },
          ],
          searchLabel: m.importVehicles.searchLabel,
          searchPlaceholder: m.importVehicles.searchPlaceholder,
          emptyState: m.importVehicles.emptyState,
          searchKeys: ['permno', 'type'],
          pageSize: 10,
          selectable: true,
          selectedDetailsKey: 'selectedImportVehicleDetails',
          selectedCountLabel: m.importVehicles.selectedCount,
          serverSideFetch: async ({
            apolloClient,
            page,
            pageSize,
            searchTerm,
          }) => {
            const { data } = await apolloClient.query({
              query: GetVehiclesListV2Query,
              variables: {
                input: {
                  page,
                  pageSize,
                  onlyMileage: true,
                  showOwned: true,
                  showCoowned: true,
                  showOperated: true,
                  permno: searchTerm || undefined,
                },
              },
              fetchPolicy: 'network-only',
            })

            const vehicleList = data?.vehiclesListV2?.vehicleList ?? []
            const totalRecords = data?.vehiclesListV2?.paging?.totalRecords ?? 0

            return {
              rows: vehicleList.map(
                (v: {
                  permno?: string
                  make?: string
                  latestMileage?: number
                }) => ({
                  permno: v.permno ?? '',
                  type: v.make ?? '',
                  mileage: v.latestMileage
                    ? `${v.latestMileage.toLocaleString('is-IS')} km`
                    : '—',
                  milage: v.latestMileage ?? null,
                }),
              ),
              totalRows: totalRecords,
            }
          },
        }),
      ],
    }),
  ],
})
