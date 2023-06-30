
import React, { useEffect, useState } from 'react';
import { Button, Card, Grid, Stack, Typography } from '@mui/joy';
import './App.css';
import UndoIcon from '@mui/icons-material/Undo';
import ClearIcon from '@mui/icons-material/Clear';

import { findBestInverseOfSeq } from 'core-logic';

type GroupActions = 'Hit' | 'Draw' | 'Punch' | 'Bend' | 'Upset' | 'Shrink';

function stringArrayFormatter(arr: string[]): string {
  if (arr.length === 0) {
    return '<none>';
  }
  return arr.join(', ');
}

function App() {
  const [finalSeq, setFinalSeq] = useState<GroupActions[]>([]);

  const [solutionStore, setSolutionStore] = useState<([string[], string[]])[] | undefined>(undefined);

  useEffect(() => {
    setSolutionStore(undefined);
  }, [finalSeq]);

  function ButtonGridButton({ row, col, seqType }: { row: number, col: number, seqType: GroupActions }) {
    return (
      <Button style={{
        gridColumn: `${col} / span 1`,
        gridRow: `${row} / span 1`,
      }}
        onClick={() => setFinalSeq(sequence => [...sequence, seqType])}
      >{seqType}</Button>
    );
  }

  return (
    <div className="App centered-flex">

      <Typography level="h2">TFC Smithing Helper</Typography>

      <Card variant='outlined'>
        <div className='centered-flex action-selection'>
          <Typography level="body1">Final Sequence</Typography>

          <div className="action-buttons" >
            <ButtonGridButton row={1} col={1} seqType={'Hit'} />
            <ButtonGridButton row={1} col={2} seqType={'Hit'} />
            <ButtonGridButton row={2} col={1} seqType={'Hit'} />
            <ButtonGridButton row={2} col={2} seqType={'Draw'} />

            <ButtonGridButton row={1} col={4} seqType={'Punch'} />
            <ButtonGridButton row={1} col={5} seqType={'Bend'} />
            <ButtonGridButton row={2} col={4} seqType={'Upset'} />
            <ButtonGridButton row={2} col={5} seqType={'Shrink'} />
          </div >

          <Stack direction="row" spacing={2}>
            <Button startDecorator={<ClearIcon />} variant="outlined" onClick={() => setFinalSeq([])}>Clear</Button>
            <Button startDecorator={<UndoIcon />} variant="outlined" onClick={() => setFinalSeq(sequence => sequence.slice(0, -1))}>Undo</Button>
          </Stack>

          <Typography level="body1">
            {finalSeq.join(', ')}
          </Typography>
        </div>
      </Card>

      <Card variant='outlined'>
        <div className='centered-flex'>
          <Button variant="solid" onClick={() => setSolutionStore(findBestInverseOfSeq(finalSeq))}>
            Compute Solution
          </Button>
          {solutionStore === undefined ? (
            <Typography level="body1">
              Solution not computed

            </Typography>
          ) : (solutionStore.length === 0 ? (
            <Typography level="body1">
              No solution found
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
                {solutionStore.map(([out, input]) =>
                  <>
                    <Grid xs={6}>
                      <Typography level="body1" variant="soft" className="solution-typography">
                        {stringArrayFormatter(out)}
                      </Typography>
                    </Grid>
                    <Grid xs={6}>
                      <Typography level="body1" variant="soft" className="solution-typography">
                        {stringArrayFormatter(input)}
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
