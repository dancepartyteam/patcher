const DOMAINS = {
    NAS: 'http://nas-wii.dnceprty.co',
    SHOP: 'http://s-wii.dnceprty.co',
    WDF_JD6: 'http://wdf-jd6.dnceprty.co',
    WDF_JD5: 'http://wdf-jd5.dnceprty.co',
    JMCS: 'http://jmcs-wii.dnceprty.co',
    TRACKING: 'http://tracking-wii.dnceprty.co'
};

const ROOMS = {
    LEGACY: 'legacy', // 2016 - 2017 - 2018 and above
    JD2015: 'jd2015', // 2015
    JD2016: 'jd2016', // 2016
    JD2017: 'jd2017', // 2017
    JD2018: 'jd2018', // 2018
    JD2019: 'jd2019', // 2019
    JD2020: 'jd2020', // 2020
    JDASIA: 'jdasia', // JD Asia
    JD5: 'jd5', // 2014
};

const SERVERS = {
    NAS: [{
        original: 'https://naswii.nintendowifi.net/ac',
        replacement: `${DOMAINS.NAS}/ac`
    }, {
        original: 'https://naswii.nintendowifi.net/pr',
        replacement: `${DOMAINS.NAS}/pr`
    }],
    SHOP: [{
        original: 'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP',
        replacement: `${DOMAINS.SHOP}/ecs/services/ECommerceSOAP`,
        ignore: [2016, 2017, 2018, 2019, 2020, "ASIA"]
    }],
    WDF_LEGACY: [{
        original: 'https://wii-dance6-ws1.ubisoft.com/wdfjd6/',
        replacement: `${DOMAINS.WDF_JD6}/legacy/`
    }, {
        original: 'https://wii-dance6-ws1.ubisoft.com',
        replacement: DOMAINS.WDF_JD6
    }],
    WDF_JD5: [{
        original: 'https://tracking-wii-dance.ubisoft.com/wdf/',
        replacement: `${DOMAINS.WDF_JD5}/wdf/`
    }],
    JMCS: [
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/DancerCard/RequestDancerProfiles',
            replacement: `${DOMAINS.JMCS}/DancerCard/RequestDancerProfiles`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/DancerCard/RequestDancerProfile',
            replacement: `${DOMAINS.JMCS}/DancerCard/RequestDancerProfile`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/DancerCard/UploadDancerProfile',
            replacement: `${DOMAINS.JMCS}/DancerCard/UploadDancerProfile`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/HighScores/uploadMyScore',
            replacement: `${DOMAINS.JMCS}/HighScores/uploadMyScore`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/HighScores/lookForOpponentHighScores',
            replacement: `${DOMAINS.JMCS}/HighScores/lookForOpponentHighScores`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/HighScores/lookForSpecificHighScore',
            replacement: `${DOMAINS.JMCS}/HighScores/lookForSpecificHighScore`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/HighScores/getPartialScores',
            replacement: `${DOMAINS.JMCS}/HighScores/getPartialScores`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/Leaderboard/getWorldWideLeaderBoard',
            replacement: `${DOMAINS.JMCS}/Leaderboard/getWorldWideLeaderBoard`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/Leaderboard/getCountryLeaderBoard',
            replacement: `${DOMAINS.JMCS}/Leaderboard/getCountryLeaderBoard`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/Mashup/getCurrentMap',
            replacement: `${DOMAINS.JMCS}/Mashup/getCurrentMap`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/Mashup/getMetadata',
            replacement: `${DOMAINS.JMCS}/Mashup/getMetadata`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/Profanity/checkProfanity',
            replacement: `${DOMAINS.JMCS}/Profanity/checkProfanity`,
            ignore: [2014, 2015, 2016, 2017]
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/StarChallenge/getCommonData',
            replacement: `${DOMAINS.JMCS}/StarChallenge/getCommonData`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/TokenPermission/getTokenPermission',
            replacement: `${DOMAINS.JMCS}/TokenPermission/getTokenPermission`,
            ignore: [2014, 2015, 2016, 2017]
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com/ConstantProvider/getConstants',
            replacement: `${DOMAINS.JMCS}/ConstantProvider/getConstants`
        },
        {
            original: 'https://wii-dance6-ws2.ubisoft.com',
            replacement: DOMAINS.JMCS
        }
    ],
    TRACKING: [{
        original: 'https://tracking-wii-dance.ubisoft.com',
        replacement: DOMAINS.TRACKING
    }],
    // this is stupid
    TRACKING_JD5: [{
        original: 'https://tracking-wii-dance.ubisoft.com/',
        replacement: DOMAINS.TRACKING + "/",
        required: false
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
const STRINGS_2015 = [
    ...STRINGS_LEGACY,
    {
        original: `/${ROOMS.LEGACY}/`,
        replacement: `/${ROOMS.JD2015}/`
    }
];

// Strings for JD2014 replacement
const STRINGS_2014 = [
    ...SERVERS.NAS,
    ...SERVERS.SHOP,
    ...SERVERS.WDF_JD5,
    ...SERVERS.TRACKING_JD5
];

const STRINGS_LYN = [
    ...SERVERS.NAS,
    ...SERVERS.SHOP,
    ...SERVERS.TRACKING_JD5,
];

// Game IDs for JD2014 (including mods)
const JD5_IDS = [
    'SJOP41', // JD2014 PAL
    'SJOE41', // JD2014 NTSC
    'SJME89' // JDJAPAN PAL
];

// These are our old server domains, this is used to detect DOL files with old URLs.
const OLD_DOMAINS = ["danceparty.lol", "danceparty.online", "dancepartyonline.tk", "termy.lol", "ryuatelier.org"];

module.exports = {
    DOMAINS,
    ROOMS,
    SERVERS,
    JD5_IDS,
    OLD_DOMAINS,
    STRINGS_2014,
    STRINGS_2015,
    STRINGS_LYN,
    STRINGS_LEGACY
};