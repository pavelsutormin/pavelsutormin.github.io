javascript:(function() {
    function callback() {
        const jsFrame = new JSFrame();
        const frame = jsFrame.create({
            title: "Window",
            left: 20, top: 40, width: 320, height: 220, minWidth: 200, minHeight: 110,
            appearanceName: "material",
            appearanceParam: {
                titleBar: {
                    color: "#ffffff",
                    background: "#333333",
                }
            },
            url: 'https://pavelsutormin.github.io/projects/bookmarklets/window_contents.html',
            movable: true,
            resizable: true,
        }).show();

        frame.setControl({
            hideButton: "closeButton",
            animation: true,
            animationDuration: 150,
        });

        frame.control.on("hid", (frame, info) => {
            frame.closeFrame();
            window.frame = frame;
            window.jsFrame = jsFrame;
            console.log("closed");
        });
    }

    var s = document.createElement("script");
    s.src="https://riversun.github.io/jsframe/jsframe.js";
    if (s.addEventListener) {
        s.addEventListener("load", callback, false);
    } else if (s.readyState) {
        s.onreadystatechange = callback;
    }
    document.body.appendChild(s);
})();
