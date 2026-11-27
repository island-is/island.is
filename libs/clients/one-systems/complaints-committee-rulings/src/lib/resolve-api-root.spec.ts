import { resolveApiRoot } from './resolve-api-root'

describe('resolveApiRoot', () => {
  it('appends the default path to a bare origin', () => {
    expect(resolveApiRoot('https://onedemo.onecrm.is')).toBe(
      'https://onedemo.onecrm.is/OneRulings',
    )
  })

  it('appends the default path to a bare origin with a trailing slash', () => {
    expect(resolveApiRoot('https://onedemo.onecrm.is/')).toBe(
      'https://onedemo.onecrm.is/OneRulings',
    )
  })

  it('uses a base path that already contains a path as is', () => {
    expect(
      resolveApiRoot(
        'https://kvth-one2.onecrm.is/addons/Kvth_one2/KVTH_RulingsAPI',
      ),
    ).toBe('https://kvth-one2.onecrm.is/addons/Kvth_one2/KVTH_RulingsAPI')
  })

  it('strips trailing slashes from a base path that contains a path', () => {
    expect(
      resolveApiRoot(
        'https://kvth-one2.onecrm.is/addons/Kvth_one2/KVTH_RulingsAPI//',
      ),
    ).toBe('https://kvth-one2.onecrm.is/addons/Kvth_one2/KVTH_RulingsAPI')
  })

  it('does not append the default path twice', () => {
    expect(resolveApiRoot('https://onedemo.onecrm.is/OneRulings')).toBe(
      'https://onedemo.onecrm.is/OneRulings',
    )
  })

  it('ignores surrounding whitespace', () => {
    expect(resolveApiRoot(' https://onedemo.onecrm.is ')).toBe(
      'https://onedemo.onecrm.is/OneRulings',
    )
  })
})
