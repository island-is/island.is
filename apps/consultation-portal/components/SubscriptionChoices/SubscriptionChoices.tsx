import { Box, Checkbox, Inline } from '@island.is/island-ui/core'
interface Subscriptiontype {
  id: number
  label: string
  value: string
  checked: boolean
}
const SubscriptionTypeArray: Array<Subscriptiontype> = [
  {
    id: 0,
    label: 'Fá allar tilkynningar um mál',
    value: 'AllChanges',
    checked: true,
  },
  {
    id: 1,
    label: 'Tilkynningar um breytingar',
    value: 'StatusChanges',
    checked: false,
  },
]
interface SubscriptionChoicesProps {
  itemId: number | string
  checkboxCheck: (val, id) => boolean
  checkboxChange: (val, id?) => void
  id?: string
}

const SubscriptionChoices = ({
  itemId,
  checkboxCheck,
  checkboxChange,
  id,
}: SubscriptionChoicesProps) => {
  return (
    <Box paddingTop={3}>
      <Inline
        collapseBelow="xl"
        alignY="center"
        justifyContent="spaceBetween"
        space="smallGutter"
      >
        {SubscriptionTypeArray.map((box, index) => {
          return (
            <Checkbox
              key={index}
              id={box.value + itemId + id}
              large
              backgroundColor="blue"
              label={box.label}
              checked={checkboxCheck(box.value, itemId)}
              onChange={() => checkboxChange(box.value, itemId)}
            />
          )
        })}
      </Inline>
    </Box>
  )
}

export default SubscriptionChoices
