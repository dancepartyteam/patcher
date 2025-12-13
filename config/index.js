const WII = require("./wii");
const PS3 = require("./ps3");

// Game versions
const PAL = "PAL";
const NTSC = "NTSC";

const REGIONS = {
    PAL: 'PAL',
    NTSC: 'NTSC'
};

const PLATFORMS = {
    WII: 'WII',
    PS3: 'PS3'
};

const GAMES = [
    {
        version: 1000,
        name: "Just Dance Asia",
        wii: {
            ids: {
                ASIE41: { r: PAL },
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JDASIA,
            isAvailable: true,
            warnings: [
                "Just Dance Asia requires modficiation of the files to enable WDF. Read https://docs.dnceprty.co/books/legacy/page/enabling-world-dance-floor-on-games-without-native-wdf-support for more information."
            ]
        }
    },
    {
        version: 2020,
        name: "Just Dance 2020",
        wii: {
            ids: {
                S2UP41: { r: PAL },
                S2UE41: { r: NTSC },
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JD2020,
            isAvailable: true,
            warnings: [
                "Just Dance 2020 requires modficiation of the files to enable WDF. Read https://docs.dnceprty.co/books/legacy/page/enabling-world-dance-floor-on-games-without-native-wdf-support for more information."
            ]
        }
    },
    {
        version: 2019,
        name: "Just Dance 2019",
        wii: {
            ids: {
                S5EP41: { r: PAL },
                S5EE41: { r: NTSC },
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JD2019,
            isAvailable: true,
            warnings: [
                "Just Dance 2019 requires modficiation of the files to enable WDF. Read https://docs.dnceprty.co/books/legacy/page/enabling-world-dance-floor-on-games-without-native-wdf-support for more information."
            ]
        }
    },
    {
        version: 2018,
        name: "Just Dance 2018",
        wii: {
            ids: {
                SE8P41: { r: PAL },
                SE8E41: { r: NTSC }
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JD2018,
            isAvailable: true
        }
    },
    {
        version: 2017,
        name: "Just Dance 2017",
        wii: {
            ids: {
                SZ7P41: { r: PAL },
                SZ7E41: { r: NTSC }
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JD2017,
            isAvailable: true
        }
    },
    {
        version: 2016,
        name: "Just Dance 2016",
        wii: {
            ids: {
                SJNP41: { r: PAL },
                SJNE41: { r: NTSC }
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JD2016,
            isAvailable: true
        }
    },
    {
        version: 2015,
        name: "Just Dance 2015",
        wii: {
            ids: {
                SE3P41: { r: PAL },
                SE3E41: { r: NTSC }
            },
            isJD15: true,
            strings: WII.STRINGS_2015,
            isAvailable: true
        }
    },
    {
        version: 2014,
        name: "Just Dance 2014",
        wii: {
            ids: {
                SJOP41: { r: PAL },
                SJOE41: { r: NTSC }
            },
            isJD14: true,
            strings: WII.STRINGS_2014,
            isAvailable: true
        }
    },
    {
        version: 2,
        name: "Just Dance 2 SE",
        wii: {
            ids: {
                SD2Y41: { r: NTSC }
            },
            isLyN: true,
            strings: WII.STRINGS_LYN,
            string: "Just Dance 2 SE",
            isAvailable: false
        }
    }
];

module.exports = {
    WII, PS3,
    GAMES, REGIONS, PLATFORMS
};