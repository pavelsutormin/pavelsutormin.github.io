document.body.insertAdjacentHTML('afterbegin', `
  <nav class="navbar">
    <a href="/" class="nav-logo-container">
      <img class="nav-logo" src="/favicon.png"/>
    </a>
    <ul class="nav-links">
      <li><a href="/troll/index.html" style="color: red; background-color: yellow;">PUBLISHING CLOSED FOR THE NIGHT (MAYBE DONT SPAM NEXT TIME)</a></li>
      <li><a href="/index.html">Home</a></li>
      <li><a href="/projects/index.html">Projects</a></li>
      <li><a href="/videos/index.html">Videos</a></li>
    </ul>
  </nav>
`);

const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
  const linkPath = link.getAttribute('href');
  if (currentPath === linkPath || (currentPath === '' && linkPath === '/')) {
    link.classList.add('active');
  }
});