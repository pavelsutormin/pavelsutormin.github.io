window.onload = function(e) {
    const countElem = document.getElementById('count');
    const counterAdd = document.getElementById('counter-add');
    const counterSub = document.getElementById('counter-sub');

    const firebaseConfig = {
        databaseURL: "https://pasha-website-default-rtdb.firebaseio.com",
        projectId: "pasha-website",
        storageBucket: "pasha-website.firebasestorage.app",
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const countRef = database.ref('count');

    let count = 0;

    function setCounter(new_count) {
        count = new_count;
        countElem.innerHTML = `count is ${count}`;

        countRef.set(count);
    };

    function setError(error) {
        countElem.innerHTML = `<p style="color: red;">${error}</p>`;
    }

    counterAdd.addEventListener('click', () => setCounter(count + 1));
    counterSub.addEventListener('click', () => setCounter(count - 1));

    countRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            setCounter(data);
        } else {
            setError("No data available");
        }
    }, (error) => {
        setError(`Error fetching data: ${error}`);
    });
}
