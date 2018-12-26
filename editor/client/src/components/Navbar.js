import React from "react";
import makePureRender from "../util/makePureRender";

const Navbar =
    ({songs, currentSongId, onSongIdChange, onNextSongId, onPreviousSongId, canEditUndo, onEditUndo, isSaving, isSaved, onSaveSongs}) =>
        <nav className="navbar fixed-top navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href=".">
              <img src="svita.png" className="d-inline-block align-top" alt=""/>
              <strong>Svítá</strong> editor
            </a>

            <div className="form-inline">
              <button className="btn btn-outline-light mr-sm-2"
                      onClick={onPreviousSongId}>
                &#xab;
              </button>

              <select className="form-control mr-sm-2"
                      onChange={onSongIdChange}
                      value={currentSongId}>
                {songs.map(song =>
                    <option key={song.get("id")}
                            value={song.get("id")}>
                      {song.get("id")} {song.get("name")}
                    </option>)}
              </select>

              <button className="btn btn-outline-light mr-sm-2"
                      onClick={onNextSongId}>
                &#xbb;
              </button>

              <button className="btn btn-outline-light mr-sm-2"
                      disabled={!canEditUndo}
                      onClick={onEditUndo}>
                Zpět
              </button>

              <button className="btn btn-outline-light"
                      disabled={isSaving || isSaved}
                      onClick={onSaveSongs}>
                {isSaving ? "Ukládám..." :
                    isSaved ? "Uloženo" : "Uložit vše"}
              </button>
            </div>
          </div>
        </nav>;

export default makePureRender(Navbar);
