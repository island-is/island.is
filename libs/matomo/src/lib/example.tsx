import { useMatomoPageView } from './hooks'
import { MatomoProvider } from './MatomoProvider'
export const ExamplePage = () => {
  // Það má færa init skriftuna líka í providerinn whatever, þetta er á _document leveli
  return (
    <MatomoProvider>
      <ExampleComponent />
    </MatomoProvider>
  )
}

// eslint-disable-next-line func-style
function ExampleComponent() {
  useMatomoPageView(() => {
    return {
      organization: 'hehe',
    }
  })
  return (
    <>
      <ExampleComponent2 />
      <div>hehe</div>
    </>
  )
}

// eslint-disable-next-line func-style
function ExampleComponent2() {
  useMatomoPageView(() => {
    return {
      category: 'hehe',
    }
  })
  return <div>ok</div>
}
