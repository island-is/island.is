import { readdirSync, readFileSync, statSync } from 'fs'
import type {
  FragmentDefinitionNode,
  OperationDefinitionNode,
  SelectionSetNode,
} from 'graphql'
import { Kind, parse } from 'graphql'
import { join, relative } from 'path'

// Snapshot of every field path each GraphQL operation in this app selects,
// with fragment spreads resolved. It records what is actually fetched, so
// extracting a fragment must leave it unchanged, and any change shows exactly
// which fields an operation gained or lost. Update it with `-u` only after
// reviewing that diff.

// Operation names that are defined in more than one document today. Codegen
// tolerates this because it generates per file, but anything that matches on
// operation name - Apollo's refetchQueries by name, the e2e suite's request
// matcher - cannot tell the two apart. Remove an entry here once the duplicate
// is renamed; do not add to it.
const KNOWN_DUPLICATE_OPERATION_NAMES = ['PoliceDigitalCaseFiles']

const SRC_DIR = join(__dirname, '..')

interface Operation {
  file: string
  node: OperationDefinitionNode
}

const collectGraphqlFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)

    if (statSync(path).isDirectory()) {
      return collectGraphqlFiles(path)
    }

    return path.endsWith('.graphql') ? [path] : []
  })

const fragments = new Map<string, FragmentDefinitionNode>()
const operationsByName = new Map<string, Operation[]>()

for (const file of collectGraphqlFiles(SRC_DIR)) {
  const where = relative(SRC_DIR, file)
  const document = parse(readFileSync(file, 'utf8'))

  for (const definition of document.definitions) {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      const name = definition.name.value

      if (fragments.has(name)) {
        throw new Error(`Fragment ${name} is defined more than once (${where})`)
      }

      fragments.set(name, definition)
    } else if (definition.kind === Kind.OPERATION_DEFINITION) {
      const name = definition.name?.value

      if (!name) {
        throw new Error(`Unnamed ${definition.operation} in ${where}`)
      }

      operationsByName.set(name, [
        ...(operationsByName.get(name) ?? []),
        { file: where, node: definition },
      ])
    }
  }
}

// Unique names key the snapshot directly; a duplicated name is keyed by its
// file as well so the two entries stay apart.
const operations = new Map<string, OperationDefinitionNode>()

for (const [name, definitions] of operationsByName) {
  for (const { file, node } of definitions) {
    operations.set(definitions.length === 1 ? name : `${name} (${file})`, node)
  }
}

const collectFieldPaths = (
  selectionSet: SelectionSetNode,
  prefix: string,
  paths: Set<string>,
  spreading: Set<string>,
) => {
  for (const selection of selectionSet.selections) {
    switch (selection.kind) {
      case Kind.FIELD: {
        // An alias only renames the response key; the field still resolves
        // by name. Record both so repointing an alias at another field shows
        // up in the snapshot.
        const name = selection.name.value
        const alias = selection.alias?.value
        const path = `${prefix}${alias ? `${alias}: ${name}` : name}`

        if (selection.selectionSet) {
          collectFieldPaths(
            selection.selectionSet,
            `${path}.`,
            paths,
            spreading,
          )
        } else {
          paths.add(path)
        }

        break
      }
      case Kind.FRAGMENT_SPREAD: {
        const name = selection.name.value
        const fragment = fragments.get(name)

        if (!fragment) {
          throw new Error(`Fragment ${name} is spread but never defined`)
        }

        if (spreading.has(name)) {
          throw new Error(`Fragment ${name} spreads itself`)
        }

        spreading.add(name)
        collectFieldPaths(fragment.selectionSet, prefix, paths, spreading)
        spreading.delete(name)

        break
      }
      case Kind.INLINE_FRAGMENT: {
        const type = selection.typeCondition?.name.value

        collectFieldPaths(
          selection.selectionSet,
          type ? `${prefix}on(${type}).` : prefix,
          paths,
          spreading,
        )

        break
      }
    }
  }
}

const fieldPathsOf = (operation: OperationDefinitionNode): string[] => {
  const paths = new Set<string>()

  collectFieldPaths(operation.selectionSet, '', paths, new Set())

  return [...paths].sort()
}

describe('GraphQL operations', () => {
  it('are found', () => {
    expect(operations.size).toBeGreaterThan(0)
  })

  it('have unique names, except the known duplicates', () => {
    const duplicates = [...operationsByName]
      .filter(([, definitions]) => definitions.length > 1)
      .map(([name]) => name)
      .sort()

    expect(duplicates).toEqual([...KNOWN_DUPLICATE_OPERATION_NAMES].sort())
  })

  describe('select these field paths', () => {
    it.each([...operations.keys()].sort())('%s', (key) => {
      const operation = operations.get(key)

      if (!operation) {
        throw new Error(`Operation ${key} vanished between collection and test`)
      }

      expect(fieldPathsOf(operation)).toMatchSnapshot()
    })
  })
})
