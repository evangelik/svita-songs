import React from "react";
import makePureRender from "../util/makePureRender";

const Author = ({author, onChange}) => {
  const onFirstNameChange =
      ({target: {value}}) => onChange(author.set("firstName", value));

  const onLastNameChange =
      ({target: {value}}) => onChange(author.set("lastName", value));

  return <div className="form-group row">
    <div className="col">
      <input className="form-control"
             value={author.get("firstName")}
             onChange={onFirstNameChange}
             placeholder="Křestní jméno"/>
    </div>
    <div className="col">
      <input className="form-control"
             value={author.get("lastName")}
             onChange={onLastNameChange}
             placeholder="Příjmení"/>
    </div>
  </div>;
};

export default makePureRender(Author);
