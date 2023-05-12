import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { ChosenSubscriptionCard } from '../Card'
import { Area, SubscriptionDescriptionKey } from '../../types/enums'
import { SubscriptionArray } from '../../types/interfaces'
import { useIsMobile } from '../../utils/helpers'

interface Props {
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (_: SubscriptionArray) => void
  onClear?: () => void
  onSubmit?: () => void
  buttonText?: string
  submitSubsIsLoading?: boolean
  toggleAble?: boolean
}

const ChosenSubscriptions = ({
  subscriptionArray,
  setSubscriptionArray,
  onClear,
  onSubmit,
  buttonText,
  submitSubsIsLoading,
  toggleAble = true,
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
  const { isMobile } = useIsMobile()
  const subscribeToAllChecked = subscribedToAllNewObj.checked
    ? subscribedToAllNewObj
    : subscribedToAllChangesObj.checked
    ? subscribedToAllChangesObj
    : undefined

  return (
    <Stack space={0}>
      {!(
        chosenCases.length === 0 &&
        chosenInstitutions.length === 0 &&
        chosenPolicyAreas.length === 0 &&
        !subscribeToAllChecked
      ) && (
        <>
          <Text paddingBottom={1} variant="eyebrow" paddingTop={2}>
            Valin mál
          </Text>
          {subscribeToAllChecked && (
            <ChosenSubscriptionCard
              isGeneralSubscription
              idx={0}
              item={subscribeToAllChecked}
              subscriptionArray={subscriptionArray}
              setSubscriptionArray={setSubscriptionArray}
              titleColumn={
                <Text lineHeight="sm" variant="h5" color={'dark400'}>
                  Öll mál
                </Text>
              }
            >
              <Text variant="medium">&emsp;{subscribeToAllChecked.name}</Text>
            </ChosenSubscriptionCard>
          )}

          {chosenCases.length !== 0 &&
            chosenCases.map((item) => {
              return (
                <ChosenSubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.case}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                  titleColumn={
                    <Text variant="h5" truncate={isMobile} color={'dark400'}>
                      {item.caseNumber}
                    </Text>
                  }
                >
                  <Text variant="medium">&emsp;{item.name}</Text>
                </ChosenSubscriptionCard>
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
                  toggleAble={toggleAble}
                  setSubscriptionArray={setSubscriptionArray}
                  titleColumn={
                    <Text variant="h5" truncate={isMobile} color={'blue400'}>
                      {item.name}
                    </Text>
                  }
                >
                  <Text variant="medium">
                    <em>
                      &emsp;&mdash;
                      {SubscriptionDescriptionKey[item.subscriptionType]}
                    </em>
                  </Text>
                </ChosenSubscriptionCard>
              )
            })}
          {chosenPolicyAreas.length !== 0 &&
            chosenPolicyAreas.map((item) => {
              return (
                <ChosenSubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.policyArea}
                  toggleAble={toggleAble}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                  titleColumn={
                    <Text variant="h5" truncate={isMobile} color={'blue400'}>
                      {item.name}
                    </Text>
                  }
                >
                  <Text variant="medium">
                    <em>
                      &emsp;&mdash;
                      {SubscriptionDescriptionKey[item.subscriptionType]}
                    </em>
                  </Text>
                </ChosenSubscriptionCard>
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
