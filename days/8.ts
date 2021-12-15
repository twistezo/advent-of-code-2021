import fs from 'fs'

interface Entry {
  signals: string[]
  outputs: string[]
}

enum DIGIT {
  zero = 'abcefg',
  one = 'cf',
  two = 'acdeg',
  three = 'acdfg',
  four = 'bcdf',
  five = 'abdfg',
  six = 'abdefg',
  seven = 'acf',
  eight = 'abcdefg',
  nine = 'abcdfg',
}

const uniqueDigits = [
  DIGIT['one'],
  DIGIT['four'],
  DIGIT['seven'],
  DIGIT['eight'],
]
const fiveDigits = [DIGIT['two'], DIGIT['three'], DIGIT['five']]
const sixDigits = [DIGIT['zero'], DIGIT['six'], DIGIT['nine']]

const prepareData = (): Entry[] => {
  const data = fs
    .readFileSync('data/8.txt')
    .toString()
    .trim()
    .split('\n')
    .map(e => e.split(' ').filter(e => e !== '|'))

  let entries: Entry[] = []
  data.forEach((row: string[], i: number) => {
    let entry: Entry = {
      signals: [],
      outputs: [],
    }

    row.forEach((s: string, j: number) => {
      if (j < 10) {
        entry.signals.push(s)
      } else {
        entry.outputs.push(s)
      }
    })
    entries.push(entry)
  })

  return entries
}

const findUniqueOutputs = (data: Entry[]): Entry['outputs'] => {
  let unique: string[] = []
  data.forEach((data: Entry) => {
    const { outputs } = data

    outputs.forEach((o: string) => {
      uniqueDigits.forEach(ud => {
        if (ud.length === o.length) {
          unique.push(o)
        }
      })
    })
  })

  return unique
}

const data = prepareData()
const uniqueOutputs = findUniqueOutputs(data)
console.log('Part one result', uniqueOutputs.length)
