import { dataSchema } from './dataSchema'

// The subsidiaries screen is a radio plus a TableRepeater conditioned on it,
// and the table hands this schema its own bookkeeping rows: a row the
// applicant just added is `{ isUnsaved: true }` with no fields on it, and a
// deleted one is only flagged `isRemoved` until the table's beforeSubmit
// splices it — which happens *after* validation. Every case below is a shape
// the screen can really produce; getting one wrong blocks the applicant on an
// error with no field to fix it on.
const parse = (value: unknown) => dataSchema.shape.subsidiaries.safeParse(value)

const paths = (result: ReturnType<typeof parse>) =>
  result.success ? [] : result.error.issues.map((i) => i.path.join('.'))

const COMPANY = '5501692829'
const OTHER_COMPANY = '6503760649'
const PERSON = '0101302399'

const row = (nationalId: string, name = 'Dótturfélag ehf.') => ({
  nationalIdWithName: { name, nationalId },
})

describe('subsidiaries schema', () => {
  describe('when the applicant has no subsidiaries', () => {
    it('accepts "no" on its own', () => {
      expect(parse({ includesSubsidiaries: 'no' }).success).toBe(true)
    })

    // The reported bug: pick yes, hit add, fill nothing, pick no. The half
    // -added row stays in answers and used to fail validation at
    // `list.0.nationalIdWithName` — a path with no input to show it on, so the
    // applicant was stuck until they reloaded the page.
    it('accepts "no" while a half-added row is still in answers', () => {
      const result = parse({
        includesSubsidiaries: 'no',
        list: [{ isUnsaved: true }],
      })

      expect(result.success).toBe(true)
    })

    it('accepts "no" while a fully filled list is still in answers', () => {
      const result = parse({
        includesSubsidiaries: 'no',
        list: [row(COMPANY)],
      })

      expect(result.success).toBe(true)
    })
  })

  describe('when the applicant has subsidiaries', () => {
    it('accepts a filled row', () => {
      expect(
        parse({ includesSubsidiaries: 'yes', list: [row(COMPANY)] }).success,
      ).toBe(true)
    })

    it('requires the list to hold something', () => {
      expect(paths(parse({ includesSubsidiaries: 'yes', list: [] }))).toEqual([
        'list',
      ])
    })

    it('treats an all-deleted list as empty rather than validating the corpses', () => {
      const result = parse({
        includesSubsidiaries: 'yes',
        list: [{ ...row(COMPANY), isRemoved: true }],
      })

      expect(paths(result)).toEqual(['list'])
    })

    it('ignores a deleted row alongside a good one', () => {
      const result = parse({
        includesSubsidiaries: 'yes',
        list: [
          { nationalIdWithName: { name: '', nationalId: '' }, isRemoved: true },
          row(COMPANY),
        ],
      })

      expect(result.success).toBe(true)
    })

    // Reported on the row's own inputs, so the applicant can see what to fix.
    it('reports a half-added row on the fields it is missing', () => {
      const result = parse({
        includesSubsidiaries: 'yes',
        list: [{ isUnsaved: true }],
      })

      expect(paths(result)).toEqual([
        'list.0.nationalIdWithName.name',
        'list.0.nationalIdWithName.nationalId',
      ])
    })

    it('rejects a personal national id', () => {
      expect(
        paths(parse({ includesSubsidiaries: 'yes', list: [row(PERSON)] })),
      ).toEqual(['list.0.nationalIdWithName.nationalId'])
    })

    it('rejects the same company twice', () => {
      const result = parse({
        includesSubsidiaries: 'yes',
        list: [row(COMPANY), row(COMPANY)],
      })

      expect(paths(result)).toEqual(['list.1.nationalIdWithName.nationalId'])
    })

    // Indices have to stay those of the unfiltered array — the table is still
    // rendering the deleted row's slot, so a filtered index would pin the
    // error to the wrong input.
    it('keeps error indices aligned with the rows the table still renders', () => {
      const result = parse({
        includesSubsidiaries: 'yes',
        list: [
          { ...row(OTHER_COMPANY), isRemoved: true },
          row(COMPANY),
          row(PERSON),
        ],
      })

      expect(paths(result)).toEqual(['list.2.nationalIdWithName.nationalId'])
    })
  })
})
