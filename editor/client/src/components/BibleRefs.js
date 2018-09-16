import React from "react";
import makePureRender from "../util/makePureRender";
import { push, pop } from "../util/listUtil";
import BibleRef from "./BibleRef"
import ManageButtons from "./ManageButtons";

const BibleRefs = ({song, onChange}) => {

  const onBibleRefChange =
      (bibleRef, i) => onChange(song.setIn(["bibleRefs", i], bibleRef));

  const onBibleRefAdd =
      () => onChange(
          song.update(push("bibleRefs", {
                book: "gn",
                chapter: 1,
                verseStart: 1,
              })));

  const onBibleRefRemove =
      () => onChange(
          song.update(pop("bibleRefs")));

  return <div>
    <div>
      {(song.get("bibleRefs") || []).map((bibleRef, i) =>
          <BibleRef bibleRef={bibleRef}
                    key={i}
                    onChange={bibleRef => onBibleRefChange(bibleRef, i)}/>
      )}
    </div>
    <div className="form-group form-row">
      <div className="col">
        <ManageButtons addLabel="Přidat odkaz"
                       removeLabel="Odebrat odkaz"
                       onAdd={onBibleRefAdd}
                       onRemove={onBibleRefRemove}
                       hideRemoveButton={!song.get("bibleRefs")}/>
      </div>
    </div>
  </div>;
};

export default makePureRender(BibleRefs);
