import fs from 'fs'

type DayToBorn = number

const fish: DayToBorn[] = fs
  .readFileSync('data/6.txt')
  .toString()
  .trim()
  .split(',')
  .map((e: string): DayToBorn => parseInt(e))

const reproduce = (initialDays: DayToBorn[], days: number): number => {
  let reproduction = [[...initialDays]]

  for (let i = 1; i <= days; i++) {
    const prevDays = reproduction[0]
    const newFishes: DayToBorn[] = []

    const currDays = prevDays.map((dtb: DayToBorn) => {
      if (dtb > 0) {
        return dtb - 1
      } else {
        newFishes.push(8)
        return 6
      }
    })

    reproduction.push([...currDays, ...newFishes])
    reproduction.shift()
  }

  return reproduction[reproduction.length - 1].length
}

const reproduceWithGroups = (
  initialDays: DayToBorn[],
  days: number
): number => {
  const groups: number[] = new Array(9).fill(0)
  initialDays.forEach((fish: number) => {
    groups[fish] += 1
  })

  for (let i = 0; i < days; i++) {
    const newFishes = groups.shift()!
    groups.push(newFishes)
    groups[6] += newFishes
  }

  let sum = 0
  groups.forEach((g: number) => {
    sum += g
  })

  return sum
}

const reproductionA = reproduce(fish, 80)
console.log('Part one result:', reproductionA)

const reproductionB = reproduceWithGroups(fish, 256)
console.log('Part two result:', reproductionB)
