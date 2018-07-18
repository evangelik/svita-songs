import React from "react";
import makePureRender from "../util/makePureRender";

const Song = ({song, onChange}) => {
  const onNameChange =
      ({target: {value}}) => onChange(song.set("name", value));

  return <div>
    <h1>
      {song.get("id")}
      <input value={song.get("name")}
             onChange={onNameChange}
             placeholder="Název písničky"/>
    </h1>
  </div>;
};

export default makePureRender(Song);
