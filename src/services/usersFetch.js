import axios from "axios";

const baseURL =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  crossdomain: true,
});

export function getUserData() {
  return axiosInstance.get("", {
    headers: {
      "Content-Type": "multipart/form-data; charset=utf-8;",
    },
  });
}
