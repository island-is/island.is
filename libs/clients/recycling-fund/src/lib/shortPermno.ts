// Taking the last three characters hides nothing when the registration number
// is three characters or fewer, and an Icelandic personalised plate can be that
// short. Those are left out of the log rather than written in full. These lines
// are logged on every successful call, not only on a failure.
//
// This lives outside recyclingFundClient.service.ts on purpose. The build finds
// decorators with @anatine/esbuild-decorators, whose string matching reads the
// empty string below as the start of a string running on to the next quote. Above
// @Injectable() that hid the decorator, the class lost its metadata, and Nest
// injected nothing into it.
const SHORTENED = 3

export const shortPermno = (permno: string): string =>
  permno && permno.length > SHORTENED ? permno.slice(-SHORTENED) : ''
