import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { MenuItem, Select, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import "./adminboard.component.css";
import { getUserData } from "../services/usersFetch";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";


export default function Dashboard(props) {
 

 
  const gridStyle = {
    display: "flex",
    height: 580,
    flexDirection: "column",
  };
  let unique = [];

 
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [returnedUsers, setReturnedUsers] = useState(users);
  const [openEdit, setopenEdit] = useState(false);
  const [editedRow, setEditedRow] = useState({});
  let pages = [];


  useEffect(()=>{
    getUserData().then((userdata)=>{
      console.log(userdata.data);
      setUsers(userdata.data);
      setReturnedUsers(userdata.data)
    });
  },[])
  var handleClose = () => {
    console.log(editedRow);
    console.log([
      ...returnedUsers.filter((user) => user["id"] !== editedRow["id"]),
      editedRow,
    ]);

    setReturnedUsers(
      [
        ...returnedUsers.filter((user) => user["id"] !== editedRow["id"]),
        editedRow,
      ].sort((a, b) => a["id"] - b["id"])
    );

    setUsers( [
      ...users.filter((user) => user["id"] !== editedRow["id"]),
      editedRow,
    ].sort((a, b) => a["id"] - b["id"]));

    setopenEdit(false);
  };
  var deleteRow = (rowToBeDeleted) => {
    console.log(rowToBeDeleted.row);
    setReturnedUsers(
      returnedUsers.filter((user) => user["id"] !== rowToBeDeleted["id"])
    );
    setUsers(users.filter((user) => user["id"] !== rowToBeDeleted["id"]));
  };

  var deleteRows = () => {
    setReturnedUsers(
      [...returnedUsers.filter((user) => !selectionModel.includes(user["id"]))]
    );
    setUsers([...users.filter((user) => !selectionModel.includes(user["id"]))]);
    setSelectionModel([]);
    
    if(page >= Math.floor((returnedUsers.length-1)/props.totalPages) &&page>0){
            
            setPage(Math.floor((returnedUsers.length-1)/props.totalPages)-1);
            
    }
  };

  var editRows = (rowToBeEdited) => {
    setEditedRow(rowToBeEdited.row);
    setopenEdit(true);
  };

  var handleSearch = (e) => {
    setSearchValue(e.target.value);
    filterRows(e.target.value);
  };

  var filterRows = (searchValue) => {
    setReturnedUsers(
      users.filter((user) => {
        console.log(user.name);
        console.log(searchValue);
        return (
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.id.includes(searchValue.toLowerCase()) ||
          user.role.toLowerCase().includes(searchValue)
        );
      })
    );
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.2, sortable: false },
    { field: "name", headerName: "Name", flex: 1, sortable: false },
    { field: "email", headerName: "Email", flex: 1, sortable: false },
    { field: "role", headerName: "Role", flex: 0.2, sortable: false },

    {
      field: "actions",
      disableClickEventBubbling: true,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", width: "100%" }}>
            <div
              id="deleteButton"
              onClick={() => {
                deleteRow(params);
              }}
            >
              <DeleteIcon />
            </div>
            <div
              id="editButton"
              onClick={() => {
                editRows(params);
              }}
            >
              <EditIcon />{" "}
            </div>
          </div>
        );
      },
      headerName: "Actions",
      flex: 0.3,
    },
  ];
  return (
    <div style={gridStyle} >
   
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={openEdit}
      >
        <DialogTitle id="form-dialog-title">{`${editedRow["name"]}'s details`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="name"
            type="name"
            value={editedRow["name"]}
            onChange={(e) => {
              setEditedRow({ ...editedRow, name: e.target.value });
            }}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            value={editedRow["email"]}
            onChange={(e) => {
              setEditedRow({ ...editedRow, email: e.target.value });
            }}
            fullWidth
          />

          <Select
            value={editedRow["role"]}
            onChange={(e) => {
              setEditedRow({ ...editedRow, role: e.target.value });
            }}
            fullWidth
          >
            {returnedUsers.map((user) => {
              if (unique.indexOf(user["role"]) === -1) {
                unique.push(user.role);
                return <MenuItem value={user.role}>{user["role"]}</MenuItem>;
              }
            })}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ flexgrow: 1, flexBasis: "90%"}}>
        <div id="search">
          
          <div id="searchField" ><TextField
            id="searchField" 
            
            autoFocus
            margin="dense"
           
            type="name"
            
            placeholder ={"Search for users.."}
            value={searchValue}
            onChange={(e) => {
              handleSearch(e);
            }}
          />

       
          </div>
         
        </div>

        <DataGrid
          disableColumnFilter
          rowHeight={37}
          pageSize={props.totalPages}
          rows={returnedUsers}
          columns={columns}
          checkboxSelection
          page={page}
          disableSelectionOnClick
          onPageChange={(params) => {
            setPage(params.page);
            console.log(params);
            setSelectionModel([]);
          }}
          isRowSelectable={(params) => {
            return (
              returnedUsers.indexOf(params.row) + 1 > page * props.totalPages &&
              returnedUsers.indexOf(params.row) + 1 <= (page + 1) * props.totalPages
            );
          }}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(...[newSelection.selectionModel]);
            console.log(newSelection);
          }}
        />
     




      </div>
      
     <div id="pagination" >

     <Button id="deleteBulk"
        style={{
          visibility: selectionModel.length > 1 ? "visible" : "hidden",
          backgroundColor: "pink",
          border: "1.5px solid red",
        }}
        onClick={() => {
          deleteRows();
        }}
        size="small"
        disabled={selectionModel.length > 1 ? false : true}
      >
        Delete {selectionModel.length} rows
        <DeleteIcon style={{ color: "red" }} />
      </Button>
        <div id="pages">{
       
          returnedUsers.map((pageno, index)=>{
          if (pages.indexOf(Math.floor(index / props.totalPages) + 1) === -1) {
            pages.push(Math.floor(index / props.totalPages) + 1);

            return (
              <Button
                
                onClick={() => {
                  setSelectionModel([]);
                  setPage(Math.floor(index / props.totalPages));
                }}
                size="small"
                id="page"
                
              >
                {Math.floor(index / props.totalPages) + 1}
              </Button>
            );
          }
         
        })}
      
   </div>
   
    </div>
    </div>
  );
}
