import React from 'react'
import { Link } from '@island.is/island-ui/core'

const Index = () => {
        return (
          <nav className="nav">
            <ul>
              <li className="nav__container">
                <Link href="/application/1">
                  <a>
                    Skref
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        )
      }


export default Index