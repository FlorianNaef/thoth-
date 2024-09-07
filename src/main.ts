import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<header class="header">
  <button type="button" id="contentToggleButton" class="header-button content-toggle">
    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
<path d="M 35.548828 4.9511719 A 1.50015 1.50015 0 0 0 34.263672 5.6523438 L 23.5 21.349609 L 12.736328 5.6523438 A 1.50015 1.50015 0 0 0 11.462891 4.9824219 A 1.50015 1.50015 0 0 0 10.263672 7.3476562 L 21.681641 24 L 10.263672 40.652344 A 1.50015 1.50015 0 1 0 12.736328 42.347656 L 23.5 26.650391 L 34.263672 42.347656 A 1.50015 1.50015 0 1 0 36.736328 40.652344 L 25.318359 24 L 36.736328 7.3476562 A 1.50015 1.50015 0 0 0 35.548828 4.9511719 z"></path>
</svg>
  </button>
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

function fetchFeed() {
  const feedUrl = 'https://rss.dw.com/rdf/rss-de-all';

  fetch(`https://corsproxy.io/?${encodeURIComponent(feedUrl)}`)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'application/xml');
      displayFeed(xmlDoc);
    })
    .catch((error) => {
      console.error('Error fetching the feed:', error);
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
            <hr>
        `;

    if (isDarkmodeEnabled) {
      feedItem.classList.add('dark-mode');
    }

    feedContainer.appendChild(feedItem);
  });
}

function showStory(link: string) {
  if (!contentContainer || !contentToggleButton) {
    return;
  }
  contentToggleButton.style.display = 'block';
  contentContainer.style.display = 'block';
  contentContainer.innerHTML = `
  <iframe class="content-frame" src="${link}"></iframe>
  `;
}

function hideStory() {
  if (!contentContainer || !contentToggleButton) {
    return;
  }
  contentToggleButton.style.display = 'none';
  contentContainer.style.display = 'none';
  contentContainer.innerHTML = ``;
}

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
