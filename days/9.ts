import fs from 'fs'

const heightMap: number[][] = fs
  .readFileSync('data/9.txt')
  .toString()
  .trim()
  .split('\n')
  .map((row: string) => row.split('').map((s: string) => parseInt(s)))
console.log(heightMap.map(h => h.toString()))

const tryToFindLowestAdjacent = (
  heightMap: number[][],
  y: number,
  x: number
): number | null => {
  const point: number = heightMap[y][x]
  const left: number | null = heightMap?.[y]?.[x - 1] ?? null
  const right: number | null = heightMap?.[y]?.[x + 1] ?? null
  const up: number | null = heightMap?.[y - 1]?.[x] ?? null
  const down: number | null = heightMap?.[y + 1]?.[x] ?? null

  const isLowest = [left, right, up, down]
    .filter((a: number | null) => a !== null)
    .every((a: number) => point < a)

  // console.log('Point:', point)
  // console.log(' left:', left, 'right:', right, 'up:', up, 'down:', down)
  // console.log(' isLowest:', isLowest)

  return isLowest ? point : null
}

const getLowestPoints = (heightMap: number[][]): number[] => {
  let lowestPoints: number[] = []
  heightMap.forEach((row: number[], y: number) => {
    row.forEach((n: number, x: number) => {
      const lowestAdjacent = tryToFindLowestAdjacent(heightMap, y, x)
      if (lowestAdjacent !== null) {
        lowestPoints.push(lowestAdjacent)
      }
    })
  })

  return lowestPoints
}

const calculateRiskLevel = (lowestPoints: number[]) => {
  let riskLevel = 0
  lowestPoints.forEach((lp: number) => {
    riskLevel += lp + 1
  })

  return riskLevel
}

const lowestPoints = getLowestPoints(heightMap)
const riskLevel = calculateRiskLevel(lowestPoints)
console.log('Part one result:', riskLevel)
