import { defineTemplateApi } from '@island.is/application/types'

export const MyPlotsApi = defineTemplateApi({
  action: 'getMyPlots',
  order: 1,
})

/** Fetches extra plot metadata when the user selects a plot (SDF inline REFETCH). */
export const PlotDetailsApi = defineTemplateApi({
  action: 'getPlotDetails',
  order: 2,
})
