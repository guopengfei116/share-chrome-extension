document.addEventListener("mous\145d\157w\156", function(b) {
    if (b.button == 2) {
        var c = b.target;
        while (c) {
            if (c instanceof HTMLAnchorElement) {
                var d = c;
                var e = c['hre\146'];
                var f = c.innerText;
                if (!f) f = '';
                if (f.length > 0) {
                    if (f.charAt(0) == ' ') f = f.substr(1)
                }
                if (f == '') f = e;
                var g = f;
                window['\143\150\162om\145']['\162un\164\151m\145']['se\156dMe\163sage'](undefined, {
                    type: "l\151nkR\151ghtCli\143k",
                    url: e,
                    title: g
                }, function(a) {});
                break
            } else {
                c = c.parentNode
            }
        }
    }
}, true)