import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import Author from "./Author"
import Section from "./Section"

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

  const onSectionChange =
      (section, i) => onChange(song.setIn(["sections", i], section));

  const onSectionAdd =
      () => onChange(
          song.update(push("sections",
              {type: "verse", verseIndex: "1", paragraphs: [""]})));

  const onSectionRemove =
      () => onChange(
          song.update(pop("sections")));

  return <div>
    <h1>
      {song.get("id")}
      <input value={song.get("name")}
             onChange={onNameChange}
             placeholder="Název písničky"/>
    </h1>
    <div>
      {(song.get("authors") || []).map((author, i) =>
          <Author author={author}
                  key={i}
                  onChange={author => onAuthorChange(author, i)}/>
      )}
    </div>
    <div>
      <button onClick={onAuthorAdd}>Přidat autora</button>
      <button onClick={onAuthorRemove}>Odebrat autora</button>
    </div>
    <div>
      {(song.get("sections") || []).map((section, i) =>
          <Section section={section}
                   key={i}
                   onChange={section => onSectionChange(section, i)}/>
      )}
    </div>
    <div>
      <button onClick={onSectionAdd}>Přidat oddíl</button>
      <button onClick={onSectionRemove}>Odebrat oddíl</button>
    </div>
  </div>;
};

export default makePureRender(Song);
