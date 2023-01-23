// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  configureStore,
  Middleware,
  combineReducers,
  AnyAction,
} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { samradsgattApi } from '../lib/samradsgattApi-generated'
const appReducer = combineReducers({
  [samradsgattApi.reducerPath]: samradsgattApi.reducer,
})

export type RootState = ReturnType<typeof appReducer>

const rootReducer = (state: RootState | undefined, action: AnyAction) => {
  return appReducer(state, action)
}
const middleWare: Middleware[] = [samradsgattApi.middleware]

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: () => Middleware[]) =>
    getDefaultMiddleware().concat(middleWare),
  devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
