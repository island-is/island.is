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
      'Landsréttur hefur skráð þig sem verjanda í máli 77/2026.<br /><br />' +
        'Hægt er að nálgast málið í Réttarvörslugátt.',
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

  // Being recorded grants no access yet, so a link would lead to a refusal.
  it('offers no link to the case', () => {
    expect(appealAdvocateAssignedBody('verjanda', '77/2026')).not.toContain(
      '<a ',
    )
  })
})
