'use client'

interface FallbackCustomComponentProps {
  componentName: string
  [key: string]: unknown
}

export default function FallbackCustomComponent({
  componentName,
  ...props
}: FallbackCustomComponentProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          border: '2px dashed #ff6b35',
          borderRadius: '8px',
          padding: '1rem',
          margin: '0.5rem 0',
          background: '#fff5f0',
        }}
      >
        <strong>Custom Component: {componentName}</strong>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
    )
  }

  return null
}
