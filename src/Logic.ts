export enum SequenceType {
  HIT,
  DRAW,
  PUNCH,
  BEND,
  UPSET,
  SHRINK,
}

// like SequenceType, but separates the different hit types
export enum SequenceUniqueType {
  HIT_1 = -3,
  HIT_2 = -6,
  HIT_3 = -9,
  DRAW = -15,
  PUNCH = 2,
  BEND = 7,
  UPSET = 13,
  SHRINK = 16,
}

export function renderSequenceType(type: SequenceType) {
  switch (type) {
    case SequenceType.HIT:
      return 'Hit'
    case SequenceType.DRAW:
      return 'Draw'
    case SequenceType.PUNCH:
      return 'Punch'
    case SequenceType.BEND:
      return 'Bend'
    case SequenceType.UPSET:
      return 'Upset'
    case SequenceType.SHRINK:
      return 'Shrink'
  }
}

export function renderUniqueSequenceType(type: SequenceUniqueType) {
  switch (type) {
    case SequenceUniqueType.HIT_1:
      return 'Hit 1'
    case SequenceUniqueType.HIT_2:
      return 'Hit 2'
    case SequenceUniqueType.HIT_3:
      return 'Hit 3'
    case SequenceUniqueType.DRAW:
      return 'Draw'
    case SequenceUniqueType.PUNCH:
      return 'Punch'
    case SequenceUniqueType.BEND:
      return 'Bend'
    case SequenceUniqueType.UPSET:
      return 'Upset'
    case SequenceUniqueType.SHRINK:
      return 'Shrink'
  }
}

export function getActionValues(action: SequenceType) {
  switch (action) {
    case SequenceType.HIT:
      return [-3, -6, -9]
    case SequenceType.DRAW:
      return [-15]
    case SequenceType.PUNCH:
      return [2]
    case SequenceType.BEND:
      return [7]
    case SequenceType.UPSET:
      return [13]
    case SequenceType.SHRINK:
      return [16]
  }
}

// export class PossibleUniqueSequence {
//   constructor() {
//     this.
//   }
// }

export function getPossibleResults(actions: SequenceType[]) {
  const results = actions.map(getActionValues);
  let nextResults = results.reduce((acc, val) => {
    const newAcc = [];
    // try all combinations, but remove duplicates
    for (const a of acc) {
      for (const v of val) {
        const combine = a + v;
        if (newAcc.indexOf(combine) === -1) {
          newAcc.push(combine);
        }
      }
    }
    return newAcc;
  }, [0]);

  nextResults.sort((a, b) => a - b);
  return nextResults;
}

type Counter = {
  [key in keyof typeof SequenceUniqueType]: number
};

function makeCounter(): Counter {
  return {
    HIT_1: 0,
    HIT_2: 0,
    HIT_3: 0,
    DRAW: 0,
    PUNCH: 0,
    BEND: 0,
    UPSET: 0,
    SHRINK: 0,
  }
}

function sumActions(counter: Counter): number {
  return Object.entries(counter).reduce((acc, [key, count]) => {
    const score = SequenceUniqueType[key as keyof typeof SequenceUniqueType];
    // console.log(key, score)
    return acc + count * score;
  }, 0);
}

export type Solutions = { [key: number]: SequenceUniqueType[] };

export function findShortestSolutionsForMultipleValues(values: number[]): Solutions | null {
  const result: Solutions = {};
  for (const value of values) {
    const solution = findShortestSolution(value);
    if (solution !== null) {
      result[value] = solution;
    }
  }
  return result;
}

export function findShortestSolution(value: number): SequenceUniqueType[] | null {
  // in this case, we don't care about the order of the actions
  let start = makeCounter();

  const order = Object.keys(SequenceUniqueType).filter(key => isNaN(parseInt(key)));


  function recursiveCountMaker(left: number, order_index: number, counter: Counter): Counter[] {
    if (order_index >= order.length) {
      if (left === 0) {
        // we're done
        return [counter];
      }
      else {
        // invalid
        return [];
      }

    }

    if (left === 0) {
      // we're done
      return [counter];
    }


    const allCounters = [];
    for (let i = 0; i <= left; ++i) {
      // put i elements into the first one
      const copyCounter = { ...counter };
      // console.log(order[order_index], i, copyCounter[order[order_index] as keyof typeof SequenceUniqueType])
      copyCounter[order[order_index] as keyof typeof SequenceUniqueType] = i;
      const nextCounters = recursiveCountMaker(left - i, order_index + 1, copyCounter);
      allCounters.push(...nextCounters);
    }

    return allCounters;
  }

  for (let action_count = 0; action_count < 6; action_count++) {
    const allCounters = recursiveCountMaker(action_count, 0, makeCounter());

    allCounters.forEach(counter => {
      // console.log(counter, sumActions(counter));
      const res = Object.values(counter).reduce((prev, curr) => prev + curr, 0);
      if (res !== action_count) {
        throw new Error('invalid counter');
      }
    });

    for (const counter of allCounters) {
      const res = sumActions(counter);
      if (res === value) {
        // we found it!
        const result: SequenceUniqueType[] = [];
        for (const [key, count] of Object.entries(counter)) {
          for (let i = 0; i < count; ++i) {
            result.push(SequenceUniqueType[key as keyof typeof SequenceUniqueType]);
          }
        }
        return result;
      }
    }

  }

  return null;
}