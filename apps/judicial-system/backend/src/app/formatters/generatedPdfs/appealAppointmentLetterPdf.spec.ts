import {
  AppealAppointmentKind,
  createAppealAppointmentLetter,
  getAppealAppointmentAddressee,
  getAppealAppointmentBody,
  getAppealAppointmentCaseTitle,
  getAppealAppointmentCaseTitleLines,
  getAppealAppointmentSentence,
  getAppealAppointmentSubject,
} from './appealAppointmentLetterPdf'

describe('getAppealAppointmentSubject', () => {
  it('names the kind of advocate being appointed', () => {
    expect(
      getAppealAppointmentSubject(AppealAppointmentKind.DEFENDER, '593/2026'),
    ).toBe('Skipun verjanda í landsréttarmálinu nr. 593/2026:')

    expect(
      getAppealAppointmentSubject(
        AppealAppointmentKind.SPOKESPERSON,
        '593/2026',
      ),
    ).toBe('Skipun réttargæslumanns í landsréttarmálinu nr. 593/2026:')
  })

  // The number is recorded on a step that does not exist yet, so the letter
  // ships before it and says so in the shape of a case number.
  it('stands a placeholder in for a number not yet recorded', () => {
    expect(
      getAppealAppointmentSubject(AppealAppointmentKind.DEFENDER, null),
    ).toBe('Skipun verjanda í landsréttarmálinu nr. xxx/xxxx:')

    expect(
      getAppealAppointmentSubject(AppealAppointmentKind.DEFENDER, ''),
    ).toBe('Skipun verjanda í landsréttarmálinu nr. xxx/xxxx:')
  })
})

describe('getAppealAppointmentSentence', () => {
  // The sentence that does the appointing. A defender is appointed to the
  // accused, a spokesperson to the injured party. The notice about the
  // deadline runs on from it as one paragraph, as it does on the letters.
  it('appoints the right advocate to the right party', () => {
    expect(getAppealAppointmentSentence(AppealAppointmentKind.DEFENDER)).toBe(
      'Þér eruð hér með skipaðir verjandi ákærða fyrir Landsrétti. Tilkynnt ' +
        'verður síðar um frest til greinargerðar í málinu.',
    )

    expect(
      getAppealAppointmentSentence(AppealAppointmentKind.SPOKESPERSON),
    ).toBe(
      'Þér eruð hér með skipaðir réttargæslumaður brotaþola fyrir Landsrétti. ' +
        'Tilkynnt verður síðar um frest til greinargerðar í málinu.',
    )
  })
})

describe('getAppealAppointmentCaseTitleLines', () => {
  // Three lines, which is how a court document heads a case.
  it('breaks the case title the way the letter sets it', () => {
    expect(getAppealAppointmentCaseTitleLines('Gervimanni Jónssyni')).toEqual([
      'Ákæruvaldið',
      'gegn',
      'Gervimanni Jónssyni',
    ])
  })
})

describe('getAppealAppointmentAddressee', () => {
  // Whichever role the court appoints them to, the person it writes to is a
  // lawyer, and both letters address them as one.
  it('addresses the advocate as a lawyer', () => {
    expect(getAppealAppointmentAddressee('Þórður Már Jónsson')).toBe(
      'Þórður Már Jónsson lögmaður',
    )
  })
})

describe('getAppealAppointmentCaseTitle', () => {
  it('names the case after the accused, whoever is appointed', () => {
    expect(getAppealAppointmentCaseTitle('Gervimanni Jónssyni')).toBe(
      'Ákæruvaldið gegn Gervimanni Jónssyni',
    )
  })
})

