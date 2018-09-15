import React from "react";
import makePureRender from "../util/makePureRender";

const ManageButtons = (
    {
      addLabel, removeLabel, onAdd, onRemove, hideAddButton, hideRemoveButton
    }) =>
    <div className="btn-group">
      {hideAddButton || <button className="btn btn-light"
                                onClick={onAdd}>{addLabel}</button>}
      {hideRemoveButton || <button className="btn btn-light"
                                   onClick={onRemove}>{removeLabel}</button>}
    </div>;

export default makePureRender(ManageButtons);
