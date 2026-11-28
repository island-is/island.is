import { z } from 'zod'

import {
  changedAnswerKeys,
  isAtOrBelow,
  keysOutsideFields,
  keysWithIssues,
  owningId,
  zodIssuesForFields,
} from '../answer-validation'

const schema = z.object({
  applicant: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.object({ street: z.string().min(1) }),
  }),
  optionalGroup: z.object({ note: z.string().min(1) }).optional(),
  files: z.array(z.object({ name: z.string() })).optional(),
  count: z.number().optional(),
})

const pathsOf = (issues: Array<{ path: Array<string | number> }>) =>
  issues.map((issue) => issue.path.join('.')).sort()

describe('isAtOrBelow', () => {
  it('matches the id itself and what is inside it', () => {
    expect(isAtOrBelow('files', 'files')).toBe(true)
    expect(isAtOrBelow('files.0.name', 'files')).toBe(true)
    expect(isAtOrBelow('applicant.phone', 'applicant')).toBe(true)
  })

  it('does not match a sibling that only shares a prefix, or a parent', () => {
    expect(isAtOrBelow('filesCount', 'files')).toBe(false)
    expect(isAtOrBelow('applicant', 'applicant.phone')).toBe(false)
  })

  it('reads a bracketed index as a dotted one', () => {
    expect(isAtOrBelow('periods[0].start', 'periods')).toBe(true)
    expect(isAtOrBelow('periods[0].start', 'periods.0.start')).toBe(true)
  })
})

describe('owningId', () => {
  it('gives the field a path is at or below', () => {
    expect(owningId('files.1.name', ['applicant.name', 'files'])).toBe('files')
    expect(owningId('count', ['applicant.name', 'files'])).toBeUndefined()
  })
})

describe('zodIssuesForFields', () => {
  it('reports a field that is at its own path', () => {
    const issues = zodIssuesForFields(
      schema,
      { applicant: { name: '', phone: 'x', address: { street: 's' } } },
      ['applicant.name', 'applicant.phone'],
    )

    expect(pathsOf(issues)).toEqual(['applicant.name'])
  })

  it('reports the fields inside a required object that is missing', () => {
    const issues = zodIssuesForFields(schema, {}, [
      'applicant.name',
      'applicant.phone',
    ])

    expect(pathsOf(issues)).toEqual(['applicant.name', 'applicant.phone'])
  })

  it('reaches fields two objects down', () => {
    const issues = zodIssuesForFields(schema, {}, ['applicant.address.street'])

    expect(pathsOf(issues)).toEqual(['applicant.address.street'])
  })

  it('reports only the fields on the screen, not the rest of the object', () => {
    const issues = zodIssuesForFields(schema, {}, ['applicant.phone'])

    expect(pathsOf(issues)).toEqual(['applicant.phone'])
  })

  it('does not fill in an object the schema allows to be missing', () => {
    expect(zodIssuesForFields(schema, {}, ['optionalGroup.note'])).toEqual([])
  })

  it('still checks a field inside an optional object once the object exists', () => {
    const issues = zodIssuesForFields(schema, { optionalGroup: { note: '' } }, [
      'optionalGroup.note',
    ])

    expect(pathsOf(issues)).toEqual(['optionalGroup.note'])
  })

  it('reports a problem inside an array item against the array field', () => {
    const issues = zodIssuesForFields(schema, { files: [{ name: 1 }] }, [
      'files',
    ])

    expect(pathsOf(issues)).toEqual(['files.0.name'])
  })

  it('does not change the answers it is given', () => {
    const answers = {}

    zodIssuesForFields(schema, answers, ['applicant.name'])

    expect(answers).toEqual({})
  })
})

describe('changedAnswerKeys', () => {
  it('lists the keys whose value differs from the stored one', () => {
    expect(
      changedAnswerKeys(
        { same: 'a', changed: 'a', nested: { id: 1 } },
        { same: 'a', changed: 'b', nested: { id: 1 }, added: 'c' },
      ),
    ).toEqual(['changed', 'added'])
  })

  it('counts an empty string and a missing answer as the same', () => {
    expect(changedAnswerKeys({}, { cleared: '' })).toEqual([])
    expect(changedAnswerKeys({ cleared: 'x' }, { cleared: '' })).toEqual([
      'cleared',
    ])
  })

  it('reads a dotted key from the nested stored answers', () => {
    expect(
      changedAnswerKeys(
        { applicant: { phone: '1' } },
        { 'applicant.phone': '1', 'applicant.name': 'n' },
      ),
    ).toEqual(['applicant.name'])
  })
})

describe('keysOutsideFields', () => {
  it('keeps the keys that are not a field of the screen, or inside or around one', () => {
    expect(
      keysOutsideFields(
        ['applicant.name', 'applicant', 'files.0', 'other'],
        ['applicant.name', 'files'],
      ),
    ).toEqual(['other'])
  })
})

describe('keysWithIssues', () => {
  it('lists the keys an issue path is at or below', () => {
    expect(
      keysWithIssues(['files.0.name', 'count'], ['files', 'applicant']),
    ).toEqual(['files'])
  })
})
