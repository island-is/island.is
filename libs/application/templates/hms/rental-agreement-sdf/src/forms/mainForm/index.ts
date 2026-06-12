import { FormBuilder, serverExpr } from '@island.is/application/core'
import type {
  Application,
  DataTableRow,
  DynamicCheck,
} from '@island.is/application/types'
import {
  calculateRentalPropertySize,
  getSelectedRentalUnits,
  hasRentalUnitSizeChanged,
  mapRentalPropertyInfo,
  mapRentalPropertyInfoToRows,
  shouldShowFireExtinguisherAlert as shouldShowRentalFireExtinguisherAlert,
  shouldShowSmokeDetectorAlert as shouldShowRentalSmokeDetectorAlert,
} from '../../utils/rentalDomain'
import type {
  RentalPropertyInfo,
  RentalPropertyUnitAnswer,
} from '../../utils/rentalDomain'

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
  EmergencyExitOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
} from '../../utils/constants'

type RentalAgreementSdfApplication = Application

type AddressOption = {
  label: string
  value: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

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
): RentalPropertyInfo[] => {
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
    .map(mapRentalPropertyInfo)
    .filter((property): property is RentalPropertyInfo => property !== null)
}

const getSelectedUnits = (
  app: RentalAgreementSdfApplication,
): RentalPropertyUnitAnswer[] => {
  const propertyInfoTable = isRecord(app.answers.propertyInfoTable)
    ? app.answers.propertyInfoTable
    : {}
  return getSelectedRentalUnits(propertyInfoTable.units)
}

const getPropertySize = (app: RentalAgreementSdfApplication): number =>
  calculateRentalPropertySize(getSelectedUnits(app))

const mapPropertyInfoToRows = (
  app: RentalAgreementSdfApplication,
): DataTableRow[] =>
  mapRentalPropertyInfoToRows(getPropertyInfos(app), {
    sizeLabel: propertySearch.tableHeaderSize,
    roomsLabel: propertySearch.tableHeaderRooms,
  })

const hasChangedSize: DynamicCheck = (answers) => {
  const app = { answers, externalData: {} } as RentalAgreementSdfApplication
  return hasRentalUnitSizeChanged(getSelectedUnits(app))
}

const shouldShowSmokeDetectorAlert: DynamicCheck = (answers) => {
  const app = { answers, externalData: {} } as RentalAgreementSdfApplication
  const size = getPropertySize(app)
  return shouldShowRentalSmokeDetectorAlert(
    size,
    answers['fireProtections.smokeDetectors'],
  )
}

const shouldShowFireExtinguisherAlert: DynamicCheck = (answers) => {
  return shouldShowRentalFireExtinguisherAlert(
    answers['fireProtections.fireExtinguisher'],
  )
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
  { label: misc.yes, value: EmergencyExitOptions.YES },
  { label: misc.no, value: EmergencyExitOptions.NO },
]

const server = serverExpr.forSchema<typeof dataSchema>()

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
                  {
                    label: 'Námsmenn',
                    value: RentalHousingCategoryClassGroup.STUDENT_HOUSING,
                  },
                  {
                    label: 'Eldri borgarar',
                    value:
                      RentalHousingCategoryClassGroup.SENIOR_CITIZEN_HOUSING,
                  },
                  {
                    label: 'Búsetuúrræði fyrir fatlað fólk',
                    value: RentalHousingCategoryClassGroup.COMMUNE,
                  },
                  {
                    label: 'Áfangaheimili',
                    value: RentalHousingCategoryClassGroup.HALFWAY_HOUSE,
                  },
                  {
                    label: 'Tekjulægri hópar',
                    value: RentalHousingCategoryClassGroup.INCOME_BASED_HOUSING,
                  },
                ],
                placeholder: propertyInfo.categoryClassGroupPlaceholder,
                showWhen: server.equals(
                  server.answer('propertyInfo.categoryClass'),
                  RentalHousingCategoryClass.SPECIAL_GROUPS,
                ),
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
              showWhen: server.equals(
                server.answer('condition.inspector'),
                RentalHousingConditionInspector.INDEPENDENT_PARTY,
              ),
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
                uploadHeader: housingCondition.fileUploadTitle,
                uploadDescription: housingCondition.fileUploadDescription,
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
