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

// HW: Horizontal and Vertical
const linesHW = [...linesOfVents].filter(
  (line: Line): boolean =>
    line.start.x === line.end.x || line.start.y === line.end.y
)

const slope = (line: Line): number => {
  const { start, end } = line
  return (end.y - start.y) / (end.x - start.x)
}

// D: Diagonal
const linesD = [...linesOfVents].filter(
  (line: Line) => Math.abs(slope(line)) === 1
)

const boarSideSize = Math.pow(10, linesHW[0].start.x.toString().length)
const board: Board = Array.from(Array(boarSideSize), () =>
  new Array(boarSideSize).fill(0)
)

const getHWPoints = (lines: Line[]): Point[] => {
  let points: Point[] = []
  lines.forEach((line: Line) => {
    const { start, end } = line

    if (start.x === end.x) {
      const min = Math.min(start.y, end.y)
      const max = Math.max(start.y, end.y)
      const yPoints = getNumbersBetween(min, max)

      yPoints.forEach((n: number) => {
        points.push({
          x: start.x,
          y: n,
        })
      })
    } else if (start.y === end.y) {
      const min = Math.min(start.x, end.x)
      const max = Math.max(start.x, end.x)
      const xPoints = getNumbersBetween(min, max)

      xPoints.forEach((n: number) => {
        points.push({
          x: n,
          y: start.y,
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

const getDPoints = (lines: Line[]): Point[] => {
  let points: Point[] = []
  lines.forEach((line: Line) => {
    const { start, end } = line
    const slope: number = (end.y - start.y) / (end.x - start.x)
    const intercept = start.y - slope * start.x
    const minX = Math.min(start.x, end.x)
    const maxX = Math.max(start.x, end.x)

    for (let x = minX; x <= maxX; x++) {
      const y = slope * x + intercept
      points.push({ x, y })
    }
  })

  return points
}

const drawPoints = (points: Point[], board: Board): Board => {
  points.forEach((point: Point) => {
    board[point.y][point.x] += 1
  })

  return board
}

const numberOfOverlappedPoints = (board: Board): number => {
  let overlappedPoints = 0
  board.forEach(row => {
    row.forEach(number => {
      if (number >= 2) {
        overlappedPoints += 1
      }
    })
  })

  return overlappedPoints
}

const pointsHW = getHWPoints(linesHW)
const boardHW = drawPoints(pointsHW, [...board])
const overlappedHW = numberOfOverlappedPoints([...boardHW])
console.log('Part one result:', overlappedHW)

const pointsD = getDPoints(linesD)
const boardHWD = drawPoints(pointsD, [...boardHW])
const overlappedHWD = numberOfOverlappedPoints([...boardHWD])
console.log('Part two result:', overlappedHWD)
