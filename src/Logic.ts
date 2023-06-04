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

export function getUniqueSequence(action: SequenceType) {
  switch (action) {
    case SequenceType.HIT:
      return [SequenceUniqueType.HIT_1, SequenceUniqueType.HIT_2, SequenceUniqueType.HIT_3]
    case SequenceType.DRAW:
      return [SequenceUniqueType.DRAW]
    case SequenceType.PUNCH:
      return [SequenceUniqueType.PUNCH]
    case SequenceType.BEND:
      return [SequenceUniqueType.BEND]
    case SequenceType.UPSET:
      return [SequenceUniqueType.UPSET]
    case SequenceType.SHRINK:
      return [SequenceUniqueType.SHRINK]
  }
}

// export class PossibleUniqueSequence {
//   constructor() {
//     this.
//   }
// }

export function mapKeys<K, L, T>(m: Map<K, T>, func: (key: K) => L): Map<L, T> {
  const newMap = new Map<L, T>();
  for (const [key, value] of m) {
    newMap.set(func(key), value);
  }
  return newMap;
}

export function getPossibleResults(actions: SequenceType[]): Map<number, SequenceUniqueType[]> {
  const results = actions.map(getUniqueSequence);
  const initialMap = new Map<number, SequenceUniqueType[]>();
  initialMap.set(0, []);

  const nextResults = results.reduce((acc, val) => {
    const newAcc = new Map<number, SequenceUniqueType[]>();
    // try all combinations, but remove duplicates
    for (const [accVal, accSeq] of acc) {
      for (const v of val) {
        const combine = accVal + v;
        newAcc.set(combine, [...accSeq, v]);
      }
    }
    return newAcc;
  }, initialMap);

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

export type Solutions = { [key: number]: [SequenceUniqueType[], SequenceUniqueType[]] };

export function findShortestSolutionsForMultipleValues(inputs: Map<number, SequenceUniqueType[]>): Solutions | null {
  const result: Solutions = {};
  for (const [val, inputSeq] of inputs) {
    const solution = findShortestSolution(val);
    if (solution !== null) {
      result[val] = [solution, inputSeq];
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