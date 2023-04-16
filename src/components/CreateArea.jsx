import React from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import EditIcon from "@material-ui/icons/Edit";

function CreateArea(props) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    props.setInputs({
      ...props.inputs,
      [name]: value
    });
  };

  const expand = () => {
    props.setExpanded(true);
  };

  return (
    <div>

      <form
        className="create-note"
        onSubmit={(e) => {
          e.preventDefault();
          props.onHandle(props.inputs);
          props.setInputs({ title: "", content: "", isEdit: false });
          props.setIsEdit(false);
        }}
      >
        {props.isEdit && <Zoom in={props.isExpanded}>
          <button className="close">X</button>
        </Zoom>}

        {props.isExpanded && (
          <input
            name="title"
            placeholder="Title"
            value={props.inputs.title}
            onChange={handleChange}
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          placeholder="Take a note..."
          rows={props.isExpanded ? 3 : 1}
          value={props.inputs.content}
          onChange={handleChange}
        />
        <Zoom in={props.isExpanded}>
          <Fab type="submit">{!props.isEdit ? <AddIcon /> : <EditIcon />}</Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