describe('getAppealAppointmentBody', () => {
  const letter = {
    courtName: 'Héraðsdóms Reykjavíkur',
    courtCaseNumber: 'S-4275/2025',
    defendantName: 'Gervimanni Jónssyni',
    appealCaseNumber: '593/2026',
    appealSummonsDate: '2026-06-22T00:00:00.000Z',
  }

  it('reads as the letter it reproduces', () => {
    expect(getAppealAppointmentBody(letter)).toBe(
      'Landsrétti hefur borist dómur Héraðsdóms Reykjavíkur í máli nr. ' +
        'S-4275/2025; Ákæruvaldið gegn Gervimanni Jónssyni sem áfrýjað var ' +
        'með áfrýjunarstefnu útgefinni 22. júní 2026. Málsnúmer fyrir ' +
        'Landsrétti er 593/2026.',
    )
  })

  // The two unknowns read differently on purpose: the court of appeals number
  // is merely unrecorded, while the áfrýjunarstefna is a document nothing in
  // the portal creates yet.
  it('marks a missing appeal case number as unrecorded', () => {
    expect(
      getAppealAppointmentBody({ ...letter, appealCaseNumber: null }),
    ).toContain('Málsnúmer fyrir Landsrétti er xxx/xxxx.')
  })

  it('marks the appeal summons as not yet built', () => {
    expect(
      getAppealAppointmentBody({ ...letter, appealSummonsDate: null }),
    ).toContain('með áfrýjunarstefnu útgefinni Ekki útfært.')
  })

  it('keeps the district court number out of the placeholder', () => {
    expect(
      getAppealAppointmentBody({ ...letter, appealCaseNumber: null }),
    ).toContain('í máli nr. S-4275/2025;')
  })
})

describe('createAppealAppointmentLetter', () => {
  const letter = {
    kind: AppealAppointmentKind.DEFENDER,
    advocateName: 'Þórður Már Jónsson',
    defendantName: 'Gervimanni Jónssyni',
    courtName: 'Héraðsdóms Reykjavíkur',
    courtCaseNumber: 'S-4275/2025',
    appealCaseNumber: '593/2026',
    appealSummonsDate: '2026-06-22T00:00:00.000Z',
    appointedBy: {
      name: 'Áslaug Björk Ingólfsdóttir',
      title: 'aðstoðarmaður dómara',
    },
    appointedDate: '2026-08-13T00:00:00.000Z',
    copyTo: ['Hrafnhildur M. Gunnarsdóttir saksóknari'],
  }

  it('renders a pdf', async () => {
    const pdf = await createAppealAppointmentLetter(letter)

    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    expect(pdf.length).toBeGreaterThan(0)
  })

  // A spokesperson's letter copies the defender as well as the prosecutor,
  // which a defender's does not.
  it('renders the spokesperson letter with its longer copy list', async () => {
    const pdf = await createAppealAppointmentLetter({
      ...letter,
      kind: AppealAppointmentKind.SPOKESPERSON,
      copyTo: [
        'Hrafnhildur M. Gunnarsdóttir saksóknari',
        'Þórður Már Jónsson lögmaður',
      ],
    })

    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  })

  it('renders without a copy list', async () => {
    const pdf = await createAppealAppointmentLetter({ ...letter, copyTo: [] })

    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
  })

  // The stationery sits below the bottom margin, where pdfkit treats text as
  // overflow and moves it - and everything after it - onto a fresh page. That
  // turned this letter into three blank-ish pages once, so the page count is
  // worth asserting rather than trusting.
  describe('page count', () => {
    const countPages = (pdf: Buffer) =>
      (pdf.toString('latin1').match(/\/Type \/Page(?!s)/g) ?? []).length

    it('fits on one page', async () => {
      expect(countPages(await createAppealAppointmentLetter(letter))).toBe(1)
    })

    it('still fits with the longer copy list', async () => {
      const pdf = await createAppealAppointmentLetter({
        ...letter,
        kind: AppealAppointmentKind.SPOKESPERSON,
        copyTo: [
          'Hrafnhildur M. Gunnarsdóttir saksóknari',
          'Þórður Már Jónsson lögmaður',
          'Áslaug Björk Ingólfsdóttir lögmaður',
        ],
      })

      expect(countPages(pdf)).toBe(1)
    })
  })
})
