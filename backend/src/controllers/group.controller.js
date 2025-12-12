import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 10,
});

const prisma = new PrismaClient({
  adapter,
});

// GET all groups
export const getGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// GET single group by ID
export const getGroup = async (req, res) => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch group" });
  }
};

// CREATE new group
export const createGroup = async (req, res) => {
  try {
    const { group_name, arrival, departure } = req.body;

    const newGroup = await prisma.group.create({
      data: {
        group_name,
        arrival: new Date(arrival),
        departure: new Date(departure),
      },
    });

    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

// UPDATE group
export const updateGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { group_name, arrival, departure } = req.body;

    const updated = await prisma.group.update({
      where: { id },
      data: {
        group_name,
        arrival: new Date(arrival),
        departure: new Date(departure),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update group" });
  }
};

// DELETE group
export const deleteGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.group.delete({ where: { id } });

    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};
