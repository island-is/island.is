import { Text } from '@island.is/island-ui/core'

export const AgencyText = () => {
  return (
    <Text marginTop={2} variant="small">
      Ef umsögn er send fyrir hönd samtaka, fyrirtækis eða stofnunar þarf umboð
      þaðan,{' '}
      <a
        target="_blank"
        href="https://samradsgatt.island.is/library/Files/Umbo%C3%B0%20-%20lei%C3%B0beiningar%20fyrir%20samr%C3%A1%C3%B0sg%C3%A1tt%20r%C3%A1%C3%B0uneyta.pdf"
        rel="noopener noreferrer"
      >
        sjá nánar hér.
      </a>
    </Text>
  )
}
