import { FormBuilder } from '@island.is/application/core'
import type { DynamicCheck } from '@island.is/application/types'
import { dataSchema } from '../../lib/dataSchema'
import { PlotDetailsApi } from '../../dataProviders'

interface Plot {
  id: string
  name: string
  address: string
  sizeSqm: number
}

const getPlots = (app: any): Plot[] =>
  app.externalData?.getMyPlots?.data?.plots ?? []

const getSelectedPlot = (app: any): Plot | undefined => {
  const plots = getPlots(app)
  return plots.find((p: Plot) => p.id === app.answers?.selectedPlot)
}

type PlotDetailsData = {
  soilType: string
  sunlightExposure: string
  availableTools: string
  neighboringPlots: string
  leaseExpires: string
}

const getPlotDetailsData = (app: any): PlotDetailsData | null =>
  app.externalData?.getPlotDetails?.data ?? null

/**
 * Server-evaluated: only show after a successful getPlotDetails payload.
 * Note: failed template API runs persist `data: {}` — a plain truthy check on `data` would wrongly show this block.
 */
const showWhenPlotDetailsLoaded: DynamicCheck = (_answers, externalData) => {
  const entry = externalData?.getPlotDetails as
    | { status?: string; data?: unknown }
    | undefined
  if (entry?.status !== 'success') return false
  const data = entry.data
  return (
    typeof data === 'object' &&
    data !== null &&
    'soilType' in data &&
    typeof (data as { soilType?: unknown }).soilType === 'string'
  )
}

export const MainForm = new FormBuilder<typeof dataSchema>(
  'gardenEnlargementForm',
  'Garden Plot Enlargement',
)
  .addSection('selectPlot', 'Select Plot', (section) => {
    section.addPage('plotSelection', 'Choose Your Plot', (page) => {
      page
        .addDescriptionField(
          'plotSelectIntro',
          'Select the garden plot you would like to request an enlargement for. The plots listed below are registered to your account.',
        )
        .addSelectField('selectedPlot', 'My garden plots', {
          options: (app: any) =>
            getPlots(app).map((p: Plot) => ({
              label: `${p.name} — ${p.address} (${p.sizeSqm} sqm)`,
              value: p.id,
            })),
          placeholder: 'Select a plot...',
          required: true,
          onSelectRefetch: [PlotDetailsApi.action],
        })
        .addDescriptionField(
          'plotInlineDetailsIntro',
          'Details for the selected plot (loaded when you choose a plot):',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotSoilType',
          'Soil',
          (app: any) => getPlotDetailsData(app)?.soilType ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotSunlight',
          'Sunlight',
          (app: any) => getPlotDetailsData(app)?.sunlightExposure ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotTools',
          'Available tools',
          (app: any) => getPlotDetailsData(app)?.availableTools ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotNeighbors',
          'Neighboring plots',
          (app: any) => getPlotDetailsData(app)?.neighboringPlots ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotLease',
          'Lease until',
          (app: any) => getPlotDetailsData(app)?.leaseExpires ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
    })

    section.addPage('plotDetails', 'Plot Details', (page) => {
      page
        .addDescriptionField(
          'plotDetailsIntro',
          'Here are the details for your selected plot. Review them before proceeding with the enlargement request.',
        )
        .addKeyValueField(
          'plotName',
          'Plot name',
          (app: any) => getSelectedPlot(app)?.name ?? '—',
        )
        .addKeyValueField(
          'plotAddress',
          'Address',
          (app: any) => getSelectedPlot(app)?.address ?? '—',
        )
        .addKeyValueField('plotCurrentSize', 'Current size', (app: any) => {
          const plot = getSelectedPlot(app)
          return plot ? `${plot.sizeSqm} sqm` : '—'
        })
    })
  })
  .addSection('enlargement', 'Enlargement Request', (section) => {
    section.addPage('enlargementDetails', 'Request Details', (page) => {
      page
        .addDescriptionField(
          'enlargementIntro',
          'Specify how large you would like your plot to be and why you need the additional space.',
        )
        .addTextField('requestedSizeSqm', 'Requested new size (sqm)', {
          variant: 'number',
          placeholder: 'Enter the desired total size in square meters',
          required: true,
        })
        .addTextField('enlargementReason', 'Reason for enlargement', {
          variant: 'textarea',
          placeholder:
            'e.g. I need more space for a greenhouse, raised beds, composting area...',
          required: true,
        })
        .addRadioField(
          'needsWaterAccess',
          'Do you need water access for the expanded area?',
          {
            options: [
              { label: 'Yes - I need a water connection', value: 'yes' },
              { label: 'No - I will manage without', value: 'no' },
            ],
            required: true,
          },
        )
        .addSelectField(
          'irrigationType',
          'What type of irrigation do you plan to use?',
          {
            options: [
              { label: 'Drip irrigation', value: 'drip' },
              { label: 'Sprinkler system', value: 'sprinkler' },
              { label: 'Hand watering', value: 'hand' },
              { label: 'Rain barrel collection', value: 'rainBarrel' },
            ],
            placeholder: 'Select irrigation type',
            showWhen: { field: 'needsWaterAccess', equals: 'yes' },
          },
        )
    })
  })
  .addSection('gardenRules', 'Garden Rules', (section) => {
    section.addPage('rulesPage', 'Community Guidelines', (page) => {
      page
        .addDescriptionField(
          'rulesIntro',
          'All gardeners must follow these community guidelines to maintain a healthy and pleasant environment for everyone.',
        )
        .addCheckboxField(
          'acceptedRules',
          'I agree to the following garden rules',
          {
            options: [
              { label: 'Practice composting', value: 'composting' },
              {
                label: 'No pesticides or chemical fertilizers',
                value: 'noPesticides',
              },
              {
                label: 'Maintain shared paths and fences',
                value: 'maintainPaths',
              },
            ],
            required: true,
          },
        )
        .addTextField('additionalNotes', 'Additional notes or requests', {
          variant: 'textarea',
          placeholder:
            'Any special requirements, accessibility needs, or questions?',
        })
    })
  })
  .addSection('contactInfo', 'Contact Information', (section) => {
    section.addPage('contactPage', 'Your Contact Details', (page) => {
      page
        .addDescriptionField(
          'contactIntro',
          'Please provide your contact information so we can reach you about your plot enlargement.',
        )
        .addTextField('name', 'Full name', {
          placeholder: 'e.g. Jón Jónsson',
          required: true,
          width: 'half',
        })
        .addTextField('email', 'Email address', {
          variant: 'email',
          placeholder: 'e.g. jon@example.com',
          required: true,
          width: 'half',
        })
        .addTextField('phone', 'Phone number', {
          variant: 'tel',
          placeholder: 'e.g. 555-1234',
          width: 'half',
        })
        .addRadioField(
          'preferredContact',
          'How would you prefer to be contacted?',
          {
            options: [
              { label: 'Email only', value: 'email' },
              { label: 'Phone only', value: 'phone' },
              { label: 'Either is fine', value: 'either' },
            ],
            required: true,
          },
        )
    })
  })
  .build()
