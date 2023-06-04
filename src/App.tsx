
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Stack, Typography } from '@mui/joy';
import './App.css';
import { SequenceType, SequenceUniqueType, Solutions, findShortestSolution, findShortestSolutionsForMultipleValues, getPossibleResults, renderSequenceType, renderUniqueSequenceType } from './Logic';
import UndoIcon from '@mui/icons-material/Undo';
import ClearIcon from '@mui/icons-material/Clear';



function App() {
  const [finalSeq, setFinalSeq] = useState<SequenceType[]>([]);
  const possibleValues = useMemo(() => getPossibleResults(finalSeq), [finalSeq]);

  const [solutionStore, setSolutionStore] = useState<Solutions | undefined | null>(undefined);

  useEffect(() => {
    setSolutionStore(undefined);
  }, [finalSeq]);

  function ButtonGridButton({ row, col, seqType }: { row: number, col: number, seqType: SequenceType }) {
    return (
      <Button style={{
        gridColumn: `${col} / span 1`,
        gridRow: `${row} / span 1`,
      }}
        onClick={() => setFinalSeq(sequence => [...sequence, seqType])}
      >{renderSequenceType(seqType)}</Button>
    );
  }

  return (
    <div className="App centered-flex">

      <Typography level="h2">TFC Smithing Helper</Typography>

      <Card variant='outlined'>
        <div className='centered-flex action-selection'>
          <Typography level="body1">Final Sequence</Typography>

          <div className="action-buttons" >
            <ButtonGridButton row={1} col={1} seqType={SequenceType.HIT} />
            <ButtonGridButton row={1} col={2} seqType={SequenceType.HIT} />
            <ButtonGridButton row={2} col={1} seqType={SequenceType.HIT} />
            <ButtonGridButton row={2} col={2} seqType={SequenceType.DRAW} />

            <ButtonGridButton row={1} col={4} seqType={SequenceType.PUNCH} />
            <ButtonGridButton row={1} col={5} seqType={SequenceType.BEND} />
            <ButtonGridButton row={2} col={4} seqType={SequenceType.UPSET} />
            <ButtonGridButton row={2} col={5} seqType={SequenceType.SHRINK} />
          </div >

          <Stack direction="row" spacing={2}>
            <Button startDecorator={<ClearIcon />} variant="outlined" onClick={() => setFinalSeq([])}>Clear</Button>
            <Button startDecorator={<UndoIcon />} variant="outlined" onClick={() => setFinalSeq(sequence => sequence.slice(0, -1))}>Undo</Button>
          </Stack>

          <Typography level="body1">
            {finalSeq.map(renderSequenceType).join(', ')}
          </Typography>
        </div>
      </Card>

      <Card variant='outlined'>
        <div className='centered-flex'>
          <Typography level="body1">
            Possible movement from sequence:&nbsp;
            <Typography level="body1" variant="soft">
              {possibleValues.map(value => value + '').join(', ')}
            </Typography>
          </Typography>
          <Button variant="solid" onClick={() => setSolutionStore(findShortestSolutionsForMultipleValues(possibleValues.map(e => -e)))}>
            Compute Solution
          </Button>
          {solutionStore === null ? (
            <Typography level="body1">
              No solution found
            </Typography>
          ) : (solutionStore === undefined ? (
            <Typography level="body1">
              Solution not computed
            </Typography>
          ) : (
            <Typography level="body1">
              Solution:&nbsp;
              <Typography level="body1" variant="soft">
                {Object.entries(solutionStore).map(([key, sol]) => `${key}: ` + sol.map(renderUniqueSequenceType).join(', ')).join('; ')}
              </Typography>
            </Typography>
          ))}

        </div>
      </Card>
    </div>
  );
}

export default App;
