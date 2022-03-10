function flattenParagraphContent(content: any) {
  var contentText = ''

  for (const node of content) {
    if (node['nodeType']) {
      if (node['nodeType'] === 'text') {
        contentText = contentText + node['value']
      }
    }
  }
  return [
    {
      nodeType: 'text',
      value: contentText,
      marks: [],
      data: {},
    },
  ]
}

// Traverse the RichText node structure depth first
// Collect texts
function traverseNodes(arr: string[], node: any) {
  if (node['nodeType']) {
    if (node['nodeType'] === 'paragraph') {
      node['content'] = flattenParagraphContent(node['content'])
    }
    if (node['nodeType'] === 'text') {
      if (node['value'].length > 0) {
        arr.push(node['value'])
      }
    }
    if (node['content']) {
      for (const contentData of node['content']) {
        traverseNodes(arr, contentData)
      }
    }
  }
  return arr
}

// Traverse depth first and change text data
function reverseTraverse(arr: string[], node: any) {
  if (node['nodeType']) {
    if (node['nodeType'] === 'paragraph') {
      node['content'] = flattenParagraphContent(node['content'])
    }
    if (node['nodeType'] === 'text' && node['value'].trim().length !== 0) {
      // Change data in traversal
      let translation = arr.pop() || ''
      node['value'] = translation
    }
    if (node['content']) {
      for (const contentData of node['content']) {
        reverseTraverse(arr, contentData)
      }
    }
  }
}

// Traverses the richText object and collects text from the text nodeTypes
function extractText(root: any) {
  var texts: string[] = []
  if (root) {
    return traverseNodes(texts, root)
  } else {
    return texts
  }
}

// Must provide 'scaffold' which is simply the icelandic
// richText object being translated. This is so that we
// can keep all the markup while simply changing values
// on the object traversal
// ----
// Reverses an incoming array structure for the richText object,
// replaces text per text nodeType and finally returns
// the altered richText object
function createValue(texts: string[], scaffold: any) {
  // Since this widget takes an array and we are already reverse
  // populating the node-tree in the richText content
  // we do not need to call reverse

  // The scaffold is a reference and as such we must deep-copy it
  const scaffoldCopy = JSON.parse(JSON.stringify(scaffold))
  reverseTraverse(texts, scaffoldCopy)
  return scaffoldCopy
}

export default {
  extractText,
  createValue,
}
