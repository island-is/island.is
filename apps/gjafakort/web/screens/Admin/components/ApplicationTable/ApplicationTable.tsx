import React from 'react'

function ApplicationTable({ applications }) {
  return (
    <div>
      <table style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <th>CompanyName</th>
          <th>Name</th>
          <th>Email</th>
          <th>State</th>
          <th>CompanySSN</th>
          <th>NO of logs</th>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr>
              <td>{application.companyName}</td>
              <td>{application.name}</td>
              <td>{application.email}</td>
              <td>{application.state}</td>
              <td>{application.companySSN}</td>
              <td>{application.logs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicationTable
