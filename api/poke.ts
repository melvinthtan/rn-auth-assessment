import { DB_NAME } from "@/api/auth";
import { delay } from "@/libs/delay";
import { openDatabaseAsync } from "expo-sqlite";

export const catchPoke = async ({ userId }: { userId: string }) => {
  await delay(2000);

  const countResponse = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species?limit=1"
  );

  const countResult = await countResponse.json();

  const count = countResult.count;

  const catchResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${getRandomBetween(1, count)}`
  );

  const catchResult = (await catchResponse.json()) as {
    id: string;
    name: string;
    sprites: {
      front_default: string;
      other: { "official-artwork": { front_default: string } };
    };
  };

  const poke = {
    id: catchResult.id,
    name: catchResult.name,
    img: catchResult.sprites?.other?.["official-artwork"]?.front_default,
    sprite: catchResult.sprites?.front_default,
  };

  const db = await openDatabaseAsync(DB_NAME);

  await db.runAsync(
    `
    INSERT INTO pokemons (poke_id, user_id, name, sprite_url, img_url)
    VALUES ($poke_id, $user_id, $name, $sprite_url, $img_url);
    `,
    {
      $poke_id: poke.id,
      $user_id: userId,
      $name: poke.name,
      $sprite_url: poke.sprite,
      $img_url: poke.img,
    }
  );

  return poke;
};

export const getPokeList = async ({ userId }: { userId: string }) => {
  const db = await openDatabaseAsync(DB_NAME);

  const pokes = (await db.getAllAsync(
    "SELECT * FROM pokemons WHERE user_id = ?",
    userId
  )) as { name: string; img_url: string; sprite_url: string }[];

  return pokes.map((p) => ({
    name: p.name,
    img: p.img_url,
    sprite: p.sprite_url,
  }));
};

const getRandomBetween = (from: number, to: number) => {
  return Math.floor(Math.random() * (to - from + 1) + from);
};
