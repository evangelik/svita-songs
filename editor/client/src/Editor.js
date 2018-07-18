import React, { Component } from 'react';
import Immutable from 'immutable';
import ApiClient from './ApiClient';
import Song from './components/Song';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedSongs: null,
      songs: null,
      saving: false
    }
  }

  componentDidMount() {
    ApiClient.get(songs => {
      const immutableSongs = Immutable.fromJS(songs);
      this.setState({
        savedSongs: immutableSongs,
        songs: immutableSongs});
    });
  }

  onSongChange(song, i) {
    this.setState({ songs: this.state.songs.set(i, song)});
  }

  saveSongs() {
    this.setState({
      saving: true
    });

    ApiClient.put(this.state.songs.toJS(), songs => {
      this.setState({
        savedSongs: Immutable.fromJS(songs),
        saving: false
      });
    });
  }

  render() {
    const { savedSongs, songs, saving } = this.state;
    const isSaved = !savedSongs || savedSongs.equals(songs);

    return (
      <div>
        <button
            disabled={saving || isSaved}
            onClick={this.saveSongs.bind(this)}>
          {saving ? "Ukládám..." :
              isSaved ? "Uloženo" : "Uložit"}
        </button>
        {songs
            ? songs.map((song, i) =>
                <Song song={song}
                      key={i}
                      onChange={song => this.onSongChange(song, i)}/>)
            : "Loading..."}
      </div>
    );
  }
}

export default Editor;
