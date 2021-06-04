export interface NodeTypes {
  paragraph?: string
  block_quote?: string
  code_block?: string
  link?: string
  ul_list?: string
  ol_list?: string
  listItem?: string
  heading?: {
    1?: string
    2?: string
    3?: string
    4?: string
    5?: string
    6?: string
  }
  emphasis_mark?: string
  strong_mark?: string
  delete_mark?: string
}

export interface OptionType {
  nodeTypes?: NodeTypes
  linkDestinationKey?: string
}

export interface MdastNode {
  type?: string
  ordered?: boolean
  value?: string
  text?: string
  children?: Array<MdastNode>
  depth?: 1 | 2 | 3 | 4 | 5 | 6
  url?: string
  lang?: string
  // mdast metadata
  position?: any
  spread?: any
  checked?: any
  indent?: any
}

export interface LeafType {
  text?: string
  strikeThrough?: boolean
  bold?: boolean
  italic?: boolean
  parentType?: string
}

export interface BlockType {
  type?: string
  parentType?: string
  link?: string
  language?: string
  break?: boolean
  children: Array<BlockType | LeafType>
}
