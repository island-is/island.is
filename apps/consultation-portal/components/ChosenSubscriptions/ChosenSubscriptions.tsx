import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { ChosenSubscriptionCard } from '../Card'
import { Area } from '../../types/enums'
import { SubscriptionArray } from '../../types/interfaces'

interface Props {
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  onClear?: () => void
  onSubmit?: () => void
  buttonText?: string
  submitSubsIsLoading?: boolean
}

const ChosenSubscriptions = ({
  subscriptionArray,
  setSubscriptionArray,
  onClear,
  onSubmit,
  buttonText,
  submitSubsIsLoading,
}: Props) => {
  const {
    cases,
    institutions,
    policyAreas,
    subscribedToAllNewObj,
    subscribedToAllChangesObj,
  } = subscriptionArray
  const chosenCases = cases.filter((item) => item.checked)
  const chosenInstitutions = institutions.filter((item) => item.checked)
  const chosenPolicyAreas = policyAreas.filter((item) => item.checked)

  return (
    <Stack space={0}>
      {!(
        chosenCases.length === 0 &&
        chosenInstitutions.length === 0 &&
        chosenPolicyAreas.length === 0 &&
        !subscribedToAllNewObj.checked &&
        !subscribedToAllChangesObj.checked
      ) && (
        <>
          <Text paddingBottom={1} variant="eyebrow" paddingTop={2}>
            Valin mál
          </Text>
          {subscribedToAllNewObj.checked && (
            <ChosenSubscriptionCard
              isGeneralSubscription
              idx={0}
              item={subscribedToAllNewObj}
              subscriptionArray={subscriptionArray}
              setSubscriptionArray={setSubscriptionArray}
            />
          )}
          {subscribedToAllChangesObj.checked && (
            <ChosenSubscriptionCard
              isGeneralSubscription
              idx={1}
              item={subscribedToAllChangesObj}
              subscriptionArray={subscriptionArray}
              setSubscriptionArray={setSubscriptionArray}
            />
          )}
          {chosenCases.length !== 0 &&
            chosenCases.map((item) => {
              return (
                <ChosenSubscriptionCard
                  isCase
                  key={item.key}
                  item={item}
                  area={Area.case}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                />
              )
            })}
          {chosenInstitutions.length !== 0 &&
            chosenInstitutions.map((item) => {
              return (
                <ChosenSubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.institution}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                />
              )
            })}
          {chosenPolicyAreas.length !== 0 &&
            chosenPolicyAreas.map((item) => {
              return (
                <ChosenSubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.policyArea}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                />
              )
            })}
          <Box
            marginTop={1}
            display={'flex'}
            justifyContent={'flexEnd'}
            alignItems="center"
          >
            <Box marginRight={3}>
              <Button
                size="small"
                icon="reload"
                variant="text"
                onClick={onClear}
                loading={false}
              >
                Hreinsa val
              </Button>
            </Box>
            <Button
              size="small"
              onClick={onSubmit}
              loading={submitSubsIsLoading}
            >
              {buttonText}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  )
}

export default ChosenSubscriptions
