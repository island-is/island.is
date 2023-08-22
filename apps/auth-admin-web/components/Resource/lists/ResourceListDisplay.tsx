/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

interface Props {
  list: any
  header: string
  linkHeader: string
  linkHeaderHelp: string
  createUri: string
  lastPage: number
  handlePageChange: (page: number, count: number) => void
  edit: (object: any) => void
  remove: (name: string) => void
}

const ResourceListDisplay: React.FC<React.PropsWithChildren<Props>> = ({
  list,
  header,
  linkHeader,
  createUri,
  lastPage,
  linkHeaderHelp,
  handlePageChange,
  edit,
  remove,
}) => {
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('ResourceListDisplay'),
  )

  return (
    <div>
      <div className="identity-resources">
        <div className="identity-resources__wrapper">
          <div className="identity-resources__container">
            <h1>{header}</h1>
            <div className="identity-resources__container__options">
              <div className="identity-resources__container__button">
                {/* Change href link */}
                <Link
                  href={createUri}
                  className="identity-resources__button__new"
                  title={linkHeaderHelp}
                >
                  <i className="icon__new"></i>
                  {linkHeader}
                </Link>
              </div>
            </div>
            <div className="client__container__table">
              <table className="identity-resources__table">
                <thead>
                  <tr>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['displayName'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((resource: any) => {
                    return (
                      <tr
                        key={resource.name}
                        className={resource.archived ? 'archived' : ''}
                      >
                        <td>{resource.name}</td>
                        <td>{resource.displayName}</td>
                        <td className="identity-resources__table__button">
                          <button
                            type="button"
                            className={`identity-resources__button__edit${
                              resource.archived ? ' hidden' : ''
                            }`}
                            onClick={() => edit(resource)}
                            title={localization.buttons['edit'].helpText}
                          >
                            <i className="icon__edit"></i>
                            <span>{localization.buttons['edit'].text}</span>
                          </button>
                        </td>
                        <td className="identity-resources__table__button">
                          <button
                            type="button"
                            className={`identity-resources__button__delete${
                              resource.archived ? ' hidden' : ''
                            }`}
                            onClick={() => remove(resource.name)}
                            title={localization.buttons['remove'].helpText}
                          >
                            <i className="icon__delete"></i>
                            <span>{localization.buttons['remove'].text}</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Paginator
              lastPage={lastPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceListDisplay
