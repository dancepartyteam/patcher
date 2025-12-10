
// Game versions
const PAL = "PAL";
const NTSC = "NTSC";

const VERSIONS = {
    PAL: 'PAL',
    NTSC: 'NTSC'
};

const ROOMS = {
    LEGACY: 'legacy', // 2016 - 2017 - 2018 and above
    JD2015: 'jd2015', // 2015
    JD5: 'jd5', // 2014
};


const SERVERS = {
    NAS: [{
        original: 'https://naswii.nintendowifi.net/ac',
        replacement: 'http://12000.termy.lol/ac'
    }, {
        original: 'https://naswii.nintendowifi.net/pr',
        replacement: 'http://12000.termy.lol/pr'
    }],
    SHOP: [{
        original: 'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP',
        replacement: 'http://s.ryuatelier.org/ecs/services/ECommerceSOAP'
    }],
    WDF_LEGACY: [{
        original: 'https://wii-dance6-ws1.ubisoft.com/wdfjd6',
        replacement: 'http://wdfjd6.termy.lol/legacy'
    }, {
        original: 'https://wii-dance6-ws1.ubisoft.com',
        replacement: 'http://wdfjd6.termy.lol'
    }, {
        original: 'wdfjd6',
        replacement: 'legacy'
    }, {
        original: 'wii-dance6-ws1.ubisoft.com',
        replacement: 'wdfjd6.termy.lol'
    }],
    WDF_JD2015: [{
        original: 'https://wii-dance6-ws1.ubisoft.com/wdfjd6',
        replacement: 'http://wdfjd6.termy.lol/jd2015'
    }, {
        original: 'https://wii-dance6-ws1.ubisoft.com',
        replacement: 'http://wdfjd6.termy.lol'
    }, {
        original: 'wdfjd6',
        replacement: 'jd2015'
    }, {
        original: 'wii-dance6-ws1.ubisoft.com',
        replacement: 'wdfjd6.termy.lol'
    }],
    WDF_JD5: [{
        original: 'https://tracking-wii-dance.ubisoft.com/wdf/',
        replacement: 'http://wdf.termy.lol/'
    }],
    JMCS: [{
        original: 'https://wii-dance6-ws2.ubisoft.com',
        replacement: 'http://rvl-nodejsrv.ryuatelier.org'
    }],
    TRACKING: [{
        original: 'https://tracking-wii-dance.ubisoft.com',
        replacement: 'http://wiitrack.termy.lol'
    }]
};



// Strings for LEGACY replacement
const STRINGS_LEGACY = [
    ...SERVERS.NAS,
    ...SERVERS.SHOP,
    ...SERVERS.WDF_LEGACY,
    ...SERVERS.JMCS,
    ...SERVERS.TRACKING
];
// Strings for JD2015 replacement
// Use the same strings as Legacy but replace legacy room name with JD2015
const STRINGS_2015 = {
    ...this.STRINGS_LEGACY,
    [ROOMS.LEGACY]: ROOMS.JD2015
};

// Strings for JD2014 replacement
const STRINGS_2014 = {
    ...SERVERS.NAS,
    ...SERVERS.SHOP,
    ...SERVERS.WDF_JD5,
    ...SERVERS.TRACKING
};

const STRINGS_LYN = {
    ...SERVERS.NAS,
    ...SERVERS.SHOP
};

const GAMES = [
    {
        version: 2018,
        name: "Just Dance 2018",
        ids: {
            SE8P41: { r: PAL },
            SE8E41: { r: NTSC }
        },
        strings: STRINGS_LEGACY
    },
    {
        version: 2017,
        name: "Just Dance 2017",
        ids: {
            SZ7P41: { r: PAL },
            SZ7E41: { r: NTSC }
        },
        strings: STRINGS_LEGACY
    },
    {
        version: 2016,
        name: "Just Dance 2016",
        ids: {
            SJNP41: { r: PAL },
            SJNE41: { r: NTSC }
        },
        strings: STRINGS_LEGACY
    },
    {
        version: 2015,
        name: "Just Dance 2015",
        ids: {
            SE3P41: { r: PAL },
            SE3E41: { r: NTSC }
        },
        isJD15: true,
        strings: STRINGS_2015
    },
    {
        version: 2014,
        name: "Just Dance 2014",
        ids: {
            SJOP41: { r: PAL },
            SJOE41: { r: NTSC }
        },
        isJD14: true,
        strings: STRINGS_2014
    },
    {
        version: 2,
        name: "Just Dance 2 SE",
        ids: {
            SD2Y41: { r: NTSC }
        },
        isLyN: true,
        strings: STRINGS_LYN,
        string: "Just Dance 2 SE"
    }
]

// Game IDs for JD2014 (including mods)
const JD5_IDS = [
    'SJOP41', // JD2014 PAL
    'SJOE41', // JD2014 NTSC
    'SJME89' // JDJAPAN PAL
];

// These are our old server domains, this is used to detect DOL files with old URLs.
const OLD_DOMAINS = ["danceparty.lol", "danceparty.online", "dancepartyonline.tk"];

module.exports = {
    VERSIONS,
    ROOMS,
    SERVERS,
    GAMES,
    JD5_IDS,
    OLD_DOMAINS,
    STRINGS_2014,
    STRINGS_2015,
    STRINGS_LYN,
    STRINGS_LEGACY
};