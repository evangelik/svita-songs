import React from "react";
import { fromJS } from "immutable";
import makePureRender from "../util/makePureRender";
import ManageButtons from "./ManageButtons";
import Illustration from "./Illustration";
import {ILLUSTRATIONS} from '../data/illustrations';

const Illustrations = ({song, onChange}) => {

  const onIllustrationChange =
      illustration => onChange(song.set("illustration", illustration));

  const onIllustrationAdd =
      () => onChange(
          song.update(song => song.set("illustration", fromJS({
            name: "archa",
            size: ILLUSTRATIONS["archa"].size,
            label: ILLUSTRATIONS["archa"].label,
          }))));

  const onIllustrationRemove =
      () => onChange(
          song.delete("illustration"));

  return <div>
    {song.has("illustration") && <Illustration
        illustration={song.get("illustration")}
        onChange={onIllustrationChange}/>}
    <ManageButtons addLabel="Vložit ilustraci"
                   removeLabel="Odebrat ilustraci"
                   onAdd={onIllustrationAdd}
                   onRemove={onIllustrationRemove}
                   hideAddButton={song.has("illustration")}
                   hideRemoveButton={!song.has("illustration")}/>
  </div>;
};

export default makePureRender(Illustrations);
