import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";

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
    <div>
      <select onChange={onTypeChange} value={section.get("type")}>
        {Object.getOwnPropertyNames(SECTION_TYPES).map(type =>
            <option key={type} value={type}>
              {SECTION_TYPES[type]}
            </option>)}
      </select>
    </div>
    {section.get("type") === "verse" && <div>
      <input value={section.get("verseIndex") || 0}
             onChange={onVerseIndexChange}
             placeholder="Číslo sloky"/>
    </div>}
    <div>
      {(section.get("paragraphs") || []).map((paragraph, i) =>
          <div key={i}>
            <textarea value={paragraph}
                      placeholder="Text odstavce"
                      onChange={e => onParagraphChange(e, i)}/>
          </div>)}
    </div>
    <div>
      <button onClick={onParagraphAdd}>Přidat odstavec</button>
      <button onClick={onParagraphRemove}>Odebrat odstavec</button>
    </div>
  </div>;
};

export default makePureRender(Section);
