import { Entry } from '@contentful/field-editor-shared';

interface Fields {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [localeKey: string]: any;
  };
}

export const createEntry = (contentTypeId: string, fields: Fields): Entry => ({
  fields,
  sys: {
    id: `entry-${Math.round(Math.random() * 1000)}`,
    type: 'Entry',
    space: { sys: { id: 'space', type: 'Link', linkType: 'Space' } },
    environment: { sys: { id: 'e123', type: 'Link', linkType: 'Environment' } },
    version: 2,
    publishedVersion: 2,
    publishedCounter: 1,
    createdAt: '2020-02-15T17:41:01.000Z',
    updatedAt: '2020-02-17T20:20:01.000Z',
    publishedAt: '2020-02-18T17:41:01.000Z',
    firstPublishedAt: '2020-02-18T17:41:01.000Z',
    createdBy: { sys: { id: 'u123', type: 'Link', linkType: 'User' } },
    updatedBy: { sys: { id: 'u123', type: 'Link', linkType: 'User' } },
    publishedBy: { sys: { id: 'u123', type: 'Link', linkType: 'User' } },
    contentType: { sys: { id: contentTypeId, type: 'Link', linkType: 'ContentType' } }
  }
});
