import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { DB_NAME } from "@/api/auth";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryclient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName={DB_NAME} onInit={migrateDB}>
        <QueryClientProvider client={queryclient}>
          <AuthContextProvider>
            <Stack screenOptions={{ contentStyle: { backgroundColor } }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AuthContextProvider>
        </QueryClientProvider>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

async function migrateDB(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentDbVersion = 0 } =
    (await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version")) || {};
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal'; 

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pokemons;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT UNIQUE,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    updated_at INTEGER
);

CREATE TABLE pokemons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poke_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    img_url TEXT,
    sprite_url TEXT,
    name TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
