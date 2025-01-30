import { AdminTab } from './../../../entities/common/AdminTab'
import React, { useState } from 'react'
import LocalizationUtils from '../../../utils/localization.utils'
import { Localization } from '../../../entities/common/Localization'

interface Props {
  handleTabChange: (tab: AdminTab) => void
  activeTab?: AdminTab
}

const AdminTabNav: React.FC<React.PropsWithChildren<Props>> = ({
  handleTabChange,
  activeTab: activetab,
  children,
}) => {
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )

  return (
    <div className="admin-tab-nav">
      <nav className="admin-tab-nav__nav">
        <ul>
          <li className={activetab === AdminTab.ApiScopeUsers ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.ApiScopeUsers)}
              className={activetab === AdminTab.ApiScopeUsers ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['apiScopeUsers']
                  .title
              }
            >
              {
                localization.navigations['adminTabNav'].items['apiScopeUsers']
                  .text
              }
            </button>
          </li>
          <li className={activetab === AdminTab.Domains ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.Domains)}
              className={activetab === AdminTab.Domains ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['domains'].title
              }
            >
              {localization.navigations['adminTabNav'].items['domains'].text}
            </button>
          </li>

          <li className={activetab === AdminTab.Users ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.Users)}
              className={activetab === AdminTab.Users ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['users'].title
              }
            >
              {localization.navigations['adminTabNav'].items['users'].text}
            </button>
          </li>
          <li className={activetab === AdminTab.ApiScopeGroups ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.ApiScopeGroups)}
              className={activetab === AdminTab.ApiScopeGroups ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['apiScopeGroups']
                  .title
              }
            >
              {
                localization.navigations['adminTabNav'].items['apiScopeGroups']
                  .text
              }
            </button>
          </li>
          <li className={activetab === AdminTab.IdpProviders ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.IdpProviders)}
              className={activetab === AdminTab.IdpProviders ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['idpProviders']
                  .title
              }
            >
              {
                localization.navigations['adminTabNav'].items['idpProviders']
                  .text
              }
            </button>
          </li>
          <li className={activetab === AdminTab.GrantTypes ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.GrantTypes)}
              className={activetab === AdminTab.GrantTypes ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['grantTypes']
                  .title
              }
            >
              {localization.navigations['adminTabNav'].items['grantTypes'].text}
            </button>
          </li>
          <li className={activetab === AdminTab.Language ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.Language)}
              className={activetab === AdminTab.Language ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['language'].title
              }
            >
              {localization.navigations['adminTabNav'].items['language'].text}
            </button>
          </li>
          <li className={activetab === AdminTab.Translation ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.Translation)}
              className={activetab === AdminTab.Translation ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['translation']
                  .title
              }
            >
              {
                localization.navigations['adminTabNav'].items['translation']
                  .text
              }
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
              title={
                localization.navigations['adminTabNav'].items[
                  'ipNumbersControl'
                ].title
              }
            >
              {
                localization.navigations['adminTabNav'].items[
                  'ipNumbersControl'
                ].text
              }
            </button>
          </li>
          <li className={activetab === AdminTab.Logs ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleTabChange(AdminTab.Logs)}
              className={activetab === AdminTab.Logs ? 'active' : ''}
              title={
                localization.navigations['adminTabNav'].items['logs'].title
              }
            >
              {localization.navigations['adminTabNav'].items['logs'].text}
            </button>
          </li>
        </ul>
      </nav>
      <div className="admin-tab-nav__container__content">{children}</div>
    </div>
  )
}

export default AdminTabNav
