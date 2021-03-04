# Feature Flags

## About

This library is a wrapper for whatever feature flag service Island.is is using

## How (not) to use

Feature flagging is a way to soft launch a "beta ready" feature to a specific
group of users.

Feature flagging is not a way to hide a feature from the users that is still a
work in progress.

## Usage

### Application entrypoint

    import { FeatureFlagContextProvider } from '@island.is/feature-flags'

then wrap your application using `<FeatureFlagContextProvider>`.

### Feature flag consumer

    import { FeatureFlagContext } from '@island.is/feature-flags'


    render() {
        const { featureFlagClient } = useContext(FeatureFlagContext)
        const [showAwesome, setShowAwesome] = useState(true)
        useEffect(() => {
            const getData = async () => {
                const featureEnabled = await featureFlagClient.getValue(
                'isAwesomeFeatureEnabled',
                false,
                {
                    uuid: 'sindri',
                },
                )
                setShowAwesome(featureEnabled as boolean)
            }
            getData()
        }, [])
        return `You are ${showAwesome ? 'awesome' : 'not really that awesome'}.`
    }
