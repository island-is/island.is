import React from 'react'
import { useParams } from 'react-router-dom'

const VottordApplications = () => {
  // Using useParams to access the dynamic segments of the URL
  const { slug, id } = useParams()
  console.log('Params ', useParams())
  return (
    <div>
      <h1>Vottord Application Page</h1>
      <p>This is a placeholder for a list of the Vottord Application.</p>
      <p>Slug: {slug}</p>
      <p>ID: {id}</p>
    </div>
  )
}

export default VottordApplications
