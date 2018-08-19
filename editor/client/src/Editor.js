import React, { Component } from 'react';
import Immutable from 'immutable';
import ApiClient from './ApiClient';
import Song from './components/Song';
import Navbar from './components/Navbar';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedSongs: null,
      songs: null,
      songId: Editor.getSongIdFromLocationHash(),
      isSaving: false
    };

    window.onhashchange = this.onLocationHashChange.bind(this);
  }

  componentDidMount() {
    ApiClient.get(songs => {
      const immutableSongs = Immutable.fromJS(songs);
      this.setState({
        savedSongs: immutableSongs,
        songs: immutableSongs});
    });
  }

  onSongChange(song) {
    const songs = this.state.songs;
    this.setState({
      songs: songs.set(
          songs.findKey(song => song.get("id") === this.state.songId),
          song)
    });
  }

  static onSongIdChange({target: {value}}) {
    window.location.hash = "#" + Number(value);
  }

  onLocationHashChange() {
    this.setState({songId: Editor.getSongIdFromLocationHash()});
  }

  static getSongIdFromLocationHash() {
    return Number(window.location.hash.replace("#", "")) || 1;
  }

  saveSongs() {
    this.setState({
      isSaving: true
    });

    ApiClient.put(this.state.songs.toJS(), songs => {
      this.setState({
        savedSongs: Immutable.fromJS(songs),
        isSaving: false
      });
    });
  }

  render() {
    const { savedSongs, songs, songId, isSaving } = this.state;
    const isSaved = !savedSongs || savedSongs.equals(songs);

    if (!songs) {
      return <div>Načítám Svítá...</div>
    }

    const currentSong = songs.find(song => song.get("id") === songId);

    if (!currentSong) {
      return <div>Písnička neexistuje</div>;
    }

    return (<div>
          <Navbar songs={songs}
                  currentSongId={songId}
                  onSongIdChange={Editor.onSongIdChange}
                  isSaving={isSaving}
                  isSaved={isSaved}
                  onSaveSongs={this.saveSongs.bind(this)}/>

          <div className="container">
            <Song song={currentSong}
                  onChange={song => this.onSongChange(song)}/>
          </div>
        </div>
    );
  }
}

export default Editor;
