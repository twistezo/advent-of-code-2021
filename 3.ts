import fs from 'fs'

enum RatingType {
  MOST_COMMON_BITS,
  LEAST_COMMON_BITS,
}

interface PowerConsumptionResult {
  mostCommonBits: number[]
  leastCommonBits: number[]
  powerConsumption: number
}

const diagnosticReport: string[] = fs
  .readFileSync('3.txt')
  .toString()
  .split('\n')
  .filter(x => x)

const calculatePowerConsumption = (
  diagnosticReport: string[]
): PowerConsumptionResult => {
  let mostCommonBits: number[] = []
  let leastCommonBits: number[] = []

  getVerticalBits(diagnosticReport).forEach((bits: string[]) => {
    const parsedBits = bits.map((bit: string): number => parseInt(bit))
    mostCommonBits.push(getMostCommonNumber(parsedBits))
  })
  leastCommonBits = mostCommonBits.map((b: number): number => turnOverBit(b))

  const gammaBinary: string = mostCommonBits.join('')
  const epsilonBinary: string = leastCommonBits.join('')
  const gamma: number = parseInt(gammaBinary, 2)
  const epsilon: number = parseInt(epsilonBinary, 2)

  return {
    mostCommonBits,
    leastCommonBits,
    powerConsumption: gamma * epsilon,
  }
}

const getVerticalBits = (diagnosticReport: string[]): string[][] => {
  let verticalBits: string[][] = []

  diagnosticReport.forEach((row: string) => {
    row.split('').forEach((bit: string, i: number) => {
      if (verticalBits.length <= i) {
        verticalBits.push([])
      }
      verticalBits[i].push(bit)
    })
  })

  return verticalBits
}

const getMostCommonNumber = (numbers: number[]): number =>
  numbers
    .sort(
      (a, b) =>
        numbers.filter(v => v === a).length -
        numbers.filter(v => v === b).length
    )
    .pop()!

const turnOverBit = (number: number): number => (number === 0 ? 1 : 0)

const determineRating = (
  diagnosticReport: string[],
  ratingType: RatingType,
  powerConsumptionResult: PowerConsumptionResult
) => {
  const { mostCommonBits, leastCommonBits } = powerConsumptionResult
  const powerConsumptionBits: number[] =
    ratingType === RatingType.MOST_COMMON_BITS
      ? mostCommonBits
      : leastCommonBits

  let bitLastPosition: number = 0
  let shouldStop: boolean = false
  let filteredReport: string[] = diagnosticReport
  let filters: string[] = []

  for (let [i] of powerConsumptionBits.entries()) {
    filters = filteredReport.filter((row: string, j) => {
      if (shouldStop) {
        return
      }

      const rowBits: number[] = row
        .split('')
        .map((b: string): number => parseInt(b))
      const pcb: number = powerConsumptionBits[i]
      const currentBit: number = rowBits[i]

      if (filteredReport.length > 2) {
        return pcb === currentBit
      } else {
        shouldStop = true
        bitLastPosition = i
      }
    })

    if (shouldStop) {
      return
    }

    filteredReport = filteredReport.filter(bits => filters.includes(bits))
  }

  return parseInt(chooseResult(ratingType, filteredReport, bitLastPosition), 2)
}

const chooseResult = (
  ratingType: RatingType,
  filteredReport: string[],
  bitLastPosition: number
): string => {
  const a = parseInt(filteredReport[0][bitLastPosition])
  const b = parseInt(filteredReport[1][bitLastPosition])

  switch (ratingType) {
    case RatingType.MOST_COMMON_BITS:
      return a > b ? filteredReport[0] : filteredReport[1]

    case RatingType.LEAST_COMMON_BITS: {
      return a < b ? filteredReport[1] : filteredReport[0]
    }
  }
}

const powerConsumptionResult = calculatePowerConsumption(diagnosticReport)
console.log('Part one result:', powerConsumptionResult.powerConsumption)

const oxygenGeneratorRating = determineRating(
  diagnosticReport,
  RatingType.MOST_COMMON_BITS,
  powerConsumptionResult
)

const co2GeneratorRating = determineRating(
  diagnosticReport,
  RatingType.LEAST_COMMON_BITS,
  powerConsumptionResult
)

if (oxygenGeneratorRating && co2GeneratorRating) {
  console.log('Part two result:', oxygenGeneratorRating * co2GeneratorRating)
}
