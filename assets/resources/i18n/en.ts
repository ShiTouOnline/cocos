
const win = window as any;

export const languages = {
    // Data
    common:{
        "confirm":"ok",
        "cancel":"cancel",
    },
    loading:{
        "tips":"loading...",
    },
    game:{
        "autoSettingTitle":"Automatic game",
        "gaming":"In the middle of a game and can't operate it.",
        "autoing": "It's in automatic mode. Please pause it first.",
    },
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
