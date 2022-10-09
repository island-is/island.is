import { useState } from 'react'
import { PowerBIEmbed } from 'powerbi-client-react'
import { models } from 'powerbi-client'
import { Box, Button } from '@island.is/island-ui/core'
import * as styles from './PowerBiSlice.css'
import {
  IEmbedConfiguration,
  IQnaEmbedConfiguration,
  IVisualEmbedConfiguration,
  IReportEmbedConfiguration,
  IDashboardEmbedConfiguration,
  ITileEmbedConfiguration,
  Report,
  VisualDescriptor,
} from 'powerbi-client'

interface PowerBiSliceProps {
  embedPropsString?: string
}

export const PowerBiSlice = ({ embedPropsString }: PowerBiSliceProps) => {
  const [report, setReport] = useState<Report>()
  type embedConfigType =
    | IReportEmbedConfiguration
    | IDashboardEmbedConfiguration
    | ITileEmbedConfiguration
    | IQnaEmbedConfiguration
    | IVisualEmbedConfiguration
    | IEmbedConfiguration
  const defaultEmbedProps: embedConfigType = {
    // TODO: Read report ID from Contentful.
    // The Report ID can be found in the URL when viewing the report at https://app.powerbi.com/
    id: '',

    // TODO: Implement logic that retrieves a token of type Embeded token. Look into https://learn.microsoft.com/en-us/rest/api/power-bi/embed-token/reports-generate-token-in-group
    //       For the prototype, we use a token of type Azure Active Directory type (AAD) and
    //       aquire the token by manually logging into https://app.powerbi.com/, opening
    //       the browser developer console and run `copy(powerBIAccessToken)`.
    tokenType: models.TokenType.Aad,
    accessToken: '',

    // TODO: Find out if the embedUrl is constant or not. If it's contant, read it from Contentful. If not, implement logic
    //       that fetches it, e.g. using GET https://api.powerbi.com/v1.0/myorg/groups/{groupId}/reports/{reportId},
    //       see https://learn.microsoft.com/en-us/rest/api/power-bi/reports/get-report-in-group
    embedUrl: '',
    settings: {
      filterPaneEnabled: false,
      navContentPaneEnabled: true,
    },
  }

  try {
    const embedProps = embedPropsString
      ? JSON.parse(embedPropsString)
      : defaultEmbedProps
    return (
      <Box>
        <Button
          onClick={() => {
            console.log('Report:', report)
            report
              .getActivePage()
              .then((page) => {
                console.log('Page:', page)
                page
                  .getVisuals()
                  .then((visuals) => {
                    console.log('Page visuals', visuals)
                  })
                  .catch((err) => console.error(err))
                page
                  .getSlicers()
                  .then((slicers) => {
                    console.log('Page slicers', slicers)
                    slicers.forEach((slicer) => {
                      ;(slicer as VisualDescriptor)
                        .getSlicerState()
                        .then((slicerState) => {
                          console.log('Slicer State:', slicerState)
                        })
                        .catch((err) => console.error(err))
                    })
                  })
                  .catch((err) => console.error(err))
              })
              .catch((err) => console.error(err))
          }}
        >
          Log info
        </Button>
        <Button
          onClick={() => {
            console.log('Report:', report)
            report
              .getActivePage()
              .then((page) => {
                page
                  .getSlicers()
                  .then((slicers) => {
                    console.log('Page slicers', slicers)
                    slicers.forEach((slicer) => {
                      ;(slicer as VisualDescriptor).setSlicerState({
                        filters: [] as models.ISlicerFilter[],
                        targets: [] as models.SlicerTarget[],
                      })
                    })
                  })
                  .catch((err) => console.error(err))
              })
              .catch((err) => console.error(err))
          }}
        >
          Clear slicers
        </Button>
        <Button
          onClick={() => {
            console.log('Report:', report)
            report
              .getActivePage()
              .then((page) => {
                page
                  .getSlicers()
                  .then((slicers) => {
                    console.log('Page slicers', slicers)
                    slicers.forEach((slicer) => {
                      if (slicer.name === '7edf7727f83190d5750a')
                        (slicer as VisualDescriptor)
                          .getSlicerState()
                          .then((slicerState) => {
                            ;(slicer as VisualDescriptor).setSlicerState({
                              filters: [
                                {
                                  $schema: slicerState.filters[0].$schema,
                                  filterType: slicerState.filters[0].filterType,
                                  operator: 'In',
                                  target: {
                                    column: 'Skip nafn og númer',
                                    table: 'Skipasaga',
                                  },
                                  values: ['Álsey VE-2 (3000)'],
                                },
                              ] as models.IBasicFilter[],
                              targets: [] as models.SlicerTarget[],
                            })
                          })
                          .catch((err) => console.error(err))
                    })
                  })
                  .catch((err) => console.error(err))
              })
              .catch((err) => console.error(err))
          }}
        >
          Álsey VE-2 (3000)
        </Button>
        <Button
          onClick={() => {
            console.log('Report:', report)
            report
              .getActivePage()
              .then((page) => {
                page
                  .getSlicers()
                  .then((slicers) => {
                    console.log('Page slicers', slicers)
                    slicers.forEach((slicer) => {
                      if (slicer.name === '7edf7727f83190d5750a')
                        (slicer as VisualDescriptor)
                          .getSlicerState()
                          .then((slicerState) => {
                            ;(slicer as VisualDescriptor).setSlicerState({
                              filters: [
                                {
                                  $schema: slicerState.filters[0].$schema,
                                  filterType: slicerState.filters[0].filterType,
                                  operator: 'In',
                                  target: {
                                    column: 'Skip nafn og númer',
                                    table: 'Skipasaga',
                                  },
                                  values: ['Vilhelm Þorsteinsson EA-11 (2982)'],
                                },
                              ] as models.IBasicFilter[],
                              targets: [] as models.SlicerTarget[],
                            })
                          })
                          .catch((err) => console.error(err))
                    })
                  })
                  .catch((err) => console.error(err))
              })
              .catch((err) => console.error(err))
          }}
        >
          Vilhelm Þorsteinsson EA-11 (2982)
        </Button>
        <Button
          onClick={() => {
            console.log('Report:', report)
            report
              .getActivePage()
              .then((page) => {
                page
                  .getSlicers()
                  .then((slicers) => {
                    console.log('Page slicers', slicers)
                    slicers.forEach((slicer) => {
                      if (slicer.name === '7edf7727f83190d5750a')
                        (slicer as VisualDescriptor)
                          .getSlicerState()
                          .then((slicerState) => {
                            ;(slicer as VisualDescriptor).setSlicerState({
                              filters: [
                                {
                                  $schema: slicerState.filters[0].$schema,
                                  filterType: slicerState.filters[0].filterType,
                                  operator: 'In',
                                  target: {
                                    column: 'Skip nafn og númer',
                                    table: 'Skipasaga',
                                  },
                                  values: ['Ljósafell SU-70 (1277)'],
                                },
                              ] as models.IBasicFilter[],
                              targets: [] as models.SlicerTarget[],
                            })
                          })
                          .catch((err) => console.error(err))
                    })
                  })
                  .catch((err) => console.error(err))
              })
              .catch((err) => console.error(err))
          }}
        >
          Ljósafell SU-70 (1277)
        </Button>
        <PowerBIEmbed
          embedConfig={{ type: 'report', ...embedProps }}
          cssClassName={styles.powerBiContainer}
          eventHandlers={
            new Map([
              [
                'loaded',
                function (loadedEvent) {
                  console.log('Report loaded', loadedEvent)
                },
              ],
              [
                'rendered',
                function () {
                  console.log('Report rendered')
                },
              ],
              [
                'error',
                function (event) {
                  console.log(event.detail)
                },
              ],
            ])
          }
          getEmbeddedComponent={(embeddedReport) => {
            setReport(embeddedReport as Report)
          }}
        />
      </Box>
    )
  } catch (err) {
    console.error(err)
    return null
  }
}

export default PowerBiSlice
