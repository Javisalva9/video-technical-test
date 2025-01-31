import React, { useEffect, useState } from 'react';
import Player from './Player';

function App() {
  const [source, setSource] = useState(null);

  const fetchVideoData = async () => {
    const rawVideoResponse = await fetch('http://localhost:30002/video/12345');
    const video = await rawVideoResponse.json();

    const rawTokenResponse = await fetch('http://localhost:3002/video/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ video }),
    });

    const videoWithToken = await rawTokenResponse.json();

    const source = {
      type: 'video',
      sources: videoWithToken.sources,
    };

    setSource(source);
  }

  useEffect(() => {
    fetchVideoData();
  }, []);

  return (
    <Player
      title="Big Buck Bunny"
      source={source}
    />
  );
}

export default App;
