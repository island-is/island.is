import styles from './page.module.css'

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span role="img" aria-label="unicorn">
                Welcome unicorn 🦄
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
