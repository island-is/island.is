import {
  createSourceFile,
  ScriptTarget,
  SyntaxKind,
  Node as INode,
  SourceFile as ISourceFile,
  isPropertySignature,
  isInterfaceDeclaration,
  isIdentifier,
} from 'typescript'
import { readFileSync } from 'fs'

// Read the contentful schema and generate a syntax tree
const readFile = readFileSync(
  'libs/cms/src/lib/generated/contentfulTypes.d.ts',
).toString()
const sourceFile = createSourceFile('temp.ts', readFile, ScriptTarget.Latest)

const collectInterfaceProperties = (
  node: INode,
  name: string,
): Array<[string, boolean]> => {
  // On typescript interface declaration
  // For any selected IContentModelFields
  if (
    isInterfaceDeclaration(node) &&
    node.name.text.toLowerCase() === `i${name}fields`
  ) {
    // For each PropertySignature of the interface
    const properties: Array<[string, boolean]> = []
    node.forEachChild((psCandidate) => {
      if (isPropertySignature(psCandidate)) {
        // Gather property and its requirements
        let pRequired = true
        let pName = ''
        psCandidate.forEachChild((pChild) => {
          if (isIdentifier(pChild)) {
            pName = pChild.text
          } else if (SyntaxKind[pChild.kind] === 'QuestionToken') {
            pRequired = false
          }
        })
        properties.push([pName, pRequired])
      }
    })
    return properties
  }

  // Iterate over the typescript AST of the contentful schema
  for (const astNode of node.getChildren(sourceFile)) {
    const candidate = collectInterfaceProperties(astNode, name)
    if (candidate.length) {
      return candidate
    }
  }
  return []
}

// Input:
//   modelName: any content model, f.x. 'AccordionSlice' or 'news'
export const getContentfulInterface = (
  modelName: string,
): Array<[string, boolean]> => {
  return collectInterfaceProperties(sourceFile, modelName.toLowerCase())
}
