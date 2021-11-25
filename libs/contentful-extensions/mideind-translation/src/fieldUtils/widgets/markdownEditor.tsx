const starterSymbols = ['#', '>', '-']
const ignoreSymbols = ['|', '\n', '!']
const formatSymbols = ['_', '~', '*']

// flatten decides whether inline text formatting is removed or not.
// flatten as true, results in better machine translation quality
const flatten = true // Remains for testing purposes and future configurability

interface MarkdownNode {
  type: 'text' | 'formatting' | 'ignore' | 'starter' | 'ordered-list'
  symbol?: string
  left?: MarkdownNode | string
  right?: MarkdownNode
}

// Recursively parses a markdown string into a tree structure
function addNode(line: string, depth = 0): MarkdownNode {
  const symbol = line[0]
  if (ignoreSymbols.includes(symbol) || line.length === 0) {
    // Do not change tables and empty lines
    return {
      type: 'ignore',
      left: line,
    }
  } else if (starterSymbols.includes(symbol)) {
    // Headings, quotes and unordered lists
    return {
      type: 'starter',
      symbol: symbol,
      left: addNode(line.substr(1), depth + 1),
    }
  } else if (line.match(/^\d+\. /) && depth === 0) {
    // Ordered lists
    const match = line.match(/^\d+\. /) as RegExpMatchArray
    return {
      type: 'ordered-list',
      symbol: match[0],
      left: addNode(line.substr(match[0].length), depth + 1),
    }
  } else if (formatSymbols.includes(symbol)) {
    // Formatting characters
    const formatSymbol = formatSymbols[formatSymbols.indexOf(symbol)]
    const modifier = formatSymbol === '*' ? 1 : 2
    const formatRegex = new RegExp(
      `${('\\' + formatSymbol).repeat(modifier)}`,
      'g',
    )
    const matches = Array.from(line.matchAll(formatRegex)) as any[]

    if (matches && matches.length >= 2) {
      const start = matches[0].index
      const end = matches[1].index
      return {
        type: 'formatting',
        symbol: formatSymbol.repeat(modifier),
        left: addNode(line.substr(start + 2, end - start - 2), depth + 1),
        right: addNode(line.substr(end + 2), depth + 1),
      }
    } else {
      // Bad formatting is best ignored
      return {
        type: 'ignore',
        left: line,
      }
    }
  } else {
    // Text node
    const indices = []
    let text = line
    let rest = ''

    for (const formatSymbol of formatSymbols) {
      const formatIndex = line.indexOf(formatSymbol)
      if (formatIndex !== -1) {
        indices.push(formatIndex)
      }
    }

    if (indices.length > 0) {
      const split = Math.min(...indices)
      text = line.substr(0, split)
      rest = line.substr(split)
    }

    return {
      type: 'text',
      left: text,
      right: addNode(rest),
    }
  }
}

// concatenates markdown notes in preorder, reintroduces symbols if applicable
function linesToStringHelper(node: MarkdownNode, deep = false): string {
  if (node.type === 'text' || node.type === 'ignore') {
    if (node.right) {
      return (node.left as string) + linesToStringHelper(node.right, true)
    }
    return node.left as string
  } else {
    if (node.left) {
      let leftValue =
        node.type === 'formatting'
          ? `${deep ? ' ' : ''}${node.symbol}${linesToStringHelper(
              node.left as MarkdownNode,
              true,
            )}${node.symbol} `
          : node.type === 'starter' || node.type === 'ordered-list'
          ? `${node.symbol}${linesToStringHelper(
              node.left as MarkdownNode,
              true,
            )}`
          : linesToStringHelper(node.left as MarkdownNode, true)

      if (node.right) {
        return leftValue + linesToStringHelper(node.right as MarkdownNode, true)
      }
      return leftValue
    }
    if (node.right) {
      return linesToStringHelper(node.right, true)
    }
  }
  return ''
}

// Generates markdown string from a left-right markdown tree
function linesToString(lines: MarkdownNode[]) {
  let results = []
  for (const tree of lines) {
    results.push(linesToStringHelper(tree))
  }
  return results.join('\n')
}

// Returns a left-right markdown tree
function parseMarkdown(markdown: string) {
  const lines = markdown.split('\n').map((line) => line.trim())
  const parsedLines = []
  for (let line of lines) {
    if (flatten && !ignoreSymbols.includes(line[0])) {
      const re = new RegExp(`[${formatSymbols.join('\\')}]`, 'g')
      line = line.replace(re, '')
    }
    parsedLines.push(addNode(line))
  }
  return parsedLines
}

// Helper function that pushes texts in preOrder down a left-right markdown tree
function preOrderPush(tree: MarkdownNode, texts: string[], previous = '') {
  if (tree.type && tree.type === 'text') {
    tree.left = previous === 'starter' ? ' ' + texts.pop() : texts.pop()
  } else {
    if (tree.left) {
      preOrderPush(tree.left as MarkdownNode, texts, tree.type)
    }
  }
  if (tree.right) {
    preOrderPush(tree.right, texts, tree.type)
  }
}

// Replaces markdown textnodes with values from texts
function pushTree(lines: MarkdownNode[], texts: string[]) {
  for (const tree of lines) {
    preOrderPush(tree, texts)
  }
  return lines
}

function preOrderExtract(tree: MarkdownNode, texts: string[]) {
  if (tree.type && tree.type === 'text') {
    texts.push(tree.left as string)
  } else {
    if (tree.left) {
      preOrderExtract(tree.left as MarkdownNode, texts)
    }
  }
  if (tree.right) {
    preOrderExtract(tree.right, texts)
  }
}

function extractTree(lines: MarkdownNode[]) {
  const texts: string[] = []
  for (const tree of lines) {
    preOrderExtract(tree, texts)
  }
  return texts
}

function extractText(markdown: string) {
  const nodes = parseMarkdown(markdown)
  return extractTree(nodes)
}

// Similar to richTextEditor.tsx
function createValue(texts: string[], scaffold: string) {
  const treeScaffold = parseMarkdown(scaffold)
  const lines = pushTree(treeScaffold, texts)
  return linesToString(lines)
}

export default {
  extractText,
  createValue,
}
