import { AdminTab } from './../../../entities/common/AdminTab'
import React from 'react'

interface Props {
  handleTabChange: (tab: AdminTab) => void
  activeTab?: AdminTab
}

const AdminTabNav: React.FC<Props> = ({
  handleTabChange: handleTabChange,
  activeTab: activetab,
  children,
}) => {
  return (
    <div className="admin-tab-nav">
      <nav className="admin-tab-nav__nav">
        <ul>
          <li className={activetab === AdminTab.AdminUsers ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.AdminUsers)}
              className={activetab === AdminTab.AdminUsers ? 'active' : ''}
              title="List of Admin Users"
            >
              Admin Users
            </button>
          </li>
          <li className={activetab === AdminTab.IdpProviders ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.IdpProviders)}
              className={activetab === AdminTab.IdpProviders ? 'active' : ''}
              title="List of Identity Providers"
            >
              Identity Providers
            </button>
          </li>
          <li
            className={activetab === AdminTab.IPNumbersControl ? 'active' : ''}
          >
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.IPNumbersControl)}
              className={
                activetab === AdminTab.IPNumbersControl ? 'active' : ''
              }
              title="Whitelisting and blacklisting of IP addresses"
            >
              IP Addresses
            </button>
          </li>
          <li className={activetab === AdminTab.Logs ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.Logs)}
              className={activetab === AdminTab.Logs ? 'active' : ''}
              title="Logs"
            >
              Logs
            </button>
          </li>
        </ul>
      </nav>
      <div className="admin-tab-nav__container__content">{children}</div>
    </div>
  )
}

export default AdminTabNav
