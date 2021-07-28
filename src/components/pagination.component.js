import React from "react";
import Pagination from "@material-ui/lab/Pagination";

export function Pages(props) {
  return (
    <Pagination
      color="primary"
      count={Math.ceil(props.users.length / props.totalPages)}
      page={props.page}
      onChange={(event, value) => {props.setPage(value); props.setSelectionModel([])}}
    />
  );
}
