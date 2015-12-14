
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
    }

    // 保存配置
    function save (behave) {
        chrome.storage.sync.set({
            behave : behave
        });
    }

    // select事件绑定
    $('#select').change(function (e) {
        save($(this).val());
        showPassword.changeBehave();
    });

    // 初始化select默认选项
    chrome.storage.sync.get(function (data) {
        if(data.behave) {
            $('#select option')[data.behave - 1].selected = true;
        }
    });
    // 初始化语言
    internationalization();
    // 初始化密码显示
    showPassword.init();
});
