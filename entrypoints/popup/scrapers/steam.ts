import { buildDocument, downloadZip, zipFiles } from ".";

export type SteamSavedGamesResponse =
  | {
      success: false;
    }
  | {
      success: true;
      data: SteamSavedGame[];
    };

export type SteamSavedGame = {
  name: string;
  files: number;
  size: string;
  url: string;
};

export const fetchSteamSavedGames =
  async (): Promise<SteamSavedGamesResponse> => {
    const response = await fetch(
      "https://store.steampowered.com/account/remotestorage"
    );
    const doc = await buildDocument(response);

    const table = doc.querySelector("#main_content table");
    if (!table) {
      return {
        success: false,
      };
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

    return {
      success: true,
      data: games.sort((a, b) => a.name.localeCompare(b.name)),
    };
  };

export const downloadAllSteamSaves = async (files: SteamSavedGame[]) => {
  const saveFilesWithBlob = await Promise.all(
    files.map(async (file) => {
      const saveFiles = await fetchSteamSave(file.url);
      if (!saveFiles) {
        return file.name;
      }
      return saveFiles.map((f) => ({
        ...f,
        gameName: file.name,
      }));
    })
  );

  const zip = await zipFiles(
    saveFilesWithBlob.flatMap((files) => {
      if (typeof files === "string") {
        // TODO
        return {
          name: files + ".zip",
          blob: new Blob(),
        };
      }
      return files.map((file) => ({
        name: file.gameName + "/" + file.folder + "/" + file.fileName,
        blob: file.blob,
      }));
    })
  );
  await downloadZip(zip, "steam_saves.zip");
};

const fetchSteamSave = async (gameSaveUrl: string) => {
  const response = await fetch(gameSaveUrl);
  const doc = await buildDocument(response);

  const table = doc.querySelector("#main_content table");
  if (!table) {
    return;
  }

  const rows = table.querySelectorAll("tbody tr");
  const saveFiles = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td");
    const folder = cells[0]?.textContent?.trim() || "";
    const fileName = cells[1]?.textContent?.trim() || "";
    const fileSize = cells[2]?.textContent?.trim() || "";
    const dateWritten = cells[3]?.textContent?.trim() || "";
    const downloadLink = cells[4]?.querySelector("a");
    const url = downloadLink?.getAttribute("href") || "";

    return {
      folder,
      fileName,
      fileSize,
      dateWritten,
      url,
    };
  });

  return Promise.all(
    saveFiles.map(async (file) => {
      const response = await fetch(file.url);
      const blob = await response.blob();
      return {
        ...file,
        blob,
      };
    })
  );
};

export const downloadSteamSave = async (
  gameSaveUrl: string,
  gameName: string
) => {
  const saveFilesWithBlob = await fetchSteamSave(gameSaveUrl);
  if (!saveFilesWithBlob) {
    return;
  }

  const zip = await zipFiles(
    saveFilesWithBlob.map((file) => ({
      name: file.folder + "/" + file.fileName,
      blob: file.blob,
    }))
  );

  await downloadZip(zip, gameName + ".zip");
};
