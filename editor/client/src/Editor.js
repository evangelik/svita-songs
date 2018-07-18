import React, { Component } from 'react';
import ApiClient from './ApiClient'

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      songs: null
    }
  }

  componentDidMount() {
    ApiClient.get(songs => {
      this.setState({ songs });
    });
  }

  render() {
    const { songs } = this.state;

    return (
      <div>
        {songs ? JSON.stringify(songs) : "Loading..."}
      </div>
    );
  }

}

export default Editor;
