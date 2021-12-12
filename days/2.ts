import fs from 'fs'

type Units = number

interface Course {
  horizotnalPos: Units
  depth: Units
  aim?: Units
}

interface Command {
  position: Position
  units: Units
}

enum Position {
  FORWARD = 'forward',
  DOWN = 'down',
  UP = 'up',
}

const commands: Command[] = fs
  .readFileSync('data/2.txt')
  .toString()
  .split('\n')
  .filter((x: string): string => x)
  .map((x: string): Command => {
    const raw = x.split(' ')

    return {
      position: Position[raw[0].toLocaleUpperCase() as keyof typeof Position],
      units: parseInt(raw[1]),
    }
  })

const calculateCourse = (commands: Command[]): Course => {
  let course: Course = {
    horizotnalPos: 0,
    depth: 0,
  }

  commands.forEach((c: Command) => {
    const { position, units } = c

    switch (position) {
      case Position.FORWARD:
        course = {
          ...course,
          horizotnalPos: (course.horizotnalPos += units),
        }
        break
      case Position.DOWN:
        course = {
          ...course,
          depth: (course.depth += units),
        }
        break
      case Position.UP:
        course = {
          ...course,
          depth: (course.depth -= units),
        }
        break
    }
  })

  return course
}

const calculateCourseWithAim = (commands: Command[]): Course => {
  let course: Course = {
    horizotnalPos: 0,
    depth: 0,
    aim: 0,
  }

  commands.forEach((c: Command) => {
    const { position, units } = c

    switch (position) {
      case Position.FORWARD:
        course = {
          ...course,
          horizotnalPos: (course.horizotnalPos += units),
          depth: course.depth + course.aim! * units,
        }
        break
      case Position.DOWN:
        course = {
          ...course,
          aim: (course.aim! += units),
        }
        break
      case Position.UP:
        course = {
          ...course,
          aim: (course.aim! -= units),
        }
        break
    }
  })

  return course
}

const course = calculateCourse(commands)
console.log('Part one result:', course.horizotnalPos * course.depth)

const courseWithAim = calculateCourseWithAim(commands)
console.log(
  'Part two result:',
  courseWithAim.horizotnalPos * courseWithAim.depth
)
