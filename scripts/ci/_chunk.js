// This a script that given a list of strings, returns a list of comma-separated chunks of the original list


const apps = [
  { substr: 'templates', name: 'Templates' },
  { substr: 'judicial', name: 'Judicial System' },
  { substr: 'domains', name: 'Domains' },
  { substr: 'service', name: 'Services' },
  { substr: 'clients', name: 'Clients' },
]

// source: https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
function chunk(arr, size) {
  arr.sort()
  const parts = new Map()

  for (const item of arr) {
    const key = item.split('-')[0]
    if (!parts.has(key)) { parts.set(key, []) }
    parts.get(key).push(item)
  }

  console.log(parts)


  return parts.forEach((part) => parts[part].join(','))

  for (const app of apps) {
    const subPart = arr.filter((item) => item.indexOf(app.substr) !== -1)
    parts[part] = subPart
  }
  console.log('parts: ', parts)


  const result = Array.from({ length: Math.ceil(arr.length / size) }, (_v, i) =>
    arr.slice(i * size, i * size + size),
  )

  return result
}

// Chunk size
const chunkSize = 3  // parseInt(process.env['CHUNK_SIZE'] || '2')

let chunks = chunk(
  process.argv[2].split(',').map((s) => s.trim()),
  chunkSize,
)
  .map((ch) => ch.join(','))
  .filter((job) => job.length > 0)

process.stdout.write(JSON.stringify(chunks))
