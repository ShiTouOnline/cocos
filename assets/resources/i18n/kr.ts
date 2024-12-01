
const win = window as any;

export const languages = {
    // Data
    common:{
        "confirm":"확정",
        "cancel":"취소",
    },
    loading:{
        "tips":"로딩 중입니다...",
    },
    game:{
        "autoSettingTitle":"자동 게임",
        "gaming":"In the middle of a game and can't operate it.",
        "autoing": "It's in automatic mode. Please pause it first.",
    },
};

if (!win.languages) {
    win.languages = {};
}

win.languages.kr = languages;
