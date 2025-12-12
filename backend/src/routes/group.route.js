import express from "express";
import {
  createGroup,
  deleteGroup,
  getGroups,
  getGroup,
  updateGroup,
} from "../controllers/group.controller";

const router = express.Router();

router.get("/", getGroups);
router.get("/:id", getGroup);
router.post("/", createGroup);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
