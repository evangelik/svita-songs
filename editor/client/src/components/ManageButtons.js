import React from "react";
import makePureRender from "../util/makePureRender";

const ManageButtons = ({addLabel, removeLabel, onAdd, onRemove}) =>
  <div className="btn-group">
    <button className="btn btn-secondary"
            onClick={onAdd}>{addLabel}</button>
    <button className="btn btn-secondary"
            onClick={onRemove}>{removeLabel}</button>
  </div>;

export default makePureRender(ManageButtons);
