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

export const preSelection = buildSection({
  id: 'deceasedPreselection',
  title: m.irSubmitTitle,
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
      title: m.applicationName,
      children: [
        buildSelectField({
          id: 'estateInfoSelection',
          title: m.preDataCollectionChooseEstateSelectTitle,
          defaultValue: (application: {
            externalData: {
              syslumennOnEntry: {
                data: { inheritanceReportInfo: InheritanceReportInfo[] }
              }
            }
          }) => {
            return (
              application.externalData.syslumennOnEntry?.data as {
                inheritanceReportInfo: Array<InheritanceReportInfo>
              }
            ).inheritanceReportInfo[0].caseNumber
          },
          options: (application) => {
            return (
              application.externalData.syslumennOnEntry?.data as {
                inheritanceReportInfo: Array<InheritanceReportInfo>
              }
            ).inheritanceReportInfo.map((estate) => {
              return {
                value: estate.caseNumber ?? '',
                label: estate.nameOfDeceased ?? '',
              }
            })
          },
          required: true,
        }),
      ],
    }),
  ],
})
