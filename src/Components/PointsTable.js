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
import Modal from "@material-ui/core/Modal";
import List from "@material-ui/core/List";
import { ListItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 100,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    minWidth: 350,
  },
}));

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
            {props.rows &&
              props.rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row" align="left">
                    <Button onClick={() => props.onRowRemove(row.address)}>
                      <DeleteIcon fontSize="small" color="secondary" />
                      {/* <IconButton aria-label="delete" >
                      
                    </IconButton> */}
                    </Button>
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => props.onShowOnMap(row.point)}
                      >
                        {JSON.stringify(row.address)}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => props.onhandleOpen(row.point)}
                      >
                        {row.position}
                      </Button>

                      <Modal
                        className={classes.modal}
                        open={props.open}
                        onClose={props.onhandleModalClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                      >
                        <div style={props.modalStyle} className={classes.paper}>
                          <h5 id="simple-modal-title">Assign position</h5>
                          <List
                            component="nav"
                            aria-label="main mailbox folders"
                            onClick={props.onhandleSelect}
                          >
                            <ListItem name="Start" button>
                              Start point
                            </ListItem>
                            <ListItem button name="End">
                              End point
                            </ListItem>
                            <ListItem button name="Other">
                              Other point
                            </ListItem>
                          </List>
                          <Button
                            type="submit"
                            onClick={props.onhandleModalClose}
                          >
                            Save
                          </Button>
                        </div>
                      </Modal>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
