import fs from 'fs'

interface Point {
  x: number
  y: number
}

interface Line {
  start: Point
  end: Point
}

type Board = any[][]

const linesOfVents: Line[] = fs
  .readFileSync('data/5.txt')
  .toString()
  .split('\n')
  .map((line: string) =>
    line.split('->').map((point: string): Point => {
      const pointData = point.trim().split(',')
      return {
        x: parseInt(pointData[0]),
        y: parseInt(pointData[1]),
      }
    })
  )
  .map(
    (points: Point[]): Line => ({
      start: points[0],
      end: points[1],
    })
  )
  .slice(0, -1)

const cleanedLinesOfVents = [...linesOfVents].filter(
  (line: Line) => line.start.x === line.end.x || line.start.y === line.end.y
)

const boarSideSize = Math.pow(
  10,
  cleanedLinesOfVents[0].start.x.toString().length
)
const board: Board = Array.from(Array(boarSideSize), () =>
  new Array(boarSideSize).fill('.')
)

const draw = (lines: Line[], board: Board): Board => {
  getAllPoints(lines).forEach((point: Point, i) => {
    let pointOnBoard = board[point.y][point.x]

    if (pointOnBoard === '.') {
      board[point.y][point.x] = 1
    } else {
      board[point.y][point.x] += pointOnBoard
    }
  })

  return board
}

const getAllPoints = (lines: Line[]): Point[] => {
  let points: Point[] = []
  lines.forEach((line: Line) => {
    if (line.start.x === line.end.x) {
      const min = Math.min(line.start.y, line.end.y)
      const max = Math.max(line.start.y, line.end.y)
      const yPoints = getNumbersBetween(min, max)

      yPoints.forEach((n: number) => {
        points.push({
          x: line.start.x,
          y: n,
        })
      })
    } else if (line.start.y === line.end.y) {
      const min = Math.min(line.start.x, line.end.x)
      const max = Math.max(line.start.x, line.end.x)
      const xPoints = getNumbersBetween(min, max)

      xPoints.forEach((n: number) => {
        points.push({
          x: n,
          y: line.start.y,
        })
      })
    }
  })

  return points
}

const getNumbersBetween = (min: number, max: number): number[] => {
  let numbers = []
  while (min <= max) {
    numbers.push(min++)
  }

  return numbers
}

const numberOfOverlappedPoints = (board: Board): number => {
  let overlappedPoints = 0
  board.forEach(row => {
    row.forEach(number => {
      if (number !== '.' && number > 1) {
        overlappedPoints += 1
      }
    })
  })

  return overlappedPoints
}

console.log(
  'Part one result:',
  numberOfOverlappedPoints(draw(cleanedLinesOfVents, [...board]))
)
