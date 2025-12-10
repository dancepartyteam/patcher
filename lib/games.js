const config = require("../config");

class Games {
    constructor() {
        this.games = config.WII.GAMES;
    };

    // Get game by its ID
    getGameById(gameId) {
        return this.games.find(g => g.ids[gameId]);
    };

    // Get game by its version
    getGameByVersion(version) {
        return this.games.find(g => g.version == Number(version));
    };

    // Check if game is available
    isAvailable(idOrVersion) {
        // Check if game exists
        const game = this.getGameById(idOrVersion) || this.getGameByVersion(idOrVersion);

        // If not found, return false
        if (!game) return false;

        // Check if game or id is marked as unavailable
        if (game.isAvailable && game.isAvailable == false) return false;

        // Check if game or id is marked as available
        if (game.ids[idOrVersion] && game.ids[idOrVersion]?.isAvailable == false) return false;

        return true;
    };
};

module.exports = Games;