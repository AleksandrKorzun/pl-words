module.exports = {
    name: '',
    networks: ['Applovin', 'Facebook', 'Google', 'IronSource', 'Liftoff', 'TikTok', 'UnityAds', 'Vungle', 'Landing', 'Mindworks'],
    customPhaser: true,
    qualityAtlas: [0.4, 0.6],
    qualityTexture: [0.6, 0.8],
    bitrateAudio: 32, // 128, 64, 32, 16
    ios: 'https://apps.apple.com/us/app/my-fantasy-choose-your-story/id1491717191',
    android: 'https://play.google.com/store/apps/details?id=gmem.episode',
    currentVersion: 'default', // после изменения значения нужно заново запустить npm run dev
    versions: {
        default: {
            lang: 'en',
            audio: [],
            fonts: [],
            sheets: [],
            spine: [],
            textures: [],
        },
    },
    facebookPixel: '1048406952587296',
    oneLink: 'https://myfantasy.onelink.me/Udtt'

};
