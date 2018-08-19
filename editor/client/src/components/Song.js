import React from "react";
import makePureRender from "../util/makePureRender";
import Authors from "./Authors"
import Sections from "./Sections"

const Song = ({song, onChange}) => {
  const onNameChange =
      ({target: {value}}) => onChange(song.set("name", value));

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
      <div className="col-7">
        <Sections song={song} onChange={onChange} />
      </div>
      <div className="col-5">
        <Authors song={song} onChange={onChange} />
      </div>
    </div>
  </div>;
};

export default makePureRender(Song);
