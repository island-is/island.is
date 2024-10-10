export interface GrantFields {
  id: string
  name: string
}

export const EXAMPLE = {
  name: 'Grant',
  description: 'Grant is a part of "Styrkjatorg".',
  displayField: 'grantName',
  fields: [
    {
      id: 'grantName',
      name: 'Nafn á styrk',
      type: 'Symbol',
      localized: true,
      required: true,
      validations: [],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantDescription',
      name: 'Örlýsing',
      type: 'RichText',
      localized: true,
      required: false,
      validations: [
        {
          size: {
            max: 180,
          },
        },
        {
          enabledMarks: [],
          message: 'Marks are not allowed',
        },
        {
          enabledNodeTypes: [],
          message: 'Nodes are not allowed',
        },
        {
          nodes: {},
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantCategory',
      name: 'Flokkur',
      type: 'Symbol',
      localized: true,
      required: false,
      validations: [
        {
          unique: true,
        },
        {
          in: [
            'Alþjóðlegt',
            'Atvinnulíf',
            'Innlent',
            'Menning og listir',
            'Nám og kennsla',
            'Nýsköpun',
            'Rannsóknir',
            'Starfs- og símenntun',
            'Æskulýðsstarf og íþróttir',
          ],
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantType',
      name: 'Tegund',
      type: 'Symbol',
      localized: true,
      required: true,
      validations: [
        {
          in: ['Verkefnastyrkur'],
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantWhatIsGranted',
      name: 'Hvað er styrkt?',
      type: 'RichText',
      localized: true,
      required: false,
      validations: [
        {
          enabledMarks: [],
          message: 'Marks are not allowed',
        },
        {
          enabledNodeTypes: [],
          message: 'Nodes are not allowed',
        },
        {
          nodes: {},
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantSpecialEmphasis',
      name: 'Sérstakar áherslur',
      type: 'RichText',
      localized: true,
      required: false,
      validations: [
        {
          enabledMarks: [],
          message: 'Marks are not allowed',
        },
        {
          enabledNodeTypes: ['unordered-list'],
          message: 'Only unordered list nodes are allowed',
        },
        {
          nodes: {},
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantWhoCanApply',
      name: 'Hverjir geta sótt um?',
      type: 'RichText',
      localized: true,
      required: false,
      validations: [
        {
          enabledMarks: [],
          message: 'Marks are not allowed',
        },
        {
          enabledNodeTypes: ['unordered-list'],
          message: 'Only unordered list nodes are allowed',
        },
        {
          nodes: {},
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantHowToApply',
      name: 'Hvernig er sótt um?',
      type: 'RichText',
      localized: true,
      required: false,
      validations: [
        {
          enabledMarks: [],
          message: 'Marks are not allowed',
        },
        {
          enabledNodeTypes: ['hyperlink', 'entry-hyperlink', 'asset-hyperlink'],
          message:
            'Only link to Url, link to entry, and link to asset nodes are allowed',
        },
        {
          nodes: {},
        },
      ],
      disabled: false,
      omitted: false,
    },
    {
      id: 'grantApplicationDeadline',
      name: 'Umsóknarfrestur',
      type: 'RichText',
      localized: true,
      required: false,
      validations: [
        {
          enabledMarks: [],
          message: 'Marks are not allowed',
        },
        {
          enabledNodeTypes: [
            'unordered-list',
            'hyperlink',
            'entry-hyperlink',
            'asset-hyperlink',
          ],
          message:
            'Only unordered list, link to Url, link to entry, and link to asset nodes are allowed',
        },
        {
          nodes: {},
        },
      ],
      disabled: false,
      omitted: false,
    },
  ],
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '8k0h54kbe6bj',
      },
    },
    id: 'grant',
    type: 'ContentType',
    createdAt: '2024-10-02T13:36:15.055Z',
    updatedAt: '2024-10-04T10:12:36.897Z',
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    publishedVersion: 19,
    publishedAt: '2024-10-04T10:12:36.897Z',
    firstPublishedAt: '2024-10-02T13:36:16.090Z',
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '76OGzf3smZ40fqEa9iR8aJ',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '76OGzf3smZ40fqEa9iR8aJ',
      },
    },
    publishedCounter: 10,
    version: 20,
    publishedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '76OGzf3smZ40fqEa9iR8aJ',
      },
    },
    urn: 'crn:contentful:::content:spaces/8k0h54kbe6bj/environments/master/content_types/grant',
  },
}
