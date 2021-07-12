import React, { ReactNode } from 'react'

import Link from 'next/link'

import * as styles from './TableBody.treat'
import { useRouter } from 'next/router'

import cn from 'classnames'

interface PageProps {
  application: TableBodyProps
  index: number
}

interface TableBodyProps {
  listElement: JSX.Element[]
  link: string
}

const TableBody: React.FC<PageProps> = ({ application, index }) => {
  return (
    <Link href={'application/' + application.link} key={'key-' + index}>
      <tr className={styles.link}>
        {application?.listElement && (
          <>
            {application.listElement.map(
              (el: ReactNode, listElementIndex: number) => {
                return (
                  <td
                    className={cn({
                      [`${styles.tablePadding}`]: true,
                      [`${styles.firstChildPadding}`]: listElementIndex === 0,
                    })}
                    key={'tr-' + index + '-td-' + listElementIndex}
                  >
                    {el}
                  </td>
                )
              },
            )}
          </>
        )}
      </tr>
    </Link>
  )
}

export default TableBody
