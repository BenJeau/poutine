import { useQuery } from "@tanstack/react-query";

import { SteamSavedGamesResponse } from "../scrapers/steam";
import { MessageType } from "../../background";

export const useSteamSavedGames = () => useQuery<SteamSavedGamesResponse>({
  queryKey: ["steam-saved-games"],
  queryFn: async () => {
    const response = await browser.runtime.sendMessage({
      type: MessageType.FETCH_STEAM_SAVED_GAMES
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch Steam saved games');
    }

    return response.data;
  },
});
