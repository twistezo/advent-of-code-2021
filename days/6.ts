import fs from 'fs'

interface Fish {
  daysToBorn: number
  sum: number
}

const fish: Fish[] = fs
  .readFileSync('data/6.txt')
  .toString()
  .trim()
  .split(',')
  .map(
    (e: string): Fish => ({
      daysToBorn: parseInt(e),
      sum: 0,
    })
  )

const reproduce = (days: number) => {
  let reproduction: Fish[][] = [[...fish]]
  for (let i = 1; i <= days; i++) {
    const prevFish = reproduction[i - 1]
    // console.log('prevFish', prevFish)

    const bornFish: Fish[] = []
    const fish = prevFish.map((f: Fish) => {
      const { daysToBorn, sum } = f

      if (daysToBorn > 0) {
        const guessed = f.daysToBorn - 1
        return { daysToBorn: guessed, sum: sum + guessed }
      } else {
        bornFish.push({ daysToBorn: 8, sum: 0 })
        return { daysToBorn: 6, sum: 0 }
      }
    })

    reproduction.push([...fish, ...bornFish])
  }

  return reproduction
}

const reproductionA = reproduce(80)
console.log('Part one result:', reproductionA[reproductionA.length - 1].length)

// const reproductionB = reproduce(80)
// console.log('Part one result:', reproductionB[reproductionB.length - 1].length)
