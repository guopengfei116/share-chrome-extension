document.addEventListener("mousedown", function(e) {
    if (e.button == 2) {
        var target = e.target;
        while(target) {
            if (target instanceof HTMLAnchorElement) {
                var href = target['href'];
                var text = target.innerText;
                if (!text) {
                    text = '';
                }
                if (text.length > 0) {
                    if (text.charAt(0) == ' ') {
                        text = text.substr(1)
                    }
                }
                if (text == '') {
                    text = href;
                }
                window['chrome']['runtime']['sendMessage'](undefined, {
                    type: "linkRightClick",
                    url: href,
                    title: text
                }, function(ma) {});
                break;
            } else {
                target = target.parentNode;
            }
        }
    }
}, true);
