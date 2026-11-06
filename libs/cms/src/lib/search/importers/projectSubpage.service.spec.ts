/**
 * @jest-environment node
 */
import { ProjectSubpageSyncService } from './projectSubpage.service'
import { ProjectParentSubpageSyncService } from './projectParentSubpage.service'

const document = (text: string) => ({
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
    },
  ],
})

const sys = (id: string, contentType: string) => ({
  id,
  type: 'Entry',
  locale: 'is-IS',
  createdAt: '2026-11-01T10:00:00.000Z',
  updatedAt: '2026-11-01T10:00:00.000Z',
  contentType: {
    sys: { id: contentType, type: 'Link', linkType: 'ContentType' },
  },
})

const projectPage = (id: string) => ({
  sys: sys(id, 'projectPage'),
  fields: {
    title: `Project ${id}`,
    slug: id,
    // The project page links back to its subpages, these should not become child entries
    sidebarLinks: [{ sys: sys(`${id}-link-group`, 'linkGroup'), fields: {} }],
  },
})

const subpage = (
  id: string,
  project: ReturnType<typeof projectPage> | undefined,
  fields: Record<string, unknown> = {},
) => ({
  sys: sys(id, 'projectSubpage'),
  fields: {
    title: `Subpage ${id}`,
    slug: id,
    content: document(`This is the content of subpage ${id}`),
    projectPage: project,
    ...fields,
  },
})

const parentSubpage = (
  id: string,
  project: ReturnType<typeof projectPage> | undefined,
  pages: ReturnType<typeof subpage>[],
) => ({
  sys: sys(id, 'projectParentSubpage'),
  fields: {
    internalTitle: id,
    title: `Parent ${id}`,
    slug: id,
    projectPage: project,
    pages,
  },
})

describe('ProjectSubpageSyncService', () => {
  const service = new ProjectSubpageSyncService()
  const project = projectPage('project')

  it('only indexes subpages with a title, a slug and a project page', () => {
    const { entriesToUpdate, entriesToDelete } = service.processSyncData([
      subpage('valid', project),
      subpage('no-project', undefined),
      subpage('no-slug', project, { slug: '  ' }),
      subpage('no-title', project, { title: '' }),
      projectPage('other-type'),
    ] as never)

    expect(entriesToUpdate.map((entry) => entry.sys.id)).toEqual(['valid'])
    expect(entriesToDelete).toEqual(['no-project', 'no-slug', 'no-title'])
  })

  it('maps a subpage to an internal document tagged with its project page', () => {
    const [document] = service.doMapping([subpage('valid', project)] as never)

    expect(document.type).toBe('webProjectSubpage')
    expect(document.content).toContain('This is the content of subpage valid')
    expect(JSON.parse(document.response ?? '')).toEqual({
      typename: 'ProjectSubpage',
      id: 'valid',
      title: 'Subpage valid',
      slug: 'valid',
      projectPageId: 'project',
      projectSlug: 'project',
    })
    expect(document.tags).toContainEqual({
      key: 'project',
      type: 'projectPage',
    })
    // Lets a search be scoped to the project, like an organization search
    expect(document.tags).toContainEqual({
      key: 'project',
      type: 'project',
    })
    // The project page is the parent, not a child
    expect(
      document.tags?.filter((tag) => tag.type === 'hasChildEntryWithId'),
    ).toEqual([])
  })
})

describe('ProjectParentSubpageSyncService', () => {
  const service = new ProjectParentSubpageSyncService()
  const project = projectPage('project')
  const otherProject = projectPage('other')

  it('needs at least one chapter that belongs to the same project page', () => {
    const { entriesToUpdate, entriesToDelete } = service.processSyncData([
      parentSubpage('valid', project, [subpage('chapter', project)]),
      parentSubpage('foreign-chapters', project, [
        subpage('foreign', otherProject),
      ]),
      parentSubpage('no-project', undefined, [subpage('chapter', project)]),
    ] as never)

    expect(entriesToUpdate.map((entry) => entry.sys.id)).toEqual(['valid'])
    expect(entriesToDelete).toEqual(['foreign-chapters', 'no-project'])
  })

  it('is found through the titles and content of its own chapters', () => {
    const [document] = service.doMapping([
      parentSubpage('guide', project, [
        subpage('first', project),
        subpage('foreign', otherProject),
        subpage('second', project),
      ]),
    ] as never)

    expect(document.type).toBe('webProjectParentSubpage')
    expect(document.tags).toContainEqual({ key: 'project', type: 'project' })
    expect(document.content).toContain('Subpage first')
    expect(document.content).toContain('This is the content of subpage second')
    expect(document.content).not.toContain('foreign')

    const response = JSON.parse(document.response ?? '')
    expect(response.chapters).toEqual([
      { id: 'first', title: 'Subpage first', slug: 'first' },
      { id: 'second', title: 'Subpage second', slug: 'second' },
    ])
    expect(
      document.tags
        ?.filter((tag) => tag.type === 'hasChildEntryWithId')
        .map((tag) => tag.key),
    ).toEqual(['first', 'second'])
  })
})
