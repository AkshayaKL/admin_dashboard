import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Searchbar from "./search.component";
import EditDialog from "./editDialog.component";
import { Pages } from "./pagination.component";
import { Button } from "@material-ui/core";
import "./adminboard.component.css";
import { getUserData } from "../services/usersFetch";

export default function Dashboard(props) {
  const gridStyle = {
    display: "flex",
    height: 580,
    flexDirection: "column",
  };

  var handleClose = () => {
    setReturnedUsers(
      [
        ...returnedUsers.filter((user) => user["id"] !== editedRow["id"]),
        editedRow,
      ].sort((a, b) => a["id"] - b["id"])
    );

    setUsers(
      [
        ...users.filter((user) => user["id"] !== editedRow["id"]),
        editedRow,
      ].sort((a, b) => a["id"] - b["id"])
    );

    setopenEdit(false);
    
    
  };

  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [returnedUsers, setReturnedUsers] = useState(users);
  const [openEdit, setopenEdit] = useState(false);
  const [editedRow, setEditedRow] = useState({});

  useEffect(() => {
    getUserData().then((userdata) => {
      setUsers(userdata.data);
      setReturnedUsers(userdata.data);
      setPage(1);
    });
  }, []);

  var deleteRow = (rowToBeDeleted) => {
    console.log(rowToBeDeleted.row);
    setReturnedUsers(
      returnedUsers.filter((user) => user["id"] !== rowToBeDeleted["id"])
    );
    setUsers(users.filter((user) => user["id"] !== rowToBeDeleted["id"]));
  };

  var deleteRows = () => {
    setReturnedUsers([
      ...returnedUsers.filter((user) => !selectionModel.includes(user["id"])),
    ]);
    setUsers([...users.filter((user) => !selectionModel.includes(user["id"]))]);
    setSelectionModel([]);

    if (
      page >= Math.floor((returnedUsers.length - 1) / props.totalPages) &&
      page > 1
    ) {
      setPage(Math.floor((returnedUsers.length - 1) / props.totalPages));
    }
  };

  var editRows = (rowToBeEdited) => {
    setEditedRow(rowToBeEdited.row);
    setopenEdit(true);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1, sortable: false },
    { field: "name", headerName: "Name", flex: 1, sortable: false },
    { field: "email", headerName: "Email", flex: 1, sortable: false },
    { field: "role", headerName: "Role", flex: 1, sortable: false },

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
      flex: 1,
    },
  ];
  return (
    <div style={gridStyle}>
      <EditDialog
        users={users}
        handleClose={handleClose}
        editedRow={editedRow}
        setEditedRow={setEditedRow}
        setopenEdit={setopenEdit}
        openEdit={openEdit}
      />
      <Searchbar
        users={users}
        setReturnedUsers={setReturnedUsers}
        setPage={setPage}
      />
      <div style={{ flexgrow: 1, flexBasis: "90%" }}>
        <DataGrid
          disableColumnFilter
          rowHeight={37}
          pageSize={props.totalPages}
          page={page - 1}
          rows={returnedUsers}
          columns={columns}
          checkboxSelection
          components={{
            Pagination: () => {
              return (
                <Pages
                 setSelectionModel={setSelectionModel}
                  users={returnedUsers}
                  totalPages={props.totalPages}
                  setPage={setPage}
                  page={page}
                />
              );
            },
          }}
          disableSelectionOnClick
          onPageChange={(params) => {
            setPage(params.page);
            setSelectionModel([]);
          }}
          isRowSelectable={(params) => {
            return (
              returnedUsers.indexOf(params.row) + 1 >
                (page - 1) * props.totalPages &&
              returnedUsers.indexOf(params.row) + 1 <= page * props.totalPages
            );
          }}
          onSelectionModelChange={(newSelection) => {
            setSelectionModel(...[newSelection.selectionModel]);
            
          }}
        />
      </div>

      <Button
        id="deleteBulk"
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
    </div>
  );
}
