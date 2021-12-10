import fs from 'fs'

const sonarData: number[] = fs
  .readFileSync('1.txt')
  .toString()
  .split('\n')
  .map((x: string): number => parseInt(x))
  .filter((x: number): number => x)

const countNumberOfIncreasesDepths = (data: number[]) => {
  let numberOfIncreasesDepths = 0

  data.reduce((current: number, next: number): number => {
    if (next > current) numberOfIncreasesDepths += 1
    return next
  })

  return numberOfIncreasesDepths
}

const convertToThreeMeasurementSlidingWindows = (data: number[]): number[] => {
  let sums: number[] = []

  for (let i = 0; i < data.length; i++) {
    const a = data[i]
    const b = data[i + 1]
    const c = data[i + 2]

    if (b && c) {
      sums.push(a + b + c)
    }
  }

  return sums
}

const partOne = countNumberOfIncreasesDepths(sonarData)
console.log('Part one result:', partOne)

const partTwo = countNumberOfIncreasesDepths(
  convertToThreeMeasurementSlidingWindows(sonarData)
)
console.log('Part two result:', partTwo)
