import '@testing-library/jest-dom/extend-expect'
import '@vanilla-extract/css/disableRuntimeStyles'
import { MockBroadcastChannel } from '@island.is/react-spa/shared/mocks'

global.BroadcastChannel = MockBroadcastChannel

window.scrollTo = () => undefined
