import React, { Component } from 'react';
import Immutable from 'immutable';
import { Helmet } from 'react-helmet';
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
      isSaving: false,
      history: Immutable.fromJS([])
    };

    window.onhashchange = this.onLocationHashChange.bind(this);
    document.onkeydown= this.onKeyDown.bind(this);
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
    const { songs, history } = this.state;
    this.setState({
      songs: songs.set(
          songs.findKey(song => song.get("id") === this.state.songId),
          song),
      history: history.push(songs)
    });
  }

  onEditUndo() {
    const history = this.state.history;

    if (history.isEmpty()) {
      return;
    }

    this.setState({
      songs: history.last(),
      history: history.pop()
    });
  }

  static onSongIdChange({target: {value}}) {
    window.location.hash = "#" + Number(value);
  }

  shiftSongId(delta) {
    return () => {
      const { songs, songId } = this.state;
      const newId = (songId - 1 + delta + songs.count()) % songs.count() + 1;
      window.location.hash = "#" + Number(newId);
    };
  }

  onLocationHashChange() {
    this.setState({songId: Editor.getSongIdFromLocationHash()});
  }

  onKeyDown(event) {
    const ctrlPressed =
        window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey;

    if (!ctrlPressed) {
      return;
    }

    switch (event.which) {
      case 83: // "Ctrl + S"
          this.saveSongs();
          event.preventDefault();
          break;

      case 90: // "Ctrl + Z"
        this.onEditUndo();
        event.preventDefault();
        break;

      case 37: // "Ctrl + ←"
        this.shiftSongId(-1)();
        event.preventDefault();
        break;

      case 39: // "Ctrl + →"
        this.shiftSongId(1)();
        event.preventDefault();
        break;

      default:
    }
  }

  static getSongIdFromLocationHash() {
    return Number(window.location.hash.replace("#", "")) || 1;
  }

  saveSongs() {
    if (this.isSaved() || this.state.isSaving) {
      return;
    }

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

  isSaved() {
    const { savedSongs, songs } = this.state;
    return !savedSongs || savedSongs.equals(songs);
  }

  render() {
    const { songs, songId, isSaving, history } = this.state;

    if (!songs) {
      return <div>Načítám Svítá...</div>
    }

    const currentSong = songs.find(song => song.get("id") === songId);

    if (!currentSong) {
      return <div>Písnička neexistuje</div>;
    }

    return (<div>
          <Helmet>
            <title>Svítá editor: {currentSong.get("name")}</title>
          </Helmet>

          <Navbar songs={songs}
                  currentSongId={songId}
                  onSongIdChange={Editor.onSongIdChange}
                  onPreviousSongId={this.shiftSongId(-1).bind(this)}
                  onNextSongId={this.shiftSongId(1).bind(this)}
                  canEditUndo={!history.isEmpty()}
                  onEditUndo={this.onEditUndo.bind(this)}
                  isSaving={isSaving}
                  isSaved={this.isSaved()}
                  onSaveSongs={this.saveSongs.bind(this)}/>

          <Song song={currentSong}
                onChange={song => this.onSongChange(song)}/>
        </div>
    );
  }
}

export default Editor;
