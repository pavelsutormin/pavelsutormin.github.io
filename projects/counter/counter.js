window.onload = function(e) {
  const countElem = document.getElementById('count');
  const counterAdd = document.getElementById('counter-add');
  const counterSub = document.getElementById('counter-sub');

  let count = 0;

  function changeCount(newCount) {
    count = newCount;
    countElem.innerHTML = `count is ${count}`;
  }

  function addCount() {
    fetch('https://api.sutormin.org/count/add')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(data => changeCount(data))
      .catch(error => console.error('Fetch error:', error));
  }

  function subCount() {
    fetch('https://api.sutormin.org/count/sub')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(data => changeCount(data))
      .catch(error => console.error('Fetch error:', error));
  }

  counterAdd.addEventListener('click', () => addCount());
  counterSub.addEventListener('click', () => subCount());
}
