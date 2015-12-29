
$(function () {
    // 创建可密码显示对象
    var showPassword = new ShowPassword();

    // 国际化
    function internationalization () {
        function setText(id, name) {
            $('#' + id).text(chrome.i18n.getMessage(name));
        }
        setText("title", "title");
        setText("select-hint", "select_hint");
        setText("select_mouseover", "select_mouseover");
        setText("select_double-click", "select_doubleclick");
        setText("select_focus", "select_focus");
        setText("select_press-ctrl", "select_pressctrl");
        setText("example", "example");
        setText("is_open", "is_open");
    }

    // 保存类型配置
    function save (behave) {
        chrome.storage.sync.set({
            behave : behave
        });
    }

    // 保存开关配置
    function saveSwitch (boo) {
        chrome.storage.sync.set({
            open : boo
        });
        if(boo) {
            $('#open-btn').attr('checked', true);
            showPassword.init();
        }else {
            $('#open-btn').attr('checked', false);
            showPassword.destroy();
        }
    }

    // select事件绑定
    $('#select').change(function (e) {
        save($(this).val());
        showPassword.changeBehave();
    });

    // 开启关闭事件绑定
    $("#open-btn").on('click', function () {
        var enable_show_password = $(this).is(':checked');
        saveSwitch(enable_show_password);
    });

    // 初始化页面配置和功能
    chrome.storage.sync.get(function (data) {
        if(data.behave) {
            $('#select option')[data.behave - 1].selected = true;
        }
        if(data.open) {
            $('#open-btn').attr('checked', true);
            showPassword.init();
        }else {
            $('#open-btn').attr('checked', false);
            showPassword.destroy();
        }
    });

    // 初始化语言
    internationalization();
});
