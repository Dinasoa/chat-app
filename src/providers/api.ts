import {BASE_URL} from "@/providers/base";
import axios from "axios";

export const api = axios.create({
    baseURL: BASE_URL,
});
