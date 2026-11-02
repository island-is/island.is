/**
 * @jest-environment node
 */
import { IProjectSubpage } from '../../generated/contentfulTypes'
import { ProjectPageSyncService } from './projectPage.service'
import { ProjectSubpageSyncService } from './projectSubpage.service'

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
    sidebarLinks: [
      {
        sys: sys('link-group-id', 'linkGroup'),
        fields: {
          primaryLink: {
            sys: sys('sibling-subpage-id', 'projectSubpage'),
            fields: { title: 'Sibling', slug: 'sibling' },
          },
        },
      },
    ],
  },
}

const createSubpage = (fields: Record<string, unknown>) =>
  ({
    sys: sys('subpage-id', 'projectSubpage'),
    fields: { title: 'Subpage', slug: 'subpage', projectPage, ...fields },
  } as unknown as IProjectSubpage)

describe('ProjectSubpageSyncService', () => {
  const service = new ProjectSubpageSyncService()

  describe('processSyncData', () => {
    it('indexes a subpage that has a project page', () => {
      const subpage = createSubpage({})
      expect(service.processSyncData([subpage])).toEqual({
        entriesToUpdate: [subpage],
        entriesToDelete: [],
      })
    })

    it.each([
      ['project page', { projectPage: undefined }],
      ['slug', { slug: undefined }],
      ['title', { title: undefined }],
    ])('removes a subpage without a %s from the index', (_, fields) => {
      expect(service.processSyncData([createSubpage(fields)])).toEqual({
        entriesToUpdate: [],
        entriesToDelete: ['subpage-id'],
      })
    })

    it('ignores other content types', () => {
      const entry = { sys: sys('id', 'article'), fields: {} }
      expect(
        service.processSyncData([entry as unknown as IProjectSubpage]),
      ).toEqual({ entriesToUpdate: [], entriesToDelete: [] })
    })
  })

  describe('doMapping', () => {
    const [document] = service.doMapping([createSubpage({})])

    it('maps to a search result that can link to itself', () => {
      expect(document.type).toBe('webProjectSubpage')
      expect(JSON.parse(document.response ?? '{}')).toMatchObject({
        typename: 'ProjectSubpage',
        slug: 'subpage',
        projectSlug: 'project',
      })
    })

    it('tags the document with its project', () => {
      expect(document.tags).toEqual(
        expect.arrayContaining([
          { key: 'project', type: 'project' },
          // Deleted along with the project page
          { key: 'project-id', type: 'referencedBy' },
          // Re-indexed when the project page changes
          { key: 'project-id', type: 'hasChildEntryWithId' },
        ]),
      )
    })

    it('is not tagged with what the project page contains', () => {
      expect(document.tags).not.toContainEqual({
        key: 'sibling-subpage-id',
        type: 'hasChildEntryWithId',
      })
    })
  })
})

describe('ProjectPageSyncService', () => {
  it('tags the page with its project slug', () => {
    const [document] = new ProjectPageSyncService().doMapping([
      projectPage as never,
    ])
    expect(document.tags).toContainEqual({ key: 'project', type: 'project' })
  })
})
