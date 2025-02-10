import { useEffect } from 'react'

export default function ThreeDSecureSuccessPage() {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 5000)
  })

  return (
    <div>
      <h1>3D Secure Success</h1>
      <p>Your payment was successful</p>
      <button onClick={() => window.close()}>Close</button>
    </div>
  )
}
