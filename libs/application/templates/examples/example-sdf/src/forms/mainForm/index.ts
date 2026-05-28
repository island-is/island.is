import {
  expr,
  FormBuilder,
  getSuccessfulExternalData,
  hasSuccessfulExternalData,
  serverExpr,
} from '@island.is/application/core'
import type { Application, DynamicCheck } from '@island.is/application/types'
import { dataSchema, type ExampleSdfAnswers } from '../../lib/dataSchema'
import { MyPlotsApi, PlotDetailsApi } from '../../dataProviders'

interface Plot {
  id: string
  name: string
  address: string
  sizeSqm: number
}

const isPlotsPayload = (data: unknown): data is { plots: Plot[] } => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'plots' in data &&
    Array.isArray((data as { plots: unknown }).plots)
  )
}

const getPlots = (app: Application): Plot[] => {
  return (
    getSuccessfulExternalData(
      app.externalData,
      MyPlotsApi.action,
      isPlotsPayload,
    )?.plots ?? []
  )
}

const getSelectedPlot = (app: Application): Plot | undefined => {
  const plots = getPlots(app)
  const answers = app.answers as ExampleSdfAnswers
  return plots.find((p) => p.id === answers.selectedPlot)
}

type PlotDetailsData = {
  soilType: string
  sunlightExposure: string
  availableTools: string
  neighboringPlots: string
  leaseExpires: string
}

const isPlotDetailsData = (data: unknown): data is PlotDetailsData => {
  if (typeof data !== 'object' || data === null) return false
  const o = data as Record<string, unknown>
  return (
    typeof o.soilType === 'string' &&
    typeof o.sunlightExposure === 'string' &&
    typeof o.availableTools === 'string' &&
    typeof o.neighboringPlots === 'string' &&
    typeof o.leaseExpires === 'string'
  )
}

const getPlotDetailsData = (app: Application): PlotDetailsData | null => {
  return (
    getSuccessfulExternalData(
      app.externalData,
      PlotDetailsApi.action,
      isPlotDetailsData,
    ) ?? null
  )
}

/**
 * Server-evaluated: only show after a successful getPlotDetails payload.
 * Note: failed template API runs persist `data: {}` — a plain truthy check on `data` would wrongly show this block.
 */
const showWhenPlotDetailsLoaded: DynamicCheck = (_answers, externalData) => {
  return hasSuccessfulExternalData(
    externalData,
    PlotDetailsApi.action,
    isPlotDetailsData,
  )
}

export const MainForm = new FormBuilder<typeof dataSchema>(
  'gardenEnlargementForm',
  'Garden Plot Enlargement',
)
  .addSection('uploadDocuments', 'Upload Documents', (section) => {
    section.addPage('uploadDocuments', 'Upload Documents', (page) => {
      page.addFileUploadField('documents', 'Documents', {
        uploadMultiple: true,
        uploadAccept: '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
        uploadButtonLabel: 'Upload documents',
        uploadDescription:
          'Upload the documents you want to submit with your request.',
        uploadHeader: 'Documents',
        introduction:
          'Upload the documents you want to submit with your request.',
        maxSize: 10 * 1024 * 1024, // 10MB
        maxSizeErrorText:
          'The document is too large. The maximum size is 10MB.',
        doesNotRequireAnswer: false,
      })
    })
  })
  .addSection('selectPlot', 'Select Plot', (section) => {
    section.addPage('plotSelection', 'Choose Your Plot', (page) => {
      page
        .addDescriptionField(
          'plotSelectIntro',
          'Select the garden plot you would like to request an enlargement for. The plots listed below are registered to your account.',
        )
        .addSelectField('selectedPlot', 'My garden plots', {
          options: (app: Application) =>
            getPlots(app).map((p) => ({
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
          (app) => getPlotDetailsData(app)?.soilType ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotSunlight',
          'Sunlight',
          (app) => getPlotDetailsData(app)?.sunlightExposure ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotTools',
          'Available tools',
          (app) => getPlotDetailsData(app)?.availableTools ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotNeighbors',
          'Neighboring plots',
          (app) => getPlotDetailsData(app)?.neighboringPlots ?? '—',
          { showWhen: showWhenPlotDetailsLoaded },
        )
        .addKeyValueField(
          'plotLease',
          'Lease until',
          (app) => getPlotDetailsData(app)?.leaseExpires ?? '—',
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
          (app) => getSelectedPlot(app)?.name ?? '—',
        )
        .addKeyValueField(
          'plotAddress',
          'Address',
          (app) => getSelectedPlot(app)?.address ?? '—',
        )
        .addKeyValueField('plotCurrentSize', 'Current size', (app) => {
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
            clientShowWhen: expr.equals(expr.get('needsWaterAccess'), 'yes'),
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
