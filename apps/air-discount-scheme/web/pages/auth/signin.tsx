import { Link } from '@island.is/island-ui/core';
import React from 'react'
import { NextApiRequest, NextApiResponse } from 'next'
import { signIn, getSession, csrfToken, getProviders } from "next-auth/client"
import { useAuth } from "@island.is/air-discount-scheme-web/utils/hooks/useAuth"

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   signIn('identity-server')
// }
const SignIn: React.FC = () => 
{
  console.log(process.env.NEXTAUTH_URL)
  const { user } = useAuth()
  if(user) {
    console.log('signin user : ' + user)
    return
  }
  //const { data: session } = useSession()
  //console.log(AppContext.Provider._context[1])
  //return <button onClick={() => signIn(identityServerConfig.id)}>Sign in plz</button>
  return (
    // <h1><a onClick={async (e) => {
    //   e.preventDefault()
    //   await signIn()
    //   //router.push('/api/auth/signin')
    // }}>SignIn</a></h1>
    <h1>
      <Link href='/api/auth/signin'>NICE LINK</Link>
    </h1>
  )
  //return <a href="/api/auth/signin">SIGN IN</a>
}
export default SignIn