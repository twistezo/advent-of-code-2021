import fs from 'fs'

interface Entry {
  inputs: Signal[]
  outputs: Signal[]
}

interface Signal {
  num: number
  val: string
}

const sortString = (s: string): string => s.split('').sort().join('')

const parseEntries = (): Entry[] => {
  const data = fs
    .readFileSync('data/8.txt')
    .toString()
    .trim()
    .split('\n')
    .map(e => e.split(' ').filter(e => e !== '|'))

  let entries: Entry[] = []
  data.forEach((row: string[]) => {
    let entry: Entry = {
      inputs: [],
      outputs: [],
    }

    row.forEach((s: string, i: number) => {
      entry[i < 10 ? 'inputs' : 'outputs'].push({
        num: -1,
        val: sortString(s),
      })
    })
    entries.push(entry)
  })

  return entries
}

const getUniqueOutputs = (
  data: Entry[],
  uniqueSignalsExample: Signal[]
): Signal[] => {
  let uniques: Signal[] = []
  data.forEach((e: Entry) => {
    const { outputs } = e

    outputs.forEach((s: Signal) => {
      uniqueSignalsExample.forEach((us: Signal) => {
        if (us.val.length === s.val.length) {
          uniques.push(s)
        }
      })
    })
  })

  return uniques
}

const data = parseEntries()
const uniqueSignalsExample = [
  { num: 1, val: 'cf' },
  { num: 4, val: 'bcdf' },
  { num: 7, val: 'acf' },
  { num: 8, val: 'abcdefg' },
]
console.log(
  'Part one result',
  getUniqueOutputs(data, uniqueSignalsExample).length
)

const signalTableContains = (signalTable: Signal[], signal: Signal) =>
  signalTable.findIndex((s: Signal) => s.val === signal.val) > -1

const areLettersIncluded = (a: string, b: string): boolean =>
  a.split('').every(a => b.split('').findIndex(b => b === a) > -1)

const findSignalValByNum = (n: Signal['num'], st: Signal[]): Signal['val'] =>
  st.find((s: Signal) => s.num === n)!.val

const changeSignalNumByVal = (
  v: Signal['val'],
  newNum: Signal['num'],
  st: Signal[]
): void => void (st[st.findIndex((s: Signal) => s.val === v)].num = newNum)

const deductSignalTables = (
  entries: Entry[],
  uniqueSignalsExample: Signal[]
): Signal[][] => {
  let signalTables: Signal[][] = []

  entries.forEach((e: Entry) => {
    let signalTable: Signal[] = []
    const { inputs, outputs } = e
    let entry: Entry = {
      inputs: [],
      outputs: [],
    }

    // find ones of 1,4,7,8 in outputs
    outputs.forEach((s: Signal) => {
      uniqueSignalsExample.forEach((us: Signal) => {
        if (us.val.length === s.val.length) {
          entry.outputs.push({ num: us.num, val: s.val })
        }
      })
    })
    entry.outputs.forEach((s: Signal) => void signalTable.push(s))

    // find ones of 1,4,7,8 in inputs
    inputs.forEach((s: Signal) => {
      uniqueSignalsExample.forEach((us: Signal) => {
        if (
          us.val.length === s.val.length &&
          !signalTableContains(signalTable, s)
        ) {
          entry.inputs.push({ num: us.num, val: s.val })
        }
      })
    })
    entry.inputs.forEach((s: Signal) => void signalTable.push(s))

    // append unknonw inputs
    inputs.forEach((s: Signal) => {
      if (!signalTableContains(signalTable, s)) {
        signalTable.push(s)
      }
    })

    // deduce six numbers
    signalTable.forEach((s: Signal) => {
      if (s.num === -1) {
        const one = findSignalValByNum(1, signalTable)
        const four = findSignalValByNum(4, signalTable)

        // six numbers
        if (s.val.split('').length === 6) {
          if (!areLettersIncluded(one, s.val)) {
            // 6 does not contains 1
            changeSignalNumByVal(s.val, 6, signalTable)
          } else if (
            // 9 contains both 1 and 4
            areLettersIncluded(one, s.val) &&
            areLettersIncluded(four, s.val)
          ) {
            changeSignalNumByVal(s.val, 9, signalTable)
          } else {
            changeSignalNumByVal(s.val, 0, signalTable)
          }
        }
      }
    })

    // deduce five numbers
    signalTable.forEach((s: Signal) => {
      if (s.num === -1) {
        const one = findSignalValByNum(1, signalTable)

        // five numbers
        if (s.val.split('').length === 5) {
          const nine = findSignalValByNum(9, signalTable)
          if (areLettersIncluded(one, s.val)) {
            // 3 includes 1
            changeSignalNumByVal(s.val, 3, signalTable)
          } else if (
            // 5 does not include 1 but is included in 9
            !areLettersIncluded(one, s.val) &&
            areLettersIncluded(s.val, nine)
          ) {
            changeSignalNumByVal(s.val, 5, signalTable)
          } else {
            changeSignalNumByVal(s.val, 2, signalTable)
          }
        }
      }
    })

    signalTables.push(signalTable)
  })

  return signalTables
}

const decodeSignal = (signal: Signal, signalTable: Signal[]) =>
  signalTable.find((s: Signal) => signal.val === s.val)!.num

const decodeOutputs = (signalTables: Signal[][]): string[] => {
  let docodedOutputs: string[] = []
  data.forEach((entry: Entry, i: number) => {
    let decodedOutput: string = ''
    entry.outputs.forEach((s: Signal) => {
      decodedOutput += decodeSignal(s, signalTables[i])
    })
    docodedOutputs.push(decodedOutput)
  })

  return docodedOutputs
}

const sumDecodedOutputs = (docodedOutputs: string[]) => {
  let sum = 0
  docodedOutputs.forEach((o: string) => {
    sum += parseInt(o)
  })

  return sum
}

const signalTables: Signal[][] = deductSignalTables(data, uniqueSignalsExample)
const docodedOutputs: string[] = decodeOutputs(signalTables)
const sumOfDecodedOutputs: number = sumDecodedOutputs(docodedOutputs)
console.log('Part two result', sumOfDecodedOutputs)
