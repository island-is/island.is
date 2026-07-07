import {
  CORE_TRANSLATION_NAMESPACE,
  isApplicationTranslationNamespace,
} from './application-translation.namespaces'

describe('isApplicationTranslationNamespace', () => {
  it('matches the core namespace', () => {
    expect(isApplicationTranslationNamespace(CORE_TRANSLATION_NAMESPACE)).toBe(
      true,
    )
  })

  it('matches standard *.application namespaces', () => {
    expect(isApplicationTranslationNamespace('pa.application')).toBe(true)
    expect(isApplicationTranslationNamespace('uiForms.application')).toBe(true)
  })

  it('matches non-standard application namespaces', () => {
    expect(isApplicationTranslationNamespace('vmst.cjs')).toBe(true)
  })

  it('does not match unrelated Contentful namespaces', () => {
    expect(isApplicationTranslationNamespace('judicial.system')).toBe(false)
    expect(isApplicationTranslationNamespace('user.profile')).toBe(false)
  })
})
