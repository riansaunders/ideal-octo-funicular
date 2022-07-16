import axios from "axios";
import { getAuth, signInAnonymously } from "firebase/auth";

const isDev = process.env.NODE_ENV !== "production";

export const client = axios.create({
  baseURL: isDev ? "http://localhost:8080" : "/",
});

client.interceptors.request.use(async (config) => {
  const auth = getAuth();

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  const idToken = await auth.currentUser!.getIdToken();

  config.headers ??= {};
  config.headers["authorization"] = `Bearer ${idToken}`;

  return config;
});
