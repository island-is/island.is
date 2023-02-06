import { useLoaderData } from 'react-router-dom'

const ChildRouteLazy = () => {
  const data = useLoaderData()

  return (
    <div>
      <h1>I am child route lazy</h1>
      <ul>
        {(data as any)?.map((item: any, index: number) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ChildRouteLazy
