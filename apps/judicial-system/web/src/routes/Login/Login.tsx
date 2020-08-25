import React, { useState, useEffect } from 'react'

import './App.scss'

import fetch from 'isomorphic-fetch'

export const Login = () => {
  const [messageFromAPI, setMessageFromAPI] = useState('')

  useEffect(() => {
    let isMounted = true

    async function getData() {
      const rawResponse = await fetch('http://localhost:3333/cases')
      const jsonResponse = await rawResponse.json()

      // Prevent setting state on unmounted component
      if (isMounted) {
        setMessageFromAPI(jsonResponse.length)
      }
    }

    getData()

    return () => {
      isMounted = false
    } // use effect cleanup to set flag false, if unmounted
  })

  return <div className="app">{messageFromAPI}</div>
}

export default Login
