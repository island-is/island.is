import React, { Component } from 'react'

const IsDeprecated = (InnerComponent, msg = '') =>
  class extends Component {
    componentWillMount() {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${InnerComponent.name} is deprecated`, msg)
      }
    }

    render() {
      return <InnerComponent {...this.props} />
    }
  }

export default IsDeprecated
