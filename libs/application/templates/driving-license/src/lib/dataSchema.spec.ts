import { dataSchema } from './dataSchema'

// The redesigned 65+ flow always requires a health-certificate upload. We do
// NOT enforce this with a cross-field `superRefine` (an earlier attempt fired
// at the prerequisites→draft transition before the user had reached the
// upload screen, blocking advance). Instead we rely on:
//   - the form rendering the upload field unconditionally for redesigned 65+
//   - `healthCertificate`'s field-level refine `(files) => files.length > 0`
//     firing when the field is rendered with an empty array
//   - `.optional()` letting the schema pass when the user hasn't reached the
//     field yet
//
// The tests below pin that contract: if someone removes the field-level
// refine, the redesigned-65+ "must upload" enforcement disappears silently.

describe('dataSchema — healthCertificate field-level refine (redesigned-65+ enforcement)', () => {
  it('flags healthCertificate as invalid when the field is present but empty', () => {
    const result = dataSchema.safeParse({
      healthCertificate: [],
    })
    expect(result.success).toBe(false)
    if (result.success) return
    const certIssue = result.error.issues.find(
      (i) => i.path[0] === 'healthCertificate',
    )
    expect(certIssue).toBeDefined()
  })

  it('does NOT flag healthCertificate when the field is undefined (user has not reached upload screen)', () => {
    const result = dataSchema.safeParse({
      // healthCertificate omitted — simulates pre-upload state
    })
    if (result.success) return
    const certIssue = result.error.issues.find(
      (i) => i.path[0] === 'healthCertificate',
    )
    expect(certIssue).toBeUndefined()
  })

  it('passes when healthCertificate has at least one valid file entry', () => {
    const result = dataSchema.safeParse({
      healthCertificate: [{ name: 'cert.pdf', key: 's3-key' }],
    })
    if (result.success) return
    const certIssue = result.error.issues.find(
      (i) => i.path[0] === 'healthCertificate',
    )
    expect(certIssue).toBeUndefined()
  })

  it('accepts is65RenewalRedesignEnabled as an optional boolean (used by form conditions)', () => {
    const onResult = dataSchema.safeParse({ is65RenewalRedesignEnabled: true })
    const offResult = dataSchema.safeParse({
      is65RenewalRedesignEnabled: false,
    })
    const flagIssueOn = !onResult.success
      ? onResult.error.issues.find(
          (i) => i.path[0] === 'is65RenewalRedesignEnabled',
        )
      : undefined
    const flagIssueOff = !offResult.success
      ? offResult.error.issues.find(
          (i) => i.path[0] === 'is65RenewalRedesignEnabled',
        )
      : undefined
    expect(flagIssueOn).toBeUndefined()
    expect(flagIssueOff).toBeUndefined()
  })
})
