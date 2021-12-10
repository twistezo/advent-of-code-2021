import fs from 'fs'

interface WinnerBoardResult {
  board: number
  winnerNumber: number
  column?: number
  row?: number
}

const numbers: number[] = fs
  .readFileSync('4.txt')
  .toString()
  .split('\n')[0]
  .split(',')
  .map(n => parseInt(n))

const rawBoards = fs
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

const boards = chunk(rawBoards, 5)

const markNumbers = (
  numbers: number[],
  boards: number[][][]
): WinnerBoardResult | undefined => {
  for (let [, number] of numbers.entries()) {
    for (let [, board] of boards.entries()) {
      for (let [, row] of board.entries()) {
        const markIndex = row.findIndex(e => e === number)
        if (markIndex > -1) {
          row[markIndex] = NaN
        }

        const winner = findWinner(boards, number)
        if (winner) {
          return winner
        }
      }
    }
  }
}

const findWinner = (
  boards: number[][][],
  winnerNumber: number
): WinnerBoardResult | undefined => {
  for (let [boardNum, board] of boards.entries()) {
    // Check columns
    for (let i = 0; i < board.length; i++) {
      let column = []
      for (let j = 0; j < board[i].length; j++) {
        column.push(board[j][i])
      }

      const validColumn = column.every(n => n.toString() == 'NaN')
      if (validColumn) {
        return {
          board: boardNum,
          column: i,
          row: undefined,
          winnerNumber,
        }
      }
    }

    // Check rows
    for (let [boardRowNum, boardRow] of board.entries()) {
      const validRow = boardRow.every(n => n.toString() == 'NaN')
      if (validRow) {
        return {
          board: boardNum,
          column: undefined,
          row: boardRowNum,
          winnerNumber,
        }
      }
    }
  }
}

const calculateScore = (
  winnerBoardResult: WinnerBoardResult,
  winnerBoard: number[][]
): number => {
  const { winnerNumber, column: bingoColumn, row: bingoRow } = winnerBoardResult

  let score = 0
  winnerBoard.forEach(row => {
    row.forEach(n => {
      if (n.toString() !== 'NaN') score += n
    })
  })

  return score * winnerNumber
}

const winnerBoard: WinnerBoardResult | undefined = markNumbers(numbers, boards)
if (winnerBoard) {
  console.log(
    'Part one result:',
    calculateScore(winnerBoard, boards[winnerBoard.board])
  )
}
