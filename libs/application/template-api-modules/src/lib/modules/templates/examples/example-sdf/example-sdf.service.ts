import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'

@Injectable()
export class ExampleSdfService extends BaseTemplateApiService {
  constructor() {
    super(ApplicationTypes.EXAMPLE_SDF)
  }

  async getMyPlots({ application }: TemplateApiModuleActionProps) {
    return {
      plots: [
        {
          id: 'plot-001',
          name: 'Sólgarður A12',
          address: 'Laugavegur 15, 101 Reykjavík',
          sizeSqm: 45,
        },
        {
          id: 'plot-002',
          name: 'Blómabeð B7',
          address: 'Hverfisgata 22, 101 Reykjavík',
          sizeSqm: 30,
        },
        {
          id: 'plot-003',
          name: 'Gróðurhús C3',
          address: 'Skólavörðustígur 8, 101 Reykjavík',
          sizeSqm: 60,
        },
      ],
    }
  }

  /**
   * Enriched plot metadata for the plot currently selected in answers (inline REFETCH demo).
   */
  async getPlotDetails({ application }: TemplateApiModuleActionProps) {
    const selectedPlotId = (application.answers as { selectedPlot?: string })
      ?.selectedPlot

    //timeout for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const detailsByPlot: Record<
      string,
      {
        soilType: string
        sunlightExposure: string
        availableTools: string
        neighboringPlots: string
        leaseExpires: string
      }
    > = {
      'plot-001': {
        soilType: 'Loamy sand, pH 6.2',
        sunlightExposure: 'Full sun (south-facing)',
        availableTools: 'Wheelbarrow, compost bin, shared hose',
        neighboringPlots: 'A11 (Jón), A13 (Maria)',
        leaseExpires: '2027-03-31',
      },
      'plot-002': {
        soilType: 'Clay loam',
        sunlightExposure: 'Partial shade (morning sun)',
        availableTools: 'Hand tools cabinet, water tap nearby',
        neighboringPlots: 'B6, B8',
        leaseExpires: '2026-12-15',
      },
      'plot-003': {
        soilType: 'Raised beds — imported topsoil',
        sunlightExposure: 'Greenhouse — diffused light',
        availableTools: 'Electric outlet, potting bench',
        neighboringPlots: 'C2, C4',
        leaseExpires: '2028-01-20',
      },
    }

    if (!selectedPlotId) {
      return null
    }

    return detailsByPlot[selectedPlotId] ?? null
  }
}
