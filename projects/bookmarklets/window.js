javascript:(function() {
    function callback() {
        const jsFrame = new JSFrame();
        const frame = jsFrame.create({
            title: 'Window',
            left: 20, top: 20, width: 320, height: 160,
            url: 'https://pavelsutormin.github.io/projects/bookmarklets/window_contents.html',
            movable: true,
            resizable: true,
            urlLoaded: (frame) => {
                console.log("Window loaded!");
            }
        });
        frame.show();
    }

    document.createElement("script");
    s.src="https://riversun.github.io/jsframe/jsframe.js";
    if (s.addEventListener) {
        s.addEventListener("load", callback, false);
    } else if (s.readyState) {
        s.onreadystatechange = callback;
    }
    document.body.appendChild(s);
})();
