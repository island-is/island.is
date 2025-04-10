import { useEffect } from 'react'

export default function ThreeDSecureSuccessPage() {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 5000)
  })

  return (
    <div>
      <h1>3DSecure tókst</h1>
      <p>Búið er að auðkenna kortið</p>
    </div>
  )
}
