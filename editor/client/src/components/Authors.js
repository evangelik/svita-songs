import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import Author from "./Author"
import ManageButtons from "./ManageButtons";

const Authors = ({song, onChange}) => {

  const onAuthorChange =
      (author, i) => onChange(song.setIn(["authors", i], author));

  const onAuthorAdd =
      () => onChange(
          song.update(push("authors", {firstName: "", lastName: ""})));

  const onAuthorRemove =
      () => onChange(
          song.update(pop("authors")));

  return <div>
    <div>
      {(song.get("authors") || []).map((author, i) =>
          <Author author={author}
                  key={i}
                  onChange={author => onAuthorChange(author, i)}/>
      )}
    </div>
    <div className="form-group form-row">
      <div className="col">
        <ManageButtons addLabel="Přidat autora"
                       removeLabel="Odebrat autora"
                       onAdd={onAuthorAdd}
                       onRemove={onAuthorRemove}
                       hideRemoveButton={!song.get("authors")}/>
      </div>
    </div>
  </div>;
};

export default makePureRender(Authors);
