import React, { useState } from "react";
import { TextField } from "@material-ui/core";

export default function Searchbar(props) {
  const [searchValue, setSearchValue] = useState("");

  var filterRows = (searchValue) => {
    props.setReturnedUsers(
      props.users.filter((user) => {
        return (
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.id.includes(searchValue.toLowerCase()) ||
          user.role.toLowerCase().includes(searchValue)
        );
      })
    );
    props.setPage(1);
  };

  var handleSearch = (e) => {
    setSearchValue(e.target.value);
    filterRows(e.target.value);
  };

  return (
    <div id="search">
      <div id="searchField">
        <TextField
          id="searchField"
          autoFocus
          margin="dense"
          type="name"
          placeholder={"Search for users.."}
          value={searchValue}
          onChange={(e) => {
            handleSearch(e);
          }}
        />
      </div>
    </div>
  );
}
