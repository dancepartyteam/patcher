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
    // --- Just Dance 2 ---
    {
        version: 2,
        name: "Just Dance 2",
        wii: {
            ids: {
                SD2E41: { r: NTSC },
                SD2P41: { r: PAL },
                SD2Y41: { r: NTSC, isSpecialEdition: true, description: 'Best Buy Edition' },
                SD2E78: { r: NTSC, isSpecialEdition: true, description: 'Target Edition' }
            },
            isLyN: true,
            strings: WII.STRINGS_LYN,
            string: "Just Dance 2",
            isAvailable: true
        }
    },
    // --- Just Dance 3 ---
    {
        version: 3,
        name: "Just Dance 3",
        wii: {
            ids: {
                SJDE41: { r: NTSC },
                SJDP41: { r: PAL },
                SJDX41: { r: NTSC, isSpecialEdition: true, description: 'Special Edition' },
                SJDY41: { r: NTSC, isSpecialEdition: true, description: 'Best Buy Edition' },
                SJDZ41: { r: NTSC, isSpecialEdition: true, description: 'Target Exclusive Edition' },
            },
            isLyN: true,
            strings: WII.STRINGS_LYN,
            string: "Just Dance 3",
            isAvailable: true
        }
    },
    // --- Just Dance 4 ---
    {
        version: 4,
        name: "Just Dance 4",
        wii: {
            ids: {
                SJXE41: { r: NTSC },
                SJXP41: { r: PAL },
                SJXD41: { r: NTSC, isSpecialEdition: true, description: 'Special Edition' },
                SJXW41: { r: NTSC, isSpecialEdition: true, description: 'Walmart Exclusive Edition' } 
            },
            isLyN: true,
            strings: WII.STRINGS_LYN,
            string: "Just Dance 4",
            isAvailable: true
        }
    },
    // --- Just Dance 2014 (JD5) ---
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
    // --- Just Dance 2015 (JD6) ---
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
    // --- Just Dance 2016 (JD7) ---
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
    // --- Just Dance 2017 (JD8) ---
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
    // --- Just Dance 2018 (JD9) ---
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
    // --- Just Dance 2019 (JD10) ---
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
            isAvailable: false,
            warnings: [
                "Just Dance 2019 requires modficiation of the files to enable WDF. Read https://docs.dnceprty.co/books/legacy/page/enabling-world-dance-floor-on-games-without-native-wdf-support for more information."
            ]
        }
    },
    // --- Just Dance 2020 (JD11) ---
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
            isAvailable: false,
            warnings: [
                "Just Dance 2020 requires modficiation of the files to enable WDF. Read https://docs.dnceprty.co/books/legacy/page/enabling-world-dance-floor-on-games-without-native-wdf-support for more information."
            ]
        }
    },
    // --- Just Dance Asia ---
    {
        version: 1000,
        name: "Just Dance Asia",
        wii: {
            ids: {
                ASIE41: { r: PAL },
            },
            strings: WII.STRINGS_LEGACY,
            room: WII.ROOMS.JDASIA,
            isAvailable: false, // no longer available, the game now comes patched
            warnings: [
                "Just Dance Asia requires modficiation of the files to enable WDF. Read https://docs.dnceprty.co/books/legacy/page/enabling-world-dance-floor-on-games-without-native-wdf-support for more information."
            ]
        }
    },
];

module.exports = {
    WII, PS3,
    GAMES, REGIONS, PLATFORMS
};