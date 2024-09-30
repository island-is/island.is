// Prevent all styles creation when running tests as they don´t depend on styling
import '@vanilla-extract/css/disableRuntimeStyles'
import { MockBroadcastChannel } from '@island.is/react-spa/shared/mocks'

global.BroadcastChannel = MockBroadcastChannel
