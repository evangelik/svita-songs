import React from "react";
import makePureRender from "../util/makePureRender";

const Navbar =
    ({songs, currentSongId, onSongIdChange, isSaving, isSaved, onSaveSongs}) =>
        <nav className="navbar fixed-top navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href=".">Svítá Editor</a>

            <div className="form-inline">
              <select className="form-control mr-sm-2"
                      onChange={onSongIdChange}
                      value={currentSongId}>
                {songs.map(song =>
                    <option key={song.get("id")}
                            value={song.get("id")}>
                      {song.get("id")} {song.get("name")}
                    </option>)}
              </select>

              <button className="btn btn-primary"
                      disabled={isSaving || isSaved}
                      onClick={onSaveSongs}>
                {isSaving ? "Ukládám..." :
                    isSaved ? "Uloženo" : "Uložit vše"}
              </button>
            </div>
          </div>
        </nav>;

export default makePureRender(Navbar);
