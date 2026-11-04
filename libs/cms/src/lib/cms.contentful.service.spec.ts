/**
 * @jest-environment node
 */
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { mapProjectPage } from './models/projectPage.model'

jest.mock('./models/projectPage.model', () => ({
  ...jest.requireActual('./models/projectPage.model'),
  mapProjectPage: jest.fn(),
}))

const projectPage = { sys: { id: 'project-page-id' }, fields: {} }
const subpage = { sys: { id: 'subpage-id' }, fields: { title: 'Subpage' } }

describe('CmsContentfulService.getProjectPage', () => {
  const getLocalizedEntries = jest.fn()
  const service = new CmsContentfulService({
    getLocalizedEntries,
  } as unknown as ContentfulRepository)

  beforeEach(() => {
    jest.clearAllMocks()
    getLocalizedEntries.mockResolvedValueOnce({ items: [projectPage] })
  })

  it('does not fetch any subpage if no subpage slug is provided', async () => {
    await service.getProjectPage('project', 'is')

    expect(getLocalizedEntries).toHaveBeenCalledTimes(1)
    expect(mapProjectPage).toHaveBeenCalledWith(projectPage)
  })

  it('only fetches the requested subpage of the project page', async () => {
    getLocalizedEntries.mockResolvedValueOnce({ items: [subpage] })

    await service.getProjectPage('project', 'is', 'subpage')

    expect(getLocalizedEntries).toHaveBeenLastCalledWith(
      'is',
      {
        content_type: 'projectSubpage',
        'fields.projectPage.sys.id': 'project-page-id',
        'fields.slug': 'subpage',
        limit: 1,
      },
      5,
    )
    expect(mapProjectPage).toHaveBeenCalledWith(projectPage, [subpage])
  })

  it('returns no subpages if the subpage is not found', async () => {
    getLocalizedEntries.mockResolvedValueOnce({ items: [] })

    await service.getProjectPage('project', 'is', 'unknown')

    expect(mapProjectPage).toHaveBeenCalledWith(projectPage, [])
  })

  it('returns null without fetching subpages if the project page is not found', async () => {
    getLocalizedEntries.mockReset()
    getLocalizedEntries.mockResolvedValueOnce({ items: [] })

    await expect(
      service.getProjectPage('unknown', 'is', 'subpage'),
    ).resolves.toBeNull()
    expect(getLocalizedEntries).toHaveBeenCalledTimes(1)
  })
})
