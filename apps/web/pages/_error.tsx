// TODO: remove this test
const ErrorPage = (test) => {
  return <div>ERROR {JSON.stringify(test)}</div>
}

export default ErrorPage

export const getInitialProps = async () => {
  return { value: '500' }
}
