import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { SubscriptionCard } from '../SubscriptionCard/SubscriptionCard'
import { Area, SubscriptionDescriptionKey } from '../../../../types/enums'
import { SubscriptionArray } from '../../../../types/interfaces'
import { useIsMobile } from '../../../../hooks'
import localization from '../../Subscriptions.json'
import { sortLocale } from '../../../../utils/helpers'

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
  const loc = localization['chosenSubscriptions']
  const {
    cases,
    institutions,
    policyAreas,
    subscribedToAllNewObj,
    subscribedToAllChangesObj,
  } = subscriptionArray
  const chosenCases = cases.filter((item) => item.checked)
  const sortedChosenCases = sortLocale({
    list: chosenCases,
    sortOption: 'name',
  })
  const chosenInstitutions = institutions.filter((item) => item.checked)
  const sortedChosenInstitutions = sortLocale({
    list: chosenInstitutions,
    sortOption: 'name',
  })
  const chosenPolicyAreas = policyAreas.filter((item) => item.checked)
  const sortedChosenPolicyAreas = sortLocale({
    list: chosenPolicyAreas,
    sortOption: 'name',
  })
  const { isMobile } = useIsMobile()
  const subscribeToAllChecked = subscribedToAllNewObj.checked
    ? subscribedToAllNewObj
    : subscribedToAllChangesObj.checked
    ? subscribedToAllChangesObj
    : undefined

  const DescText = ({ children }) => {
    return (
      <Text variant="medium" fontWeight="light">
        {children}
      </Text>
    )
  }

  return (
    <Stack space={0}>
      {!(
        sortedChosenCases.length === 0 &&
        sortedChosenInstitutions.length === 0 &&
        sortedChosenPolicyAreas.length === 0 &&
        !subscribeToAllChecked
      ) && (
        <>
          <Text paddingBottom={1} variant="eyebrow" paddingTop={2}>
            {loc.eyebrowText}
          </Text>
          {subscribeToAllChecked && (
            <SubscriptionCard
              isGeneralSubscription
              item={subscribeToAllChecked}
              subscriptionArray={subscriptionArray}
              setSubscriptionArray={setSubscriptionArray}
              titleColumn={
                <Text variant="medium" fontWeight="semiBold" color={'dark400'}>
                  {loc.cardTitle}
                </Text>
              }
            >
              <DescText>{subscribeToAllChecked.name}</DescText>
            </SubscriptionCard>
          )}

          {sortedChosenCases.length !== 0 &&
            sortedChosenCases.map((item) => {
              return (
                <SubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.case}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                  titleColumn={
                    <Text
                      variant="medium"
                      fontWeight="semiBold"
                      truncate={isMobile}
                      color={'dark400'}
                    >
                      {`S-${item.caseNumber}`}
                    </Text>
                  }
                >
                  <DescText>{item.name}</DescText>
                </SubscriptionCard>
              )
            })}
          {sortedChosenInstitutions.length !== 0 &&
            sortedChosenInstitutions.map((item) => {
              return (
                <SubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.institution}
                  subscriptionArray={subscriptionArray}
                  toggleAble={toggleAble}
                  setSubscriptionArray={setSubscriptionArray}
                  titleColumn={
                    <Text
                      variant="medium"
                      fontWeight="semiBold"
                      truncate={isMobile}
                      color={'blue400'}
                    >
                      {item.name}
                    </Text>
                  }
                >
                  <DescText>
                    <em>
                      &mdash;
                      {SubscriptionDescriptionKey[item.subscriptionType]}
                    </em>
                  </DescText>
                </SubscriptionCard>
              )
            })}
          {sortedChosenPolicyAreas.length !== 0 &&
            sortedChosenPolicyAreas.map((item) => {
              return (
                <SubscriptionCard
                  key={item.key}
                  item={item}
                  area={Area.policyArea}
                  toggleAble={toggleAble}
                  subscriptionArray={subscriptionArray}
                  setSubscriptionArray={setSubscriptionArray}
                  titleColumn={
                    <Text
                      variant="medium"
                      fontWeight="semiBold"
                      truncate={isMobile}
                      color={'blue400'}
                    >
                      {item.name}
                    </Text>
                  }
                >
                  <DescText>
                    <em>
                      &mdash;
                      {SubscriptionDescriptionKey[item.subscriptionType]}
                    </em>
                  </DescText>
                </SubscriptionCard>
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
                {loc.clearButton}
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
