import { useSteamSavedGames } from "../hooks/steam";
import {
  downloadAllSteamSaves,
  downloadSteamSave,
  SteamSavedGame,
} from "../scrapers/steam";

type HeaderProps = {
  files?: SteamSavedGame[];
};

const Header: React.FC<HeaderProps> = ({ files }) => {
  const numberFiles = files?.reduce((acc, game) => acc + game.files, 0);

  return (
    <div className="flex justify-between items-center">
      <p className="flex items-center gap-1">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="size-4 fill-white"
        >
          <title>Steam</title>
          <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
        </svg>
        steam saved games
      </p>
      {numberFiles && files && (
        <button
          className="text-xs opacity-50"
          onClick={() => downloadAllSteamSaves(files)}
        >
          files {numberFiles}
        </button>
      )}
    </div>
  );
};

export const Steam: React.FC = () => {
  const savedGames = useSteamSavedGames();

  if (!savedGames.data?.success) {
    return (
      <section>
        <Header />
        <p className="text-xs opacity-75">
          you're not logged into steam. please{" "}
          <a
            href="https://store.steampowered.com/login"
            target="_blank"
            className="underline"
          >
            log in
          </a>
        </p>
      </section>
    );
  }

  return (
    <section>
      <Header files={savedGames.data?.data} />
      <ul className="text-xs">
        {savedGames.data?.data?.map((game) => (
          <li
            key={game.name}
            className="flex justify-between hover:underline cursor-pointer"
            onClick={() => downloadSteamSave(game.url, game.name)}
          >
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="size-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              {game.name}
              <span className="opacity-50">({game.size})</span>
            </div>
            {game.files}
          </li>
        ))}
      </ul>
    </section>
  );
};
