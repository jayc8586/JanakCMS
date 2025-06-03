const REPO = 'jayc8586/JanakCMS';
const FILE_PATH = 'content.json';

function saveToken() {
  const token = document.getElementById('tokenInput').value.trim();
  if (!token) return alert('Please paste your GitHub token.');
  localStorage.setItem('gh_token', token);
  location.reload();
}

const token = localStorage.getItem('gh_token');

if (token) {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('editor').style.display = 'block';

  // Load existing content.json
  fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    headers: { Authorization: `token ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const decoded = atob(data.content);
      document.getElementById('content').value = decoded;
      document.getElementById('save').onclick = () => saveContent(data.sha);
    })
    .catch(err => alert('Failed to load content.json. Is the file created?'));
}

function saveContent(sha) {
  const updatedContent = document.getElementById('content').value;
  const encoded = btoa(unescape(encodeURIComponent(updatedContent)));

  fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update content.json from CMS',
      content: encoded,
      sha: sha,
    }),
  })
    .then(res => res.json())
    .then(() => alert('✅ Saved successfully!'))
    .catch(() => alert('❌ Error saving file.'));
}
