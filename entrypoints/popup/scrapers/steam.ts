export type SteamSavedGame = {
    name: string;
    files: number;
    size: string;
    url: string;
}

export const fetchSteamSavedGames = async (): Promise<SteamSavedGame[]> => {
    const response = await fetch(
      "https://store.steampowered.com/account/remotestorage"
    );
  
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
  
    const table = doc.querySelector("#main_content table");
    if (!table) {
      return [];
    }
  
    const rows = table.querySelectorAll("tbody tr");
    const games = Array.from(rows).map((row) => {
      const cells = row.querySelectorAll("td");
      const name = cells[0]?.textContent?.trim() || "";
      const files = Number(cells[1]?.textContent?.trim() || "0");
      const size = cells[2]?.textContent?.trim() || "";
      const linkElement = cells[3]?.querySelector("a");
      const url = linkElement?.getAttribute("href") || "";
  
      return {
        name,
        files,
        size,
        url,
      };
    });
  
    return games.sort((a, b) => a.name.localeCompare(b.name));
  }
  