import React from "react"
import { MenuItem, Select, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";


export default function EditDialog(props)
{  
return(<Dialog
onClose={props.handleClose}
aria-labelledby="simple-dialog-title"
open={props.openEdit}
>
<DialogTitle id="form-dialog-title">{`${props.editedRow["name"]}'s details`}</DialogTitle>
<DialogContent>
  <TextField
    autoFocus
    margin="dense"
    id="name"
    label="name"
    type="name"
    value={props.editedRow["name"]}
    onChange={(e) => {
      props.setEditedRow({ ...props.editedRow, name: e.target.value });
    }}
    fullWidth
  />
  <TextField
    autoFocus
    margin="dense"
    id="email"
    label="Email"
    type="email"
    value={props.editedRow["email"]}
    onChange={(e) => {
      props.setEditedRow({ ...props.editedRow, email: e.target.value });
    }}
    fullWidth
  />

  <Select
    value={props.editedRow["role"]}
    onChange={(e) => {
      props.setEditedRow({ ...props.editedRow, role: e.target.value });
    }}
    fullWidth
  >
    {
       [...new Set(props.users.map(a => a.role))].map((role)=>{
           
            return <MenuItem value={role}>{role}</MenuItem>
           
       })
    }
  </Select>
</DialogContent>
<DialogActions>
  <Button onClick={props.handleClose} color="primary">
    Cancel
  </Button>
  <Button onClick={props.handleClose} color="primary">
    Confirm
  </Button>
</DialogActions>
</Dialog>
)}