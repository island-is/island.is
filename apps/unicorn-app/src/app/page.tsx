const f = (g: () => string) => g()
const x = f(() => {
  return 'hello'
})

export default function Index() {
  return (
    <div>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span role="img" aria-label="unicorn">
                Welcome unicorn 🦄 Hey there test
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
