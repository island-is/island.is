export const BREAK_TAG = '<br>'

export const DEFAULT_NODE_TYPES = {
  paragraph: 'paragraph',
  block_quote: 'block_quote',
  code_block: 'code_block',
  link: 'link',
  ul_list: 'ul_list',
  ol_list: 'ol_list',
  listItem: 'list_item',
  heading: {
    1: 'heading_one',
    2: 'heading_two',
    3: 'heading_three',
    4: 'heading_four',
    5: 'heading_five',
    6: 'heading_six',
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikeThrough',
}

export const EMPTY_STATE = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
]

export const LIST_TYPES = [
  DEFAULT_NODE_TYPES.ul_list,
  DEFAULT_NODE_TYPES.ol_list,
]
