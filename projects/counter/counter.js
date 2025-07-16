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
        fetch("https://api-sutormin-org-jrkz.onrender.com/count/add");
    }

    function subCount() {
        fetch("https://api-sutormin-org-jrkz.onrender.com/count/add");
    }

    counterAdd.addEventListener('click', () => setCounter(count + 1));
    counterSub.addEventListener('click', () => setCounter(count - 1));
    
    var socket = io();
    socket.on('count_changed', (newCount) => {
        changeCount(newCount);
    });
}
