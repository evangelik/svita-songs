import React from "react";
import makePureRender from "../util/makePureRender";

const ManageButtons = ({addLabel, removeLabel, onAdd, onRemove}) =>
  <div className="btn-group">
    <button className="btn btn-light"
            onClick={onAdd}>{addLabel}</button>
    <button className="btn btn-light"
            onClick={onRemove}>{removeLabel}</button>
  </div>;

export default makePureRender(ManageButtons);
