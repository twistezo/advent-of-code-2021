import fs from 'fs'

interface Point {
  x: number
  y: number
}

type LowestPoint = {
  value: number
} & Point

type Basin = LowestPoint

enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const heightMap: number[][] = fs
  .readFileSync('data/9.txt')
  .toString()
  .trim()
  .split('\n')
  .map((row: string) => row.split('').map((s: string) => parseInt(s)))

const tryToFindLowestAdjacent = (
  heightMap: number[][],
  x: number,
  y: number
): LowestPoint | null => {
  const point: number = heightMap[y][x]
  const left: number | null = heightMap?.[y]?.[x - 1] ?? null
  const right: number | null = heightMap?.[y]?.[x + 1] ?? null
  const up: number | null = heightMap?.[y - 1]?.[x] ?? null
  const down: number | null = heightMap?.[y + 1]?.[x] ?? null

  const isLowest = [left, right, up, down]
    .filter((a: number | null) => a !== null)
    .every((a: number) => point < a)

  return isLowest ? { value: point, x, y } : null
}

const getLowestPoints = (heightMap: number[][]): LowestPoint[] => {
  let lowestPoints: LowestPoint[] = []
  heightMap.forEach((row: number[], y: number) => {
    row.forEach((n: number, x: number) => {
      const lowestAdjacent = tryToFindLowestAdjacent(heightMap, x, y)
      if (lowestAdjacent !== null) {
        lowestPoints.push(lowestAdjacent)
      }
    })
  })

  return lowestPoints
}

const calculateRiskLevel = (lowestPoints: LowestPoint[]) => {
  let riskLevel = 0
  lowestPoints.forEach((lp: LowestPoint) => {
    riskLevel += lp.value + 1
  })

  return riskLevel
}

const lowestPoints: LowestPoint[] = getLowestPoints(heightMap)
const riskLevel = calculateRiskLevel(lowestPoints)
console.log('Part one result:', riskLevel)

const nextPointInDirection = (
  x: number,
  y: number,
  direction: DIRECTION
): Point => {
  let point: Point = { x, y }
  if (direction === DIRECTION.LEFT) {
    point.x -= 1
  } else if (direction === DIRECTION.RIGHT) {
    point.x += 1
  } else if (direction === DIRECTION.UP) {
    point.y -= 1
  } else if (direction === DIRECTION.DOWN) {
    point.y += 1
  }

  return point
}

const findBasinsInDirection = (
  x: number,
  y: number,
  direction: DIRECTION,
  heightMap: number[][]
): Basin[] => {
  let basins: Basin[] = []
  let nextPoint: Point = nextPointInDirection(x, y, direction)
  let value: number | null = heightMap?.[nextPoint.y]?.[nextPoint.x] ?? null

  while (value !== null) {
    if (value === 9) {
      break
    }

    let currentPoint = nextPoint
    nextPoint = nextPointInDirection(nextPoint.x, nextPoint.y, direction)

    basins.push({ ...currentPoint, value })
    value = heightMap?.[nextPoint.y]?.[nextPoint.x] ?? null
  }

  return basins
}

const findBasinsInFourDirections = (
  point: Point,
  heightMap: number[][]
): LowestPoint[] => {
  const left = findBasinsInDirection(
    point.x,
    point.y,
    DIRECTION.LEFT,
    heightMap
  )
  const right = findBasinsInDirection(
    point.x,
    point.y,
    DIRECTION.RIGHT,
    heightMap
  )
  const up = findBasinsInDirection(point.x, point.y, DIRECTION.UP, heightMap)
  const down = findBasinsInDirection(
    point.x,
    point.y,
    DIRECTION.DOWN,
    heightMap
  )

  return [...left, ...right, ...up, ...down]
}

const deduplicateArray = <T>(arr: Array<T>): Array<T> => [
  ...new Map(arr.map(v => [JSON.stringify(v), v])).values(),
]

const getBasins = (
  lowestPoints: LowestPoint[],
  heightMap: number[][]
): LowestPoint[][] => {
  let basins: LowestPoint[][] = []
  lowestPoints.forEach((lp: LowestPoint, i) => {
    let basinInFourDir: LowestPoint[] = findBasinsInFourDirections(
      { x: lp.x, y: lp.y },
      heightMap
    )
    let localBasin: LowestPoint[] = [...basinInFourDir]

    basinInFourDir.forEach((p: LowestPoint) => {
      basinInFourDir = findBasinsInFourDirections({ x: p.x, y: p.y }, heightMap)
      localBasin.push(...basinInFourDir)
    })
    localBasin = deduplicateArray(localBasin)
    basins.push(localBasin)
  })

  return basins
}

const calculateThreeLargestBasins = (basins: LowestPoint[][]): number =>
  basins
    .map((b: LowestPoint[]) => b.length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b)

const basins = getBasins(lowestPoints, heightMap)
const threeLargestBasinsScore = calculateThreeLargestBasins(basins)
console.log('Part two result:', threeLargestBasinsScore)
