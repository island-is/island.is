# Feature Flags

## About

This library is a wrapper for whatever feature flag service Island.is is using

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
