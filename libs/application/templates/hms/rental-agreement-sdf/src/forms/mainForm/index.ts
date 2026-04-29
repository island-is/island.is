import { FormBuilder } from '@island.is/application/core'
import type {
  Application,
  DataTableRow,
  DynamicCheck,
} from '@island.is/application/types'

import { GetPropertyInfoApi, SearchAddressesApi } from '../../dataProviders'
import { dataSchema } from '../../lib/dataSchema'
import {
  application,
  fireProtections,
  housingCondition,
  misc,
  propertyInfo,
  propertySearch,
  specialProvisions,
} from '../../lib/messages'
import {
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
} from '../../utils/constants'

type RentalAgreementSdfApplication = Application

type AddressOption = {
  label: string
  value: string
}

type PropertyUnit = {
  propertyCode?: number
  propertyUsageDescription?: string
  size?: number
  sizeUnit?: string
  unitCode?: string
}

type AppraisalUnit = {
  unitCode?: string
  propertyUsageDescription?: string
  units?: PropertyUnit[]
}

type PropertyInfo = {
  propertyCode?: number
  propertyUsageDescription?: string
  size?: number
  sizeUnit?: string
  unitCode?: string
  appraisalUnits?: AppraisalUnit[]
}

type PropertyUnitAnswer = PropertyUnit & {
  checked?: boolean
  changedSize?: number
  numOfRooms?: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined

const toString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const mapUnit = (value: unknown): PropertyUnit | null => {
  if (!isRecord(value)) return null
  return {
    propertyCode: toNumber(value.propertyCode),
    propertyUsageDescription: toString(value.propertyUsageDescription),
    size: toNumber(value.size),
    sizeUnit: toString(value.sizeUnit),
    unitCode: toString(value.unitCode),
  }
}

const mapPropertyInfo = (value: unknown): PropertyInfo | null => {
  if (!isRecord(value)) return null
  const appraisalUnits = Array.isArray(value.appraisalUnits)
    ? value.appraisalUnits.filter(isRecord).map((unit) => ({
        unitCode: toString(unit.unitCode),
        propertyUsageDescription: toString(unit.propertyUsageDescription),
        units: Array.isArray(unit.units)
          ? unit.units.map(mapUnit).filter((u): u is PropertyUnit => u !== null)
          : [],
      }))
    : []

  return {
    propertyCode: toNumber(value.propertyCode),
    propertyUsageDescription: toString(value.propertyUsageDescription),
    size: toNumber(value.size),
    sizeUnit: toString(value.sizeUnit),
    unitCode: toString(value.unitCode),
    appraisalUnits,
  }
}

const getExternalDataRecord = (
  app: RentalAgreementSdfApplication,
  key: string,
): Record<string, unknown> => {
  const data = app.externalData?.[key]?.data
  return isRecord(data) ? data : {}
}

const getAddressOptions = (
  app: RentalAgreementSdfApplication,
): AddressOption[] => {
  const options = getExternalDataRecord(app, SearchAddressesApi.action).options
  if (!Array.isArray(options)) return []
  return options.filter(isRecord).map((option) => ({
    label: String(option.label ?? ''),
    value: String(option.value ?? ''),
  }))
}

const getPropertyInfos = (
  app: RentalAgreementSdfApplication,
): PropertyInfo[] => {
  const propertyInfoData = getExternalDataRecord(
    app,
    GetPropertyInfoApi.action,
  ).propertiesByAddressCode
  const searchData = getExternalDataRecord(
    app,
    SearchAddressesApi.action,
  ).propertiesByAddressCode
  const properties = Array.isArray(propertyInfoData)
    ? propertyInfoData
    : Array.isArray(searchData)
    ? searchData
    : []
  return properties
    .map(mapPropertyInfo)
    .filter((property): property is PropertyInfo => property !== null)
}

const unitKey = (propertyCode?: number, unitCode?: string): string =>
  `${propertyCode ?? 'property'}_${unitCode ?? 'unit'}`

const mapSelectedUnitAnswer = (value: unknown): PropertyUnitAnswer | null => {
  const unit = mapUnit(value)
  if (!unit || !isRecord(value)) return null
  return {
    ...unit,
    checked: value.checked === true,
    changedSize: toNumber(value.changedSize),
    numOfRooms: toNumber(value.numOfRooms),
  }
}

const getSelectedUnits = (
  app: RentalAgreementSdfApplication,
): PropertyUnitAnswer[] => {
  const propertyInfoTable = isRecord(app.answers.propertyInfoTable)
    ? app.answers.propertyInfoTable
    : {}
  const units = propertyInfoTable.units
  if (!Array.isArray(units)) return []
  return units
    .map(mapSelectedUnitAnswer)
    .filter((unit): unit is PropertyUnitAnswer => unit?.checked === true)
}

const getPropertySize = (app: RentalAgreementSdfApplication): number =>
  getSelectedUnits(app).reduce((sum, unit) => {
    const changedSize = Number(unit.changedSize)
    return sum + (Number.isFinite(changedSize) ? changedSize : unit.size ?? 0)
  }, 0)

const mapPropertyInfoToRows = (
  app: RentalAgreementSdfApplication,
): DataTableRow[] =>
  getPropertyInfos(app).map((property) => ({
    id: String(property.propertyCode ?? property.unitCode ?? 'property'),
    cells: [
      String(property.propertyCode ?? ''),
      property.unitCode ?? '',
      property.size ? `${property.size} ${property.sizeUnit ?? 'm²'}` : '',
      '',
    ],
    expandable: {
      rows: (property.appraisalUnits ?? []).flatMap((appraisalUnit) =>
        (appraisalUnit.units ?? []).map((unit) => {
          const key = unitKey(
            unit.propertyCode ?? property.propertyCode,
            unit.unitCode,
          )
          return {
            id: key,
            label:
              unit.propertyUsageDescription ?? appraisalUnit.unitCode ?? '',
            cells: [unit.unitCode ?? ''],
            hasCheckbox: true,
            checkboxKey: 'checked',
            payload: {
              ...unit,
              propertyCode: unit.propertyCode ?? property.propertyCode,
            },
            defaultValues: {
              changedSize: unit.size ?? 0,
              numOfRooms: 0,
            },
            inputs: [
              {
                key: 'changedSize',
                label: propertySearch.tableHeaderSize,
                type: 'number' as const,
                min: 0,
                suffix: unit.sizeUnit ?? 'm²',
              },
              {
                key: 'numOfRooms',
                label: propertySearch.tableHeaderRooms,
                type: 'number' as const,
                min: 0,
              },
            ],
          }
        }),
      ),
    },
  }))

const hasChangedSize: DynamicCheck = (answers) => {
  const app = { answers, externalData: {} } as RentalAgreementSdfApplication
  return getSelectedUnits(app).some((unit) => {
    if (typeof unit.changedSize !== 'number') return false
    return unit.size === undefined || unit.changedSize !== unit.size
  })
}

const shouldShowSmokeDetectorAlert: DynamicCheck = (answers) => {
  const app = { answers, externalData: {} } as RentalAgreementSdfApplication
  const size = getPropertySize(app)
  const smokeDetectors = Number(answers['fireProtections.smokeDetectors'])
  return (
    size > 0 &&
    (!Number.isFinite(smokeDetectors) || smokeDetectors < Math.ceil(size / 80))
  )
}

const shouldShowFireExtinguisherAlert: DynamicCheck = (answers) => {
  const fireExtinguisher = Number(answers['fireProtections.fireExtinguisher'])
  return !Number.isFinite(fireExtinguisher) || fireExtinguisher < 1
}

const propertyTypeOptions = [
  { label: misc.entireHome, value: RentalHousingCategoryTypes.ENTIRE_HOME },
  { label: misc.room, value: RentalHousingCategoryTypes.ROOM },
  { label: misc.commercial, value: RentalHousingCategoryTypes.COMMERCIAL },
]

const propertyClassOptions = [
  {
    label: misc.generalMarket,
    value: RentalHousingCategoryClass.GENERAL_MARKET,
  },
  {
    label: misc.specialGroups,
    value: RentalHousingCategoryClass.SPECIAL_GROUPS,
  },
]

const yesNoOptions = [
  { label: misc.yes, value: 'yes' },
  { label: misc.no, value: 'no' },
]

export const MainForm = new FormBuilder<typeof dataSchema>(
  'rentalAgreementSdfDraft',
  application.name,
)
  .addSection('rentalHousing', application.rentalHousingSection, (section) => {
    section.addSubSection('propertySearch', propertySearch.title, (sub) => {
      sub.addPage('propertySearch', propertySearch.title, (page) => {
        page
          .addDescriptionField(
            'propertySearch.description',
            propertySearch.description,
          )
          .addSearchField('propertySearch', '', {
            searchAction: SearchAddressesApi.action,
            options: getAddressOptions,
            placeholder: propertySearch.placeholder,
            minQueryLength: 3,
            required: true,
            onSelectRefetch: [GetPropertyInfoApi.action],
            refetchTargets: ['propertyInfoTable'],
          })
          .addDataTableField('propertyInfoTable', '', {
            header: [
              propertySearch.tableHeaderPropertyCode,
              propertySearch.tableHeaderUnitCode,
              propertySearch.tableHeaderSize,
              propertySearch.tableHeaderRooms,
            ],
            rows: mapPropertyInfoToRows,
          })
          .addDescriptionField(
            'propertySearch.spouseFamilyNotice',
            propertySearch.spouseFamilyNotice,
          )
      })
    })

    section.addSubSection(
      'propertyInfo',
      propertyInfo.subsectionName,
      (sub) => {
        sub.addPage('propertyInfo', propertyInfo.pageTitle, (page) => {
          page
            .addDescriptionField(
              'propertyInfo.categoryTitle',
              propertyInfo.categoryTitle,
              {
                description: propertyInfo.categoryDescription,
                titleVariant: 'h3',
              },
            )
            .addStaticTableField('propertyInfo.selectedUnits', '', {
              header: [
                propertySearch.tableHeaderPropertyCode,
                propertySearch.tableHeaderUnitCode,
                propertySearch.tableHeaderSize,
                propertySearch.tableHeaderRooms,
              ],
              rows: (app: RentalAgreementSdfApplication) =>
                getSelectedUnits(app).map((unit) => [
                  String(unit.propertyCode ?? ''),
                  unit.unitCode ?? '',
                  unit.changedSize
                    ? `${unit.changedSize} ${unit.sizeUnit ?? 'm²'}`
                    : unit.size
                    ? `${unit.size} ${unit.sizeUnit ?? 'm²'}`
                    : '',
                  unit.numOfRooms !== undefined ? String(unit.numOfRooms) : '',
                ]),
            })
            .addSelectField(
              'propertyInfo.categoryType',
              propertyInfo.categoryLabel,
              {
                options: propertyTypeOptions,
                defaultValue: RentalHousingCategoryTypes.ENTIRE_HOME,
                required: true,
              },
            )
            .addDescriptionField(
              'propertyInfo.specialGroupsTitle',
              propertyInfo.specialGroupsTitle,
              {
                description: propertyInfo.specialGroupsDescription,
                titleVariant: 'h3',
                marginTop: 4,
              },
            )
            .addRadioField('propertyInfo.categoryClass', '', {
              options: propertyClassOptions,
              defaultValue: RentalHousingCategoryClass.GENERAL_MARKET,
              width: 'half',
              required: true,
            })
            .addSelectField(
              'propertyInfo.categoryClassGroup',
              propertyInfo.categoryClassGroupLabel,
              {
                options: [
                  { label: 'Námsmenn', value: 'students' },
                  { label: 'Eldri borgarar', value: 'seniors' },
                  { label: 'Tekjulægri hópar', value: 'lowIncome' },
                ],
                placeholder: propertyInfo.categoryClassGroupPlaceholder,
                showWhen: {
                  field: 'propertyInfo.categoryClass',
                  equals: RentalHousingCategoryClass.SPECIAL_GROUPS,
                },
              },
            )
        })
      },
    )

    section.addSubSection(
      'specialProvisions',
      specialProvisions.subsectionName,
      (sub) => {
        sub.addPage(
          'specialProvisions',
          specialProvisions.pageTitle,
          (page) => {
            page
              .addDescriptionField(
                'specialProvisions.pageDescription',
                specialProvisions.pageDescription,
              )
              .addHiddenInputWithWatchedValue(
                'specialProvisions.propertySearchUnits',
                {
                  watchValue: 'propertyInfoTable.units',
                },
              )
              .addAlertMessageField('specialProvisions.changedSizeWarning', {
                alertType: 'warning',
                message: specialProvisions.changedSizeWarning,
                showWhen: hasChangedSize,
              })
              .addDescriptionField(
                'specialProvisions.descriptionTitle',
                specialProvisions.descriptionTitle,
                { titleVariant: 'h3' },
              )
              .addTextField(
                'specialProvisions.descriptionInput',
                specialProvisions.descriptionInputLabel,
                {
                  variant: 'textarea',
                  rows: 8,
                  placeholder: specialProvisions.descriptionInputPlaceholder,
                  maxLength: 2000,
                },
              )
              .addDescriptionField(
                'specialProvisions.rulesTitle',
                specialProvisions.rulesTitle,
                { titleVariant: 'h3', marginTop: 6 },
              )
              .addTextField(
                'specialProvisions.rulesInput',
                specialProvisions.rulesInputLabel,
                {
                  variant: 'textarea',
                  rows: 8,
                  placeholder: specialProvisions.rulesInputPlaceholder,
                },
              )
          },
        )
      },
    )

    section.addSubSection(
      'housingCondition',
      housingCondition.subsectionName,
      (sub) => {
        sub.addPage('housingCondition', housingCondition.pageTitle, (page) => {
          page
            .addDescriptionField(
              'housingCondition.pageDescription',
              housingCondition.pageDescription,
            )
            .addDescriptionField(
              'condition.inspectorTitle',
              housingCondition.inspectorTitle,
              {
                description: housingCondition.inspectorDescription,
                titleVariant: 'h3',
              },
            )
            .addRadioField('condition.inspector', '', {
              options: [
                {
                  label: misc.contractParties,
                  value: RentalHousingConditionInspector.CONTRACT_PARTIES,
                },
                {
                  label: misc.independentParty,
                  value: RentalHousingConditionInspector.INDEPENDENT_PARTY,
                },
              ],
              defaultValue: RentalHousingConditionInspector.CONTRACT_PARTIES,
              width: 'half',
            })
            .addTextField('condition.inspectorName', misc.fullName, {
              placeholder: housingCondition.independentInspectorNamePlaceholder,
              required: true,
              showWhen: {
                field: 'condition.inspector',
                equals: RentalHousingConditionInspector.INDEPENDENT_PARTY,
              },
            })
            .addDescriptionField(
              'condition.resultsTitle',
              housingCondition.inspectionResultsTitle,
              {
                description: housingCondition.inspectionResultsDescription,
                titleVariant: 'h3',
                marginTop: 6,
              },
            )
            .addTextField(
              'condition.resultsDescription',
              housingCondition.inspectionResultsInputLabel,
              {
                variant: 'textarea',
                rows: 8,
                maxLength: 2000,
                placeholder: housingCondition.inspectionResultsInputPlaceholder,
              },
            )
            .addFileUploadField(
              'condition.resultsFiles',
              housingCondition.fileUploadTitle,
              {
                description: housingCondition.fileUploadDescription,
                uploadAccept:
                  '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
                uploadMultiple: true,
              },
            )
        })
      },
    )

    section.addSubSection(
      'fireProtections',
      fireProtections.subsectionName,
      (sub) => {
        sub.addPage('fireProtections', fireProtections.pageTitle, (page) => {
          page
            .addDescriptionField(
              'fireProtections.pageDescription',
              fireProtections.pageDescription,
            )
            .addDescriptionField(
              'fireProtections.requirements',
              fireProtections.smokeDetectorsFireExtinguisherTitle,
              {
                description:
                  fireProtections.smokeDetectorsFireExtinguisherRequirements,
                titleVariant: 'h3',
              },
            )
            .addAlertMessageField('fireProtections.smokeDetectorsAlert', {
              alertType: 'warning',
              title: fireProtections.smokeDetectorsAlertTitle,
              message: fireProtections.smokeDetectorsAlertMessage,
              showWhen: shouldShowSmokeDetectorAlert,
            })
            .addAlertMessageField('fireProtections.fireExtinguisherAlert', {
              alertType: 'warning',
              title: fireProtections.fireExtinguisherAlertTitle,
              message: fireProtections.fireExtinguisherAlertMessage,
              showWhen: shouldShowFireExtinguisherAlert,
            })
            .addTextField(
              'fireProtections.smokeDetectors',
              fireProtections.smokeDetectorsLabel,
              {
                variant: 'number',
                width: 'half',
                min: 0,
                max: 9,
                maxLength: 1,
              },
            )
            .addTextField(
              'fireProtections.fireExtinguisher',
              fireProtections.fireExtinguisherLabel,
              {
                variant: 'number',
                width: 'half',
                min: 0,
                max: 9,
                maxLength: 1,
              },
            )
            .addDescriptionField(
              'fireProtections.fireBlanketRequirements',
              fireProtections.fireBlanketLabel,
              {
                description: fireProtections.fireBlanketRequirements,
                titleVariant: 'h3',
                marginTop: 4,
              },
            )
            .addRadioField('fireProtections.fireBlanket', '', {
              options: yesNoOptions,
              width: 'half',
            })
            .addDescriptionField(
              'fireProtections.exitRequirements',
              fireProtections.exitsLabel,
              {
                description: fireProtections.exitRequirements,
                titleVariant: 'h3',
                marginTop: 4,
              },
            )
            .addRadioField('fireProtections.emergencyExits', '', {
              options: yesNoOptions,
              width: 'half',
            })
            .addDescriptionField(
              'fireProtections.eldklarMessage',
              fireProtections.eldklarMessage,
              { marginTop: 4 },
            )
            .addHiddenInputWithWatchedValue('fireProtections.propertySize', {
              watchValue: 'propertyInfoTable.units',
            })
        })
      },
    )
  })
  .build()
