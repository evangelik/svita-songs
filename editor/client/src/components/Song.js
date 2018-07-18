import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import Author from "./Author"

const Song = ({song, onChange}) => {
  const onNameChange =
      ({target: {value}}) => onChange(song.set("name", value));

  const onAuthorChange =
      (author, i) => onChange(song.setIn(["authors", i], author));

  const onAuthorAdd =
      () => onChange(
          song.update(push("authors", {firstName: "", lastName: ""})));

  const onAuthorRemove =
      () => onChange(
          song.update(pop("authors")));

  return <div>
    <h1>
      {song.get("id")}
      <input value={song.get("name")}
             onChange={onNameChange}
             placeholder="Název písničky"/>
      <div>
        {song.get("authors") && song.get("authors").map((author, i) =>
            <Author author={author}
                    key={i}
                    onChange={author => onAuthorChange(author, i)}/>
        )}
      </div>
      <div>
        <button onClick={onAuthorAdd}>Přidat autora</button>
        <button onClick={onAuthorRemove}>Odebrat autora</button>
      </div>
    </h1>
  </div>;
};

export default makePureRender(Song);
