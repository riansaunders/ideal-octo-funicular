import axios from "axios";
import io from "socket.io-client";
import { getAuth, signInAnonymously } from "firebase/auth";

const isDev = process.env.NODE_ENV !== "production";
const endPoint = isDev ? "http://localhost:8080" : "/";

export const ioClient = io(endPoint);

export const client = axios.create({
  baseURL: endPoint,
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
