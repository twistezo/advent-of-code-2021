import fs from 'fs'

const data: Bracket[][] = fs
  .readFileSync('data/10.txt')
  .toString()
  .trim()
  .split('\n')
  .map((row: string): Bracket[] =>
    row.split('').map((e: string): Bracket => e as Bracket)
  )

type Bracket = '(' | ')' | '[' | ']' | '{' | '}' | '<' | '>'

interface Pair {
  left: {
    bracket: Bracket
    index?: number
  }
  right: {
    bracket: Bracket
    index?: number
  }
}

const LEGAL_PAIRS: Pair[] = [
  { left: { bracket: '(' }, right: { bracket: ')' } },
  { left: { bracket: '[' }, right: { bracket: ']' } },
  { left: { bracket: '{' }, right: { bracket: '}' } },
  { left: { bracket: '<' }, right: { bracket: '>' } },
]

const SCORES_A = [
  { bracket: ')', score: 3 },
  { bracket: ']', score: 57 },
  { bracket: '}', score: 1197 },
  { bracket: '>', score: 25137 },
]

const SCORES_B = [
  { bracket: ')', score: 1 },
  { bracket: ']', score: 2 },
  { bracket: '}', score: 3 },
  { bracket: '>', score: 4 },
]

const removePairs = (brackets: Bracket[], legalParis: Pair[]): Bracket[] => {
  let tempBrackets: Bracket[] = [...brackets]

  const indexesToRemove: number[] = [
    ...legalParis.map((lp: Pair) => lp.left.index!),
    ...legalParis.map((lp: Pair) => lp.right.index!),
  ].sort((a, b) => a - b) // asc

  for (let i = indexesToRemove.length - 1; i >= 0; i--) {
    tempBrackets.splice(indexesToRemove[i], 1)
  }

  return tempBrackets
}

const findLegalPairs = (brackets: Bracket[]): Pair[] => {
  let legalPairs: Pair[] = []

  for (let i = 0; i <= brackets.length; i += 1) {
    let a: Bracket = brackets[i]
    let b: Bracket | undefined = brackets[i + 1]

    const isLegalPair = LEGAL_PAIRS.some(
      (lp: Pair) => a === lp.left.bracket && b === lp.right.bracket
    )

    if (isLegalPair) {
      legalPairs.push({
        left: { bracket: a, index: i },
        right: { bracket: b, index: i + 1 },
      })
    }
  }

  return legalPairs
}

const findIllegalsInRow = (brackets: Bracket[]): Bracket[] => {
  let pairs: Pair[] = findLegalPairs(brackets)
  brackets = removePairs(brackets, pairs)

  while (pairs.length > 0) {
    pairs = findLegalPairs(brackets)
    brackets = removePairs(brackets, pairs)
  }

  return brackets
}

const findIllegalBrackets = (data: Bracket[][]): Bracket[][] =>
  data.map((row: Bracket[]) => findIllegalsInRow([...row]))

const calculateScoreForIllegalBrackets = (brackets: Bracket[][]): number => {
  let firstBrackets: Bracket[] = []

  brackets.forEach((row: Bracket[]) => {
    let firstRightBracketIndex: number = row.findIndex((br: Bracket) =>
      LEGAL_PAIRS.some((lp: Pair) => lp.right.bracket === br)
    )
    firstBrackets.push(row[firstRightBracketIndex])
  })

  const score = firstBrackets
    .filter(b => b)
    .map((b: Bracket) => SCORES_A.find(s => s.bracket === b)!.score)
    .reduce((sum, a) => sum + a, 0)

  return score
}

const findRightBrackets = (brackets: Bracket[][]): Bracket[][] => {
  const leftBrackets = [...brackets]
  const rightBrackets: Bracket[][] = []

  leftBrackets.forEach((row: Bracket[]) => {
    const rowRightBrackets: Bracket[] = []

    row.reverse().forEach((lb: Bracket) => {
      const rb: Bracket | undefined = LEGAL_PAIRS.find(
        (lp: Pair) => lp.left.bracket === lb
      )?.right.bracket

      if (rb) rowRightBrackets.push(rb)
    })

    rightBrackets.push(rowRightBrackets)
  })

  return rightBrackets
}

const calculateScoreForRightBrackets = (brackets: Bracket[][]): number => {
  let scores: number[] = []

  brackets.forEach((row: Bracket[]) => {
    let localScore = 0
    row.forEach((br: Bracket) => {
      localScore = localScore * 5 + SCORES_B.find(s => s.bracket === br)!.score
    })

    scores.push(localScore)
  })

  return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
}

const illegalBrackets = findIllegalBrackets(data)
const scoreOfIllegalBrackets = calculateScoreForIllegalBrackets(illegalBrackets)
console.log('Part one result:', scoreOfIllegalBrackets)

const rightBrackets = findRightBrackets(illegalBrackets)
const scoreOfRightBrackets = calculateScoreForRightBrackets(rightBrackets)
console.log('Part two result:', scoreOfRightBrackets) // 3049320156
