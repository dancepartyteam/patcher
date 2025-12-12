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
        replacement: 'http://nas-wii.dnceprty.co/ac'
    }, {
        original: 'https://naswii.nintendowifi.net/pr',
        replacement: 'http://nas-wii.dnceprty.co/pr'
    }],
    SHOP: [{
        original: 'https://ecs.shop.wii.com/ecs/services/ECommerceSOAP',
        replacement: 'http://s-wii.dnceprty.co/ecs/services/ECommerceSOAP'
    }],
    WDF_LEGACY: [{
        original: 'https://wii-dance6-ws1.ubisoft.com/wdfjd6/',
        replacement: 'http://wdf-jd6.dnceprty.co/legacy/'
    }, {
        original: 'https://wii-dance6-ws1.ubisoft.com',
        replacement: 'http://wdf-jd6.dnceprty.co'
    }],
    WDF_JD5: [{
        original: 'https://tracking-wii-dance.ubisoft.com/wdf/',
        replacement: 'http://wdf-jd5.dnceprty.co'
    }],
    JMCS: [{
        original: 'https://wii-dance6-ws2.ubisoft.com',
        replacement: 'http://jmcs-wii.dnceprty.co'
    }],
    TRACKING: [{
        original: 'https://tracking-wii-dance.ubisoft.com',
        replacement: 'http://tracking-wii.dnceprty.co'
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

// Game IDs for JD2014 (including mods)
const JD5_IDS = [
    'SJOP41', // JD2014 PAL
    'SJOE41', // JD2014 NTSC
    'SJME89' // JDJAPAN PAL
];

// These are our old server domains, this is used to detect DOL files with old URLs.
const OLD_DOMAINS = ["danceparty.lol", "danceparty.online", "dancepartyonline.tk", "termy.lol"];

module.exports = {
    ROOMS,
    SERVERS,
    JD5_IDS,
    OLD_DOMAINS,
    STRINGS_2014,
    STRINGS_2015,
    STRINGS_LYN,
    STRINGS_LEGACY
};