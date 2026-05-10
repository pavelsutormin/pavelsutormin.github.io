window.onload = function(e) {
  const countElem = document.getElementById('count');
  const counterAdd = document.getElementById('counter-add');
  const counterSub = document.getElementById('counter-sub');

  let count = 0;

  const socket = io("https://api.sutormin.org");

  function changeCount(newCount) {
    count = Number(newCount);
    countElem.innerHTML = `count is ${count}`;
  }

  function addCount() {
    /*fetch('https://api.sutormin.org/count/add')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(data => changeCount(data))
      .catch(error => console.error('Fetch error:', error));*/
    socket.emit("count_add");
  }

  function subCount() {
    /*fetch('https://api.sutormin.org/count/sub')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(data => changeCount(data))
      .catch(error => console.error('Fetch error:', error));*/
    socket.emit("count_sub");
  }

  counterAdd.addEventListener('click', () => addCount());
  counterSub.addEventListener('click', () => subCount());

  socket.on("count_changed", (data) => {
    changeCount(data);
  });

  fetch('https://api.sutormin.org/count/get')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => changeCount(data))
    .catch(error => console.error('Fetch error:', error));
}
