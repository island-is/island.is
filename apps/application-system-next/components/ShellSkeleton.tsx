export function ShellSkeleton() {
  return (
    <div
      style={{
        maxWidth: '840px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'IBM Plex Sans, sans-serif',
      }}
    >
      <div
        style={{
          height: '24px',
          width: '200px',
          background: '#e6e6e6',
          borderRadius: '4px',
          marginBottom: '1.5rem',
        }}
      />
      <div
        style={{
          height: '40px',
          width: '60%',
          background: '#e6e6e6',
          borderRadius: '4px',
          marginBottom: '2rem',
        }}
      />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '56px',
            width: '100%',
            background: '#f2f2f2',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        />
      ))}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <div
          style={{
            height: '48px',
            width: '120px',
            background: '#e6e6e6',
            borderRadius: '8px',
          }}
        />
        <div
          style={{
            height: '48px',
            width: '120px',
            background: '#0061ff',
            borderRadius: '8px',
            opacity: 0.3,
          }}
        />
      </div>
    </div>
  )
}
