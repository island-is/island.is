export const slateNodes = [
  { type: 'heading_one', children: [{ text: 'h1 Heading' }] },
  { type: 'heading_two', children: [{ text: 'h2 Heading' }] },
  {
    type: 'paragraph',
    children: [
      { text: 'Some paragraph with a ' },
      { text: 'bold', bold: true },
      { text: ' copy' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Some paragraph with an ' },
      { text: 'italic', italic: true },
      { text: ' copy' },
    ],
  },
  { type: 'heading_two', children: [{ text: 'Lists' }] },
  { type: 'paragraph', children: [{ text: 'Unordered' }] },
  {
    type: 'ul_list',
    children: [
      {
        type: 'list_item',
        children: [
          { text: 'Create a list by starting a line with +, -, or *' },
        ],
      },
      {
        type: 'list_item',
        children: [{ text: 'Ac tristique libero volutpat at' }],
      },
      {
        type: 'list_item',
        children: [{ text: 'Facilisis in pretium nisl aliquet' }],
      },
      {
        type: 'list_item',
        children: [{ text: 'Nulla volutpat aliquam velit' }],
      },
      { type: 'list_item', children: [{ text: 'Very easy!' }] },
    ],
  },
  { type: 'paragraph', children: [{ text: 'Ordered' }] },
  {
    type: 'ol_list',
    children: [
      {
        type: 'list_item',
        children: [{ text: 'Lorem ipsum dolor sit amet' }],
      },
      {
        type: 'list_item',
        children: [{ text: 'Consectetur adipiscing elit' }],
      },
      {
        type: 'list_item',
        children: [{ text: 'Integer molestie lorem at massa' }],
      },
      {
        type: 'list_item',
        children: [{ text: 'You can use sequential numbers...' }],
      },
      {
        type: 'list_item',
        children: [{ text: '...or keep all the numbers as 1.' }],
      },
    ],
  },
  { type: 'heading_two', children: [{ text: 'Links' }] },
  {
    type: 'paragraph',
    children: [
      { text: 'A ' },
      {
        type: 'link',
        url: 'https://island.is',
        children: [{ text: 'link' }],
      },
      { text: ' in a sentence.' },
    ],
  },
]
