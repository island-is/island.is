const calculateAgentCount = (total, maxChunks, maxJobs) => {
  const chunksNeeded = Math.ceil(total / maxJobs)
  let optimizedChunksNeeded = Math.min(chunksNeeded, maxChunks)
  const jobsPerChunk = Math.ceil(total / optimizedChunksNeeded)
  let remainderJobs = total % jobsPerChunk

  const chunksMatrix = Array(optimizedChunksNeeded).fill(0)

  for (let i = 0; i < total; i++) {
    let chunkIndex = i % optimizedChunksNeeded

    if (remainderJobs > 0 && chunksMatrix[chunkIndex] < jobsPerChunk) {
      chunksMatrix[chunkIndex]++
      remainderJobs--
    } else {
      let minJobCount = Math.min(...chunksMatrix)
      chunkIndex = chunksMatrix.indexOf(minJobCount)
      chunksMatrix[chunkIndex]++
    }
  }

  return {
    chunksMatrix,
    chunksCount: chunksMatrix.filter((v) => v > 0).length,
    chunksNeeded: optimizedChunksNeeded,
    jobsPerChunk,
  }
}

const args = process.argv.slice(2)

if (args.length < 3) {
  console.error('Please provide three arguments.')
  process.exit(1)
}

const total = Number(args[0])
const maxChunks = Number(args[1])
const maxJobs = Number(args[2])

if (isNaN(total) || isNaN(maxChunks) || isNaN(maxJobs)) {
  console.error('All arguments must be valid numbers.')
  process.exit(1)
}

const result = calculateAgentCount(total, maxChunks, maxJobs)
console.log(JSON.stringify(result))
