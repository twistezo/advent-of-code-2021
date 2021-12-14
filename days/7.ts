import fs from 'fs'

const crabs: number[] = fs
  .readFileSync('data/7.txt')
  .toString()
  .split(',')
  .map((e: string) => parseInt(e))

const min = Math.min(...crabs)
const max = Math.max(...crabs)

interface Crab {
  from: number
  to: number
  fuel: number
}

const result: Crab[][] = []
for (let i = min; i <= max; i++) {
  result.push([])

  crabs.forEach((crab: number, crabNumber: number) => {
    result[i].push({
      from: crab,
      to: i,
      fuel: Math.abs(i - crab),
    })
  })
}

interface BestPosition {
  newPosition: number
  fuelSum: number
}

const bestPositions: BestPosition[] = []
result.forEach((crabs: Crab[]) => {
  let fuelSum: number = 0
  crabs.forEach((crab: Crab) => {
    fuelSum += crab.fuel
  })

  bestPositions.push({ newPosition: crabs[0].to, fuelSum })
})
bestPositions.sort((a: BestPosition, b: BestPosition) => a.fuelSum - b.fuelSum)

console.log('Part one result:', bestPositions[0].fuelSum)
