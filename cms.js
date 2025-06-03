const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your GitHub OAuth client ID
const REPO = 'jayc8586/JanakCMS';
const FILE_PATH = 'content.json';

document.getElementById('login').onclick = () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;
  window.location.href = url;
};

// After OAuth redirect, handle the access token
const accessToken = localStorage.getItem('gh_token'); // Set after login (simplified)

if (accessToken) {
  document.getElementById('editor').style.display = 'block';
  document.getElementById('login').style.display = 'none';

  // Fetch existing content
  fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    headers: { Authorization: `token ${accessToken}` }
  })
  .then(res => res.json())
  .then(data => {
    const content = atob(data.content);
    document.getElementById('content').value = content;
  });

  document.getElementById('save').onclick = () => {
    const content = document.getElementById('content').value;
    const encoded = btoa(unescape(encodeURIComponent(content)));

    fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update content.json',
        content: encoded
      })
    })
    .then(res => res.ok ? alert('Saved!') : alert('Error saving content.'));
  };
}
