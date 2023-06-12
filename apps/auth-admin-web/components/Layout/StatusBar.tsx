import { ApiStatusStore } from './../../store/ApiStatusStore'
import React, { useEffect, useState } from 'react'
import APIResponse from './../../entities/common/APIResponse'
import { BehaviorSubject } from 'rxjs'

const StatusBar: React.FC<React.PropsWithChildren<unknown>> = () => {
  const status$ = React.useRef(new BehaviorSubject(null))
  const [state, setState] = useState(new APIResponse())

  useEffect(() => {
    const subscription = ApiStatusStore.getInstance().status.subscribe(
      (value) => setState(value),
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [status$])

  const getMessage = (value: APIResponse) => {
    if (typeof value?.message === 'string') {
      return <span>{value.message}</span>
    } else {
      return value?.message.map((item) => <span>{item}</span>)
    }
  }

  if (state.statusCode === 0) return null

  return (
    <div className={`statusbar ${state?.statusCode > 399 ? 'error' : ''}`}>
      <div className="statusbar__message">{getMessage(state)}</div>
      <div className="statusbar__code">{state.statusCode}</div>
      <div className="statusbar__error">{state.error}</div>
      <div className="hidden">v0.5</div>
    </div>
  )
}

export default StatusBar
