import exportFinder from '../exportFinder'
import * as path from 'path'

describe('exportFinder', () => {
  it('finds all exports', () => {
    const fixturePath = path.join(__dirname, 'fixture')
    const exports = exportFinder(path.join(fixturePath, 'index.ts'))
    const relativeExports = Object.entries(exports).map(
      ([exportName, modulePath]) => [
        exportName,
        path.relative(fixturePath, modulePath),
      ],
    )
    expect(relativeExports).toEqual([
      ['name18', 'f.ts'],
      ['name17', 'f.ts'],
      ['default', 'd.ts'],
      ['name13', 'b.ts'],
      ['name12', 'b.ts'],
      ['name10', 'a.ts'],
      ['name9', 'a.ts'],
      ['name8', 'index.ts'],
      ['name7', 'index.ts'],
      ['name6', 'index.ts'],
      ['name5', 'index.ts'],
      ['name4', 'index.ts'],
      ['name3', 'index.ts'],
      ['ClassName', 'index.ts'],
      ['functionName', 'index.ts'],
      ['name2', 'index.ts'],
      ['name1', 'index.ts'],
    ])
  })
})
