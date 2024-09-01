import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<header class="header">
  <button type="button" id="contentToggleButton" class="header-button content-toggle">X</button>
  <button type="button" id="themeToggleButton" class="header-button theme-toggle"></button>
</header>
<div class="container">
  <div id="contentContainer" class="content-container"></div>
  <div id="feedContainer" class="feed-container"></div>
</div>
`;

//-------------------------------------------------------------------------------------------------

let isDarkmodeEnabled = false;

const contentContainer = document.getElementById('contentContainer');
const feedContainer = document.getElementById('feedContainer');
const contentToggleButton = document.getElementById('contentToggleButton');
const themeToggle = document.getElementById('themeToggleButton');

contentToggleButton?.addEventListener('click', () => hideStory());
themeToggle?.addEventListener('click', () => toggleTheme());

toggleTheme();
fetchFeed();

function toggleTheme() {
  isDarkmodeEnabled = !isDarkmodeEnabled;
  document.body.classList.toggle('dark-mode', isDarkmodeEnabled);
  const button = document.querySelector('button') as HTMLInputElement;
  const feedItems = document.querySelectorAll('.feed-item');

  button.classList.toggle('dark-mode', isDarkmodeEnabled);

  feedItems.forEach((item) => {
    item.classList.toggle('dark-mode', isDarkmodeEnabled);
  });
}

function fetchFeed() {
  const feedUrl = 'https://rss.dw.com/rdf/rss-de-all';

  if (!feedUrl) {
    alert('Please enter a valid RSS/Atom feed URL.');
    return;
  }

  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`)
    .then((response) => response.json())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, 'application/xml');
      displayFeed(xmlDoc);
    })
    .catch((error) => {
      console.error('Error fetching the feed:', error);
      alert('There was an error fetching the feed. Please try again.');
    });
}

function displayFeed(xmlDoc: Document) {
  if (!feedContainer) return;

  feedContainer.innerHTML = '';

  const items = xmlDoc.querySelectorAll('item, entry');

  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || 'No title';
    const link = item.querySelector('link')?.textContent || '#';
    const description =
      item.querySelector('description, summary')?.textContent ||
      'No description available';

    const feedItem = document.createElement('div');
    feedItem.classList.add('feed-item');
    feedItem.addEventListener('click', () => showStory(link));

    feedItem.innerHTML = `
            <h3>${title}</h3>
            <p>${description}</p>
        `;

    if (isDarkmodeEnabled) {
      feedItem.classList.add('dark-mode');
    }

    feedContainer.appendChild(feedItem);
  });
}

function showStory(link: string) {
  contentContainer!.innerHTML = `
  <iframe class="content-frame" src="${link}"></iframe>
  `;
}

function hideStory() {
  contentContainer!.innerHTML = ``;
}
