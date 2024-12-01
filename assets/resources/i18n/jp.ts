
const win = window as any;

export const languages = {
    // Data
    common:{
        "confirm":"けってい",
        "cancel":"キャンセル",
    },
    loading:{
        "tips":"ロード中（ろーどちゅう）...",
    },
    game:{
        "autoSettingTitle":"自動ゲーム",
        "gaming":"In the middle of a game and can't operate it.",
        "autoing": "It's in automatic mode. Please pause it first.",
    },
};

if (!win.languages) {
    win.languages = {};
}

win.languages.jp = languages;
