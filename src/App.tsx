
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Grid, Stack, Typography } from '@mui/joy';
import './App.css';
import { SequenceType, SequenceUniqueType, Solutions, findShortestSolution, findShortestSolutionsForMultipleValues, getPossibleResults, mapKeys, renderSequenceType, renderUniqueSequenceType } from './Logic';
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
              {[...possibleValues].map(([value, _]) => value + '').join(', ')}
            </Typography>
          </Typography>
          <Button variant="solid" onClick={() => setSolutionStore(findShortestSolutionsForMultipleValues(mapKeys(possibleValues, e => -e)))}>
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
            <Stack direction="column" spacing={2} style={{
              alignItems: 'center',
            }}>
              <Typography level="body1">
                Solutions
              </Typography>
              <Grid container spacing={2} className="solution-grid">
                <Grid xs={6}>
                  <Typography level="body1">
                    Setup
                  </Typography>
                </Grid>
                <Grid xs={6} >
                  <Typography level="body1">
                    Final
                  </Typography>
                </Grid>
                {Object.entries(solutionStore).map(([key, [out, input]]) =>
                  <>
                    <Grid xs={6}>
                      <Typography level="body1" variant="soft" className="solution-typography">
                        {out.map(renderUniqueSequenceType).join(', ')}
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography level="body1" variant="soft" className="solution-typography">
                        {input.map(renderUniqueSequenceType).join(', ')}
                      </Typography>
                    </Grid>
                  </>

                )}

              </Grid>

            </Stack>

          ))}
        </div>
      </Card >

      <Card variant='outlined'>
        <Typography level="body1">
          How to use:<br />Line up the two pointer on the anvil, and then enter the final sequence into the first box. Then, click the compute solution button to find which actions will setup the pointer such that the final combination results in the pointers aligning again. With hammer hits, which have multiple strengths, the right side shows which strength to use.
        </Typography>
      </Card>
    </div >
  );
}

export default App;
