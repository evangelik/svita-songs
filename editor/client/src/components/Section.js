import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import ManageButtons from "./ManageButtons";

const SECTION_TYPES = {
  unknown: "neznámý",
  verse: "sloka",
  refrain: "refrén"
};

function isValidVerseIndex(value) {
  return !isNaN(value) && Number(value) > 0;
}

const Section = ({section, onChange}) => {
  const onTypeChange =
      ({target: {value}}) => onChange(
          value !== "verse"
              ? section.delete("verseIndex").set("type", value)
              : section.set("type", value));

  const onVerseIndexChange =
      ({target: {value}}) =>
          onChange(
              isValidVerseIndex(value) || value === ""
                  ? section.set("verseIndex", Number(value))
                  : section);

  const onParagraphChange =
      ({target: {value}}, i) => onChange(
          section.setIn(["paragraphs", i], value));

  const onParagraphAdd =
      () => onChange(
          section.update(push("paragraphs", "")));

  const onParagraphRemove =
      () => onChange(
          section.update(pop("paragraphs")));

  return <div>
    <div className="form-group row">
      <label className="col-2 col-form-label">Typ</label>
      <div className="col-10">
        <select className="form-control"
                onChange={onTypeChange}
                value={section.get("type")}>
          {Object.getOwnPropertyNames(SECTION_TYPES).map(type =>
              <option key={type} value={type}>
                {SECTION_TYPES[type]}
              </option>)}
        </select>
      </div>
    </div>

    {section.get("type") === "verse" && <div>
      <div className="form-group row">
        <label className="col-2 col-form-label">Číslo</label>
        <div className="col-10">
          <input className="form-control"
                 value={section.get("verseIndex") || 0}
                 onChange={onVerseIndexChange}
                 placeholder="Číslo sloky"/>
        </div>
      </div>
    </div>}

    <div className="form-group row">
      <div className="col-10 offset-2">
        {(section.get("paragraphs") || []).map((paragraph, i) =>
            <div key={i}>
            <textarea className="form-control"
                      value={paragraph}
                      placeholder="Text odstavce"
                      rows={paragraph.split("\n").length}
                      onChange={e => onParagraphChange(e, i)}/>
            </div>)}
      </div>
    </div>

    <div className="form-group row">
      <div className="col-10 offset-2">
        <ManageButtons addLabel="Přidat odstavec"
                       removeLabel="Odebrat odstavec"
                       onAdd={onParagraphAdd}
                       onRemove={onParagraphRemove} />
      </div>
    </div>
  </div>;
};

export default makePureRender(Section);
