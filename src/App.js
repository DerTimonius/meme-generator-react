import './App.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';

function App() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [memeType, setMemeType] = useState('');
  const [image, setImage] = useState(
    ' https://api.memegen.link/images/xy/show_us_all_the_memes!.jpg?watermark=memecomplete.com&token=yds9lf2jrx72zoi11jnh ',
  );
  let count = 1;
  const fileName = `/meme_${count}.jpeg`;

  const input = [memeType, topText, bottomText];
  const corrected = input.map((text) => {
    return text
      .replace(' ', '_')
      .replace('#', '~h')
      .replace('?', '~q')
      .replace('/', '~s');
  });
  const url = `https://api.memegen.link/images/${corrected[0]}/${corrected[1]}/${corrected[2]}.jpeg`;

  const handleSubmit = (event) => {
    event.preventDefault();
    setImage(url);
  };
  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };
  const handleDownload = (event) => {
    event.preventDefault();
    fetch(url, {
      method: 'get',
      headers: {
        'Content-type': 'image/jpeg',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });

    count++;
  };

  return (
    <div className="App">
      <div>
        <h1>Create a Meme by yourself!</h1>
        <img src={image} alt="Created meme" data-test-id="meme-image" />
      </div>
      <form>
        <label htmlFor="top">Top Text</label>
        <input
          name="top"
          id="top"
          value={topText}
          onClick={() => setTopText('')}
          onChange={(event) => setTopText(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
        />
        <br />
        <label htmlFor="bottom">Bottom Text</label>
        <input
          name="bottom"
          id="bottom"
          value={bottomText}
          onClick={() => setBottomText('')}
          onChange={(event) => setBottomText(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
        />
        <br />
        <label htmlFor="type">Meme template</label>
        <input
          name="type"
          id="type"
          value={memeType}
          onClick={() => setMemeType('')}
          onChange={(event) => setMemeType(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
        />
        <br />
        <br />
        <button onClick={handleSubmit} data-test-id="generate-meme">
          Generate
        </button>

        <br />
        <br />
        <a href={url} onClick={handleDownload} download>
          Download
        </a>
      </form>
    </div>
  );
}

export default App;
