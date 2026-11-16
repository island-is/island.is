import {
  appealAdvocateAssignedBody,
  appealAdvocateAssignedSubject,
} from './appealAdvocateAssigned'

describe('appealAdvocateAssignedSubject', () => {
  // Named outright, not read off the case: the case's court is the district
  // court that gave the judgment.
  it('comes from the court of appeals', () => {
    expect(appealAdvocateAssignedSubject()).toBe(
      'Landsréttur - aðgangur að máli',
    )
  })
})

describe('appealAdvocateAssignedBody', () => {
  it('names the role the advocate was recorded in', () => {
    expect(appealAdvocateAssignedBody('verjanda', '77/2026')).toBe(
      'Landsréttur hefur skráð þig sem verjanda í máli 77/2026.',
    )

    expect(
      appealAdvocateAssignedBody(
        'réttargæslumann einkaréttarkröfuhafa',
        '77/2026',
      ),
    ).toContain('skráð þig sem réttargæslumann einkaréttarkröfuhafa í máli')

    expect(
      appealAdvocateAssignedBody('lögmann einkaréttarkröfuhafa', '77/2026'),
    ).toContain('skráð þig sem lögmann einkaréttarkröfuhafa í máli')
  })

  // The same placeholder the letter of appointment uses, for the same reason:
  // the number is recorded on a step that does not exist yet.
  it('stands a placeholder in for a number not yet recorded', () => {
    expect(appealAdvocateAssignedBody('verjanda', null)).toContain(
      'í máli xxx/xxxx.',
    )
  })

  it('carries no link when the case is not yet open to the advocate', () => {
    expect(appealAdvocateAssignedBody('verjanda', '77/2026')).not.toContain(
      '<a',
    )
  })

  it('links to the case overview when a case url is provided', () => {
    expect(
      appealAdvocateAssignedBody(
        'verjanda',
        '77/2026',
        'https://rvg.example/verjandi/akaera/case-id',
      ),
    ).toContain(
      '<a href="https://rvg.example/verjandi/akaera/case-id">yfirlitssíðu málsins í Réttarvörslugátt</a>',
    )
  })
})
