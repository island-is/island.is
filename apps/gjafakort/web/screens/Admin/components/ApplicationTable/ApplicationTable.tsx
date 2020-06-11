import React from 'react'

function ApplicationTable({ applications }) {
  return (
    <div>
      {applications.map((application) => (
        <div>{application.id}</div>
      ))}
    </div>
  )
}

export default ApplicationTable
