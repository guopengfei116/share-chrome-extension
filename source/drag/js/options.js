
// 向所有页面发送配置修改消息
function notifyOptionChange(tabs) {
    for (var i = 0; i < tabs.length; ++i) {
        var tab = tabs[i];
        chrome.tabs.sendMessage(
            tab.id, {
                message: "set_options",
                options: {
                    enable_gesture: localStorage.getItem('enable_gesture')
                }
            }
        );
    }
}

// 遍历所有的窗口，获取子页面
function iterateWindows(windows) {
    for (var i = 0; i < windows.length; ++i) {
        chrome.tabs.getAllInWindow(windows[i].id, notifyOptionChange);
    }
}

// 修改配置
function saveOptions() {
    localStorage.setItem('enable_gesture', $('#enable_gesture').is(':checked'));

    // 像所有窗口发送修改通知
    chrome.windows.getAll({
        populate: true
    }, iterateWindows);

    // 提示信息
    $('#hint').css('visibility', 'visible');
    setTimeout(function () {
        $('#hint').css('visibility', 'hidden');
    }, 1500);
}

// 恢复默认配置
function resetOptions() {
    $('#enable_gesture').attr('checked',  false);
}

// 恢复配置
function restoreOptions () {
    var enable_gesture = localStorage.getItem('enable_gesture');
    if(!enable_gesture || enable_gesture == 'false') {
        $('#enable_gesture').attr('checked', false);
    }else {
        $('#enable_gesture').attr('checked', true);
    }
}

// 国际化
function internationalization () {
    function setText(id, name) {
        $('#' + id).text(chrome.i18n.getMessage(name));
    }
    setText("prompt", "extDescription");
    setText("disable_drag", "option_prompt");
    setText("alt_key_label", "option_alt_key");
    setText("ctrl_key_label", "option_ctrl_key");
    setText("use_right_button_label", "option_right_key");
    setText("enable_gesture_label", "option_gesture_classify");
    setText("right", "option_right_gesture");
    setText("left", "option_left_gesture");
    setText("up", "option_up_gesture");
    setText("down", "option_down_gesture");
    setText("up_down", "option_up_angle_gesture");
    setText("down_right", "option_down_right_gesture");
    setText("save", "option_save");
    setText("reset", "option_clear");
    setText("hint", "option_hint");
}

$(function () {
    ~function init() {
        restoreOptions();
        internationalization();
    }();
    $('#save').click(function () {
        saveOptions();
    });
    $('#reset').click(function () {
        resetOptions();
    });
});
