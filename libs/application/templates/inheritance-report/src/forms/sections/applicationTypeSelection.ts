import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { EstateOnEntryApi } from '../../dataProviders'
import { InheritanceReportInfo } from '@island.is/clients/syslumenn'
import { ESTATE_INHERITANCE } from '../../lib/constants'

export const preSelection = buildSection({
  id: 'deceasedPreselection',
  title: m.preDataCollectionChooseEstateSelectTitle,
  children: [
    buildExternalDataProvider({
      id: 'preApproveExternalData',
      title: m.preDataCollectionHeading,
      description: m.preDataCollectionInfo,
      checkboxLabel: m.dataCollectionCheckbox,
      subTitle: m.dataCollectionSubtitle,
      dataProviders: [
        buildDataProviderItem({
          title: m.preDataCollectionTitle,
          subTitle: m.preDataCollectionDescription,
          id: 'syslumennOnEntry',
          provider: EstateOnEntryApi,
        }),
      ],
    }),
    buildMultiField({
      id: 'estate',
      title: m.selectEstate,
      description: m.selectEstateDescription,
      condition: (answers) => answers.applicationFor === ESTATE_INHERITANCE,
      children: [
        buildSelectField({
          id: 'estateInfoSelection',
          title: m.preDataCollectionChooseEstateSelectTitleDropdown,
          defaultValue: (application: {
            externalData: {
              syslumennOnEntry: {
                data: { inheritanceReportInfos: InheritanceReportInfo[] }
              }
            }
          }) => {
            return (
              application.externalData.syslumennOnEntry?.data as {
                inheritanceReportInfos: Array<InheritanceReportInfo>
              }
            ).inheritanceReportInfos[1]?.caseNumber
          },
          options: (application) => {
            return (
              (
                application.externalData.syslumennOnEntry?.data as {
                  inheritanceReportInfos: Array<InheritanceReportInfo>
                }
              ).inheritanceReportInfos.map((estate) => {
                return {
                  value: estate.caseNumber ?? '',
                  label:
                    `${estate.caseNumber} ${estate.nameOfDeceased} `.trim(),
                }
              }) ?? []
            )
          },
          required: true,
        }),
      ],
    }),
  ],
})
