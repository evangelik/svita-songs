import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import Author from "./Author"
import Section from "./Section"
import ManageButtons from "./ManageButtons";

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
    <div className="row">
      <div className="col-1">
        <h1>{song.get("id")}</h1>
      </div>
      <div className="col-11">
        <input className="form-control form-control-lg"
               value={song.get("name")}
               onChange={onNameChange}
               placeholder="Název písničky"/>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <div>
          {(song.get("sections") || []).map((section, i) =>
              <Section section={section}
                       key={i}
                       onChange={section => onSectionChange(section, i)}/>
          )}
        </div>
        <div className="form-group row">
          <div className="col-10 offset-2">
            <ManageButtons addLabel="Přidat oddíl"
                           removeLabel="Odebrat oddíl"
                           onAdd={onSectionAdd}
                           onRemove={onSectionRemove}/>
          </div>
        </div>
      </div>
      <div className="col">
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
                           onRemove={onAuthorRemove}/>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default makePureRender(Song);
