import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

function Note(props) {
  const { id, title, content, onEdit, onDelete } = props

  return (
    <div className="note" key={props.id}>
      <h1>{title}</h1>
      <p>{content}</p>
      <button
        onClick={(e) => {
          return onEdit(e, id);
        }}
      >
        <EditIcon />
      </button>
      <button
        onClick={() => {
          return onDelete(id);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
