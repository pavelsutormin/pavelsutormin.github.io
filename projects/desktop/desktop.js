$(document).ready(function(){
    const apps = ["main"];
    const frames = [];
    const buttons = [];
    const jsFrame = new JSFrame();
    for (let i = 0; i < apps.length; i++) {
        buttons[buttons.length] = false;
        $.getJSON( "apps/" + apps[i] + "/config.json", function(config) {
            frames[frames.length] = jsFrame.create({
                title: config.name,
                left: config.left, top: config.top, width: config.width, height: config.height,
                appearanceName: "yosemite",
                url: "apps/" + apps[i] + "/" + config.html
            }).hide();

            var icon = $("<img>");
            icon.attr("src", "apps/" + apps[i] + "/" + config.icon);
            icon.css({
                "display": "block",
                "position": "fixed",
                "width": config.icon_w + "px",
                "height": config.icon_h + "px",
                "margin-top": "auto",
                "margin-bottom": "auto"
            });
            icon.click(function() {
                buttons[i] = !buttons[i];
                frames[i].setControl(buttons[i]);
            });
            $("#toolbar").append(icon);
        });
    }

    /*var clicked0 = false;
    $("#btn0").click(function(){
        clicked0 = !clicked0;
        if (clicked0) {
            frames.forEach(function(frame, index, frames) {
                frame.show();
            });
        } else {
            frames.forEach(function(frame, index, frames) {
                frame.hide();
            });
        }
    });*/
});
