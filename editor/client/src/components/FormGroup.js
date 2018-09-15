import React from "react";
import makePureRender from "../util/makePureRender";

const FormGroup = ({title, children}) =>
  <div className="song-form-group">
    {title && <h2>{title}</h2>}
    {children}
  </div>;

export default makePureRender(FormGroup);
