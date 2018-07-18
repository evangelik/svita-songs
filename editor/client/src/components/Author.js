import React from "react";
import makePureRender from "../util/makePureRender";

const Author = ({author, onChange}) => {
  const onFirstNameChange =
      ({target: {value}}) => onChange(author.set("firstName", value));

  const onLastNameChange =
      ({target: {value}}) => onChange(author.set("lastName", value));

  return <div>
    <input value={author.get("firstName")}
           onChange={onFirstNameChange}
           placeholder="Křestní jméno"/>
    <input value={author.get("lastName")}
           onChange={onLastNameChange}
           placeholder="Příjmení"/>
  </div>;
};

export default makePureRender(Author);
