export default function ThreeDSecureSuccessPage() {
  return (
    <div>
      <h1>3D Secure Success</h1>
      <p>Your payment was successful</p>
      <button onClick={() => window.close()}>Close</button>
    </div>
  )
}
