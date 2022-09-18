import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [memeType, setMemeType] = useState('bender');
  const [templates, setTemplates] = useState([]);
  const [image, setImage] = useState(
    ' https://api.memegen.link/images/bender/hello/there.jpeg ',
  );
  let count = 1;
  const fileName = `/meme_${count}.jpeg`;

  const input = [memeType, topText, bottomText];
  const corrected = input.map((text) => {
    return text
      ? '/' +
          text
            .replace(' ', '_')
            .replace('#', '~h')
            .replace('?', '~q')
            .replace('/', '~s')
      : text;
  });
  const url = `https://api.memegen.link/images${corrected[0]}${corrected[1]}${corrected[2]}.jpg`;

  useEffect(() => {
    fetch('https://api.memegen.link/templates')
      .then((res) => res.json())
      .then(setTemplates)
      .catch((err) => console.log(err));
  }, []);

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
        const fetchedUrl = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = fetchedUrl;
        link.setAttribute('download', fileName);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      })
      .catch((err) => console.log(err));

    count++;
  };

  return (
    <div className="App">
      <div>
        <h1>Create a Meme by yourself!</h1>
        <img src={image} alt="Created meme" data-test-id="meme-image" />
      </div>
      <form className="form">
        <label htmlFor="type">Meme template</label>
        <select
          id="type"
          value={memeType}
          onClick={(event) => setMemeType(event.currentTarget.value)}
          onChange={(event) => setMemeType(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
        >
          {templates.map((template) => {
            return (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            );
          })}
        </select>
        <br />
        <label htmlFor="top">Top text</label>
        <input
          name="top"
          id="top"
          value={topText}
          onClick={() => setTopText('')}
          onChange={(event) => setTopText(event.currentTarget.value)}
          onKeyPress={handleKeyPress}
        />
        <br />
        <label htmlFor="bottom">Bottom text</label>
        <input
          name="bottom"
          id="bottom"
          value={bottomText}
          onClick={() => setBottomText('')}
          onChange={(event) => setBottomText(event.currentTarget.value)}
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
          <button>Download</button>
        </a>
      </form>
    </div>
  );
}

export default App;
