import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function PointsTable(props) {
  const classes = useStyles();
  // const [{ address, point, keep = false }] = rows;
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell align="right">Coords</TableCell> */}
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map(({ id, address, point }) => (
              <TableRow key={JSON.stringify(id)}>
                <TableCell component="th" scope="row" align="left">
                  <Button onClick={() => props.onRowRemove(address)}>
                    <DeleteIcon fontSize="small" color="secondary" />
                    {/* <IconButton aria-label="delete" >
                      
                    </IconButton> */}
                  </Button>
                  <button onClick={props.onPopup}>
                    {JSON.stringify(address)}
                  </button>
                </TableCell>

                {/* <TableCell align="right">
                  [lt:{point.lat}, Lg:{point.lng}]
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
