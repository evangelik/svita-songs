import React from "react";
import makePureRender from "../util/makePureRender";
import Authors from "./Authors";
import Sections from "./Sections";
import Illustrations from "./Illustrations";
import FormGroup from "./FormGroup";
import RenderIllustration from "./RenderIllustration";

const Song = ({song, onChange}) => {
  const onNameChange =
      ({target: {value}}) => onChange(song.set("name", value));

  return <div className="song">
    <div className="song-header">
      <div className="container">
        <div className="row">
          <div className="col-1 song-number"><h1>{song.get("id")}</h1></div>
          <div className="col-11 song-name">
            <input className="form-control form-control-lg song-title"
                   value={song.get("name")}
                   onChange={onNameChange}
                   placeholder="Název písničky"/>
          </div>
        </div>
      </div>
    </div>

    <div className="container">
      <div className="row">
        <div className="col-8">
          <Sections song={song} onChange={onChange} />
          {song.has("illustration") && <RenderIllustration
              illustration={song.get("illustration")}/>}
        </div>
        <div className="col-4">
          <FormGroup title="Autoři">
            <Authors song={song} onChange={onChange} />
          </FormGroup>

          <FormGroup title="Biblické reference">
            Work in progress.
          </FormGroup>

          <FormGroup title="Ilustrace">
            <Illustrations song={song} onChange={onChange} />
          </FormGroup>
        </div>
      </div>
    </div>
  </div>;
};

export default makePureRender(Song);
