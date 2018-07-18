import React, { Component } from 'react';
import Immutable from 'immutable';
import ApiClient from './ApiClient';
import Song from './components/Song';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: null
    }
  }

  componentDidMount() {
    ApiClient.get(songs => {
      this.setState({songs: Immutable.fromJS(songs)});
    });
  }

  onSongChange(song, i) {
    this.setState({ songs: this.state.songs.set(i, song)});
  }

  render() {
    const { songs } = this.state;

    return (
      <div>
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
