import { Checkbox, Inline } from '@island.is/island-ui/core'

const SubscriptionChoices = () => {
  return (
    <Inline
      collapseBelow="xl"
      alignY="center"
      justifyContent="spaceBetween"
      space="smallGutter"
    >
      <Checkbox
        large
        backgroundColor="blue"
        label="Fá allar tilkynningar um mál"
      />
      <Checkbox
        large
        backgroundColor="blue"
        label="Tilkynningar um breytingar"
        checked
      />
      <Checkbox
        large
        backgroundColor="blue"
        label="Umsagnafrestur að renna út"
        checked
      />
    </Inline>
  )
}

export default SubscriptionChoices
