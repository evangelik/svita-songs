import React from "react";
import makePureRender from "../util/makePureRender";

const RenderIllustration = ({illustration}) =>
    <div className="illustration">
      <img src={"/illustrations/" + illustration.get("name") + ".png"}
           alt="Ilustrace"
           className={
             "illustration-image illustration-image-" +
             illustration.get("size")}/>

      {illustration.get("label") && <div
          className="illustration-label">{illustration.get("label")}</div>}
    </div>;

export default makePureRender(RenderIllustration);
