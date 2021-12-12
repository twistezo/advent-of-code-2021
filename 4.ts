import fs from 'fs'

interface WinnerBoard {
  number: number
  board: number
  row?: number
  column?: number
  score: number
}

const numbers: number[] = fs
  .readFileSync('4.txt')
  .toString()
  .split('\n')[0]
  .split(',')
  .map(n => parseInt(n))

const rawBoards: number[][] = fs
  .readFileSync('4.txt')
  .toString()
  .split('\n')
  .filter(e => e)
  .splice(1)
  .map(b =>
    b
      .split(' ')
      .filter(e => e)
      .map(e => parseInt(e))
  )

const chunk = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, i) =>
    arr.slice(size * i, size + size * i)
  )

const boards: number[][][] = chunk(rawBoards, 5)

const playBingo = (numbers: number[], boards: number[][][]): WinnerBoard[] => {
  let winners: WinnerBoard[] = []

  numbers.forEach(number => {
    boards.forEach((board, boardNumber) => {
      board.forEach(row => {
        if (winners.some(w => w.board === boardNumber)) return

        const markIndex = row.findIndex(e => e === number)
        if (markIndex > -1) {
          row[markIndex] = -1

          const winner = checkWin(board, boardNumber, number)
          if (winner) {
            winners.push({ ...winner, score: calculateScore(winner, board) })
          }
        }
      })
    })
  })

  return winners
}

const checkWin = (
  board: number[][],
  boardNumber: number,
  number: number
): WinnerBoard | undefined => {
  // Check rows
  for (let [boardRowNum, row] of board.entries()) {
    const validRow = row.every(n => n === -1)
    if (validRow) {
      return {
        number,
        board: boardNumber,
        row: boardRowNum,
        score: 0,
      }
    }
  }

  // Check columns
  for (let i = 0; i < board.length; i++) {
    let column = []
    for (let j = 0; j < board[i].length; j++) {
      column.push(board[j][i])
    }

    const validColumn = column.every(n => n === -1)
    if (validColumn) {
      return {
        number,
        board: boardNumber,
        column: i,
        score: 0,
      }
    }
  }

  return undefined
}

const calculateScore = (wbr: WinnerBoard, board: number[][]): number => {
  const { number } = wbr

  let score = 0
  board.forEach(row => {
    row.forEach(n => {
      if (n !== -1) score += n
    })
  })

  return score * number
}

const winners = playBingo(numbers, boards)

console.log('Part one result:', winners[0].score)
console.log('Part two result:', winners[winners.length - 1].score)
