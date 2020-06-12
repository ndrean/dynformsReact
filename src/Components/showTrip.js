import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 350,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ShowTrip(props) {
  const classes = useStyles();
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Participant</TableCell>
              <TableCell align="left">Pushed</TableCell>
              <TableCell align="left">Accepted</TableCell>

              <TableCell align="left">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.participants.map((kiter, id) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  <Avatar alt={kiter.name} src="" />
                </TableCell>
                <TableCell align="left">{kiter.pushed.toString()}</TableCell>
                <TableCell align="left">->db</TableCell>
                <TableCell align="left">
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => props.onKiterRemove(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
