import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import Section from "./Section"
import ManageButtons from "./ManageButtons";

const Sections = ({song, onChange}) => {

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
  </div>;
};

export default makePureRender(Sections);
