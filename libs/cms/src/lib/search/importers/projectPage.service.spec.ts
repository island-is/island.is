/**
 * @jest-environment node
 */
import { IProjectPage } from '../../generated/contentfulTypes'
import { ProjectPageSyncService } from './projectPage.service'

const sys = (id: string, contentTypeId: string) => ({
  id,
  createdAt: '2026-01-01T00:00:00.000Z',
  contentType: { sys: { id: contentTypeId } },
})

const projectPage = {
  sys: sys('project-id', 'projectPage'),
  fields: {
    title: 'Project',
    slug: 'project',
    theme: 'default',
    sidebar: false,
    projectSubpages: [
      {
        sys: sys('subpage-id', 'projectSubpage'),
        fields: { title: 'Subpage', slug: 'subpage' },
      },
      {
        sys: sys('subpage-without-slug-id', 'projectSubpage'),
        fields: { title: 'Subpage without a slug' },
      },
    ],
  },
} as unknown as IProjectPage

describe('ProjectPageSyncService', () => {
  const [page, subpage, ...rest] = new ProjectPageSyncService().doMapping([
    projectPage,
  ])

  it('only creates documents for the page and its valid subpages', () => {
    expect(page._id).toBe('project-id')
    expect(subpage._id).toBe('subpage-id')
    expect(rest).toEqual([])
  })

  it('tags both the page and the subpage with the project slug', () => {
    const projectTag = { key: 'project', type: 'project' }
    expect(page.tags).toContainEqual(projectTag)
    expect(subpage.tags).toContainEqual(projectTag)
  })

  it('tags the page with its subpages so changes to them trigger a sync', () => {
    expect(page.tags).toContainEqual({
      key: 'subpage-id',
      type: 'hasChildEntryWithId',
    })
  })

  it('tags the subpage with the page so it can be deleted along with it', () => {
    expect(subpage.tags).toContainEqual({
      key: 'project-id',
      type: 'referencedBy',
    })
  })

  it('maps the subpage to a search result that can link to itself', () => {
    expect(subpage.type).toBe('webProjectSubpage')
    expect(JSON.parse(subpage.response ?? '{}')).toMatchObject({
      typename: 'ProjectSubpage',
      slug: 'subpage',
      projectSlug: 'project',
    })
  })
})
