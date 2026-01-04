import { delay } from "@/libs/delay";
import { randomUUID } from "expo-crypto";
import { openDatabaseAsync } from "expo-sqlite";

export const DB_NAME = "data.db";

export interface LoginParams {
  email: string;
  password: string;
}

export interface SignUpParams extends Pick<User, "name" | "email"> {
  password: string;
}

export interface AuthenticateParams {
  token: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
};

export const login = async ({
  email,
  password,
}: LoginParams): Promise<(User & { token: string }) | undefined> => {
  await delay(300);

  const db = await openDatabaseAsync(DB_NAME);
  const token = generateToken();

  const user = (await db.getFirstAsync(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    email,
    password
  )) as User;

  if (user) {
    await db.runAsync(
      "UPDATE users SET token = ? WHERE id = ?",
      token,
      user.id
    );
  }

  return user
    ? { id: user.id, name: user.name, email: user.email, token }
    : undefined;
};

export const signup = async ({
  email,
  name,
  password,
}: SignUpParams): Promise<string | undefined> => {
  await delay(300);

  const db = await openDatabaseAsync(DB_NAME);

  const user = (await db.getFirstAsync(
    "SELECT * FROM users WHERE email = ?",
    email
  )) as User;

  if (user) {
    return undefined;
  }

  const token = generateToken();

  // Should have proper token generation and password encryption, but this is just for demo purposes
  await db.runAsync(
    `
    INSERT INTO users (email, name, password, updated_at, token)
    VALUES ($email, $name, $password, strftime('%s', 'now'), $token);
    `,
    {
      $email: email.replace(/'/g, "''"),
      $name: name.replace(/'/g, "''"),
      $password: password.replace(/'/g, "''"),
      $token: token,
    }
  );

  return token;
};

export const authenticate = async ({
  token,
}: AuthenticateParams): Promise<User | undefined> => {
  await delay(2000);

  const db = await openDatabaseAsync(DB_NAME);
  const user = (await db.getFirstAsync(
    "SELECT * FROM users WHERE token = ?",
    token
  )) as User;

  if (user) {
    return { id: user.id, name: user.name, email: user.email };
  }

  return undefined;
};

const generateToken = () => {
  return randomUUID();
};
