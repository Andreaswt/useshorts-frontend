"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select, { ActionMeta, SingleValue } from "react-select";
import { updatePostFromPlaylist } from "~/app/actions/posting";
import { getPlaylists } from "~/app/actions/youtube/actions";
import { useOptionsStore } from "~/stores/optionsStore";

interface PlaylistOption {
  value: string;
  label: string;
  image: string;
}

export default function SelectPlaylist({
  defaultOption,
}: {
  defaultOption: PlaylistOption | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<PlaylistOption[]>(
    defaultOption ? [defaultOption] : [],
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { postFromPlaylist, setPostFromPlaylist } = useOptionsStore();

  useEffect(() => {
    if (postFromPlaylist === null) {
      setPostFromPlaylist(defaultOption);
    }
  }, []);

  const loadPlaylists = async () => {
    if (isFirstLoad) {
      setIsLoading(true);
      const playlists = await getPlaylists();
      setIsLoading(false);
      setOptions(
        playlists.map((playlist) => ({
          value: playlist.id,
          label: playlist.name,
          image: playlist.image,
        })),
      );
      setIsFirstLoad(false);
    }
  };

  const formatOptionLabel = (option: PlaylistOption) => (
    <div className="flex items-center">
      <img
        src={option.image}
        alt={option.label}
        className="mr-2 h-6 w-6 rounded-full"
      />
      <span>{option.label}</span>
    </div>
  );

  const handleChange = (
    selectedOption: SingleValue<PlaylistOption>,
    actionMeta: ActionMeta<PlaylistOption>,
  ) => {
    updatePostFromPlaylist(
      selectedOption?.value ?? null,
      selectedOption?.label ?? null,
      selectedOption?.image ?? null,
    )
      .then(() => {
        if (selectedOption) {
          toast.success(
            "Playlist selected successfully. Clipping from playlist videos now.",
            { duration: 5000 },
          );
        } else {
          toast.success(
            "Playlist unselected successfully. Using videos from channel now.",
            { duration: 5000 },
          );
        }
      })
      .catch(() => {
        toast.error("Failed to select playlist");
      });

    setPostFromPlaylist(selectedOption);
  };

  return (
    <div className="flex w-fit flex-col gap-1">
      <label
        htmlFor="playlistSelect"
        className="block text-sm font-medium text-gray-700"
      >
        Post from playlist
      </label>
      <Select
        id="playlistSelect"
        name="playlistSelect"
        className="mt-1 w-full text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        isLoading={isLoading}
        isSearchable
        isClearable
        options={options}
        value={postFromPlaylist}
        onMenuOpen={loadPlaylists}
        formatOptionLabel={formatOptionLabel}
        onChange={handleChange}
      />
    </div>
  );
}
