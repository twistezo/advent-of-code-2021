import fs from 'fs'

interface Crab {
  from: number
  to: number
  fuel: number
}

interface BestPosition {
  newPosition: number
  fuelSum: number
}

enum FuelCost {
  ONE_STEP,
  INCREMENTAL,
}

const startPositions: number[] = fs
  .readFileSync('data/7.txt')
  .toString()
  .split(',')
  .map((e: string) => parseInt(e))

const min = Math.min(...startPositions)
const max = Math.max(...startPositions)

const calculatePositions = (
  startPositions: number[],
  fuelCost: FuelCost
): Crab[][] => {
  const result: Crab[][] = []
  for (let i = min; i <= max; i++) {
    result.push([])

    startPositions.forEach((crab: number, crabNumber: number) => {
      const fuel =
        fuelCost === FuelCost.ONE_STEP
          ? Math.abs(i - crab)
          : calculateFuelINC(crab, i)

      result[i].push({
        from: crab,
        to: i,
        fuel,
      })
    })
  }

  return result
}

const calculateFuelINC = (from: number, to: number) => {
  const min = Math.min(...[from, to])
  const max = Math.max(...[from, to])

  let sum = 0
  let temp = 0
  for (let i = min + 1; i <= max; i++) {
    temp += 1
    sum += temp
  }
  return sum
}

const findPositionWithLeastFuel = (positions: Crab[][]) => {
  const bestPositions: BestPosition[] = []
  positions.forEach((crabs: Crab[]) => {
    let fuelSum: number = 0
    crabs.forEach((crab: Crab) => {
      fuelSum += crab.fuel
    })

    bestPositions.push({ newPosition: crabs[0].to, fuelSum })
  })

  bestPositions.sort(
    (a: BestPosition, b: BestPosition) => a.fuelSum - b.fuelSum
  )

  return bestPositions[0]
}

const positionsOS = calculatePositions(startPositions, FuelCost.ONE_STEP)
const bestPositionOS = findPositionWithLeastFuel(positionsOS)
console.log('Part one result:', bestPositionOS.fuelSum)

const positionsINC = calculatePositions(startPositions, FuelCost.INCREMENTAL)
const bestPositionINC = findPositionWithLeastFuel(positionsINC)
console.log('Part two result:', bestPositionINC.fuelSum)
