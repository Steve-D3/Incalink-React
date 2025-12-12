import axios from "axios";

const API_URL = "http://localhost:3000/api";

export function getGroups() {
  return axios.get(`${API_URL}/groups`).then((res) => res.data);
}

export function getGroupById(id) {
  return axios.get(`${API_URL}/groups/${id}`).then((res) => res.data);
}

export function createGroup(group) {
  return axios.post(`${API_URL}/groups`, group).then((res) => res.data);
}

export function updateGroup(id, group) {
  return axios.put(`${API_URL}/groups/${id}`, group).then((res) => res.data);
}

export function deleteGroup(id) {
  return axios.delete(`${API_URL}/groups/${id}`).then((res) => res.data);
}
