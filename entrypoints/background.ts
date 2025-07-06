import { fetchSteamSavedGames } from "./popup/scrapers/steam";

export enum MessageType {
  FETCH_STEAM_SAVED_GAMES = 'FETCH_STEAM_SAVED_GAMES',
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === MessageType.FETCH_STEAM_SAVED_GAMES) {
      fetchSteamSavedGames()
        .then(games => sendResponse({ success: true, data: games }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });
});
