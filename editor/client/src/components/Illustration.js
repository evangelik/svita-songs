import React from "react";
import { fromJS } from "immutable";
import makePureRender from "../util/makePureRender";
import {ILLUSTRATION_SIZES, ILLUSTRATIONS} from '../data/illustrations';

const Illustration = ({illustration, onChange}) => {

  const onNameChange =
      // When a different illustration is selected (identified by a name), we
      // prepopulate all fields with default values.
      ({target: {value}}) => onChange(getIllustrationDefaults(value));

  const onSizeChange =
      ({target: {value}}) => onChange(illustration.set("size", value));

  const onLabelChange =
      ({target: {value}}) => onChange(illustration.set("label", value));

  return <div>
    <div className="form-group">
      <label>Obrázek</label>
      <select className="form-control"
              onChange={onNameChange}
              value={illustration.get("name")}>
        {ILLUSTRATIONS.map(({name, description}) =>
            <option key={name} value={name}>{description}</option>)}
      </select>
    </div>
    <div className="form-group">
      <label>Velikost na stránce</label>
      <select className="form-control"
              onChange={onSizeChange}
              value={illustration.get("size")}>
        {ILLUSTRATION_SIZES.map(({size, label}) =>
            <option key={size} value={size}>{label}</option>)}
      </select>
    </div>
    <div className="form-group">
      <label>Text pod obrázkem</label>
      <textarea className="form-control"
             onChange={onLabelChange}
             value={illustration.get("label")}
             rows={2}
             placeholder="Text pod obrázkem"/>
    </div>
  </div>;
};

function getIllustrationDefaults(selectedName) {
  let { name, size, label } = ILLUSTRATIONS.find(i => i.name === selectedName);

  if (label === undefined) {
    label = "";
  }

  return fromJS({name, size, label})
}

export default makePureRender(Illustration);
