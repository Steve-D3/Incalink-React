const request = require("supertest");
const express = require("express");

// Create mock functions
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

// Mock the adapter before any imports
jest.mock("@prisma/adapter-mariadb", () => {
  return {
    PrismaMariaDb: jest.fn().mockImplementation(() => ({})),
  };
});

// Mock PrismaClient before any imports
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      group: {
        findMany: mockFindMany,
        findUnique: mockFindUnique,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
    })),
  };
});

// Now require the controller
const {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} = require("../group.controller");

// Setup Express app for testing
const app = express();
app.use(express.json());
app.get("/groups", getGroups);
app.get("/groups/:id", getGroup);
app.post("/groups", createGroup);
app.put("/groups/:id", updateGroup);
app.delete("/groups/:id", deleteGroup);

describe("Group Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /groups - getGroups", () => {
    it("should return all groups with 200 status", async () => {
      const now = new Date();
      const mockGroups = [
        {
          id: 1,
          group_name: "Group A",
          arrival: now,
          departure: now,
        },
        {
          id: 2,
          group_name: "Group B",
          arrival: now,
          departure: now,
        },
      ];
      mockFindMany.mockResolvedValue(mockGroups);

      const response = await request(app).get("/groups");

      expect(response.status).toBe(200);
      // Dates are serialized as ISO strings in JSON
      expect(response.body).toEqual([
        {
          id: 1,
          group_name: "Group A",
          arrival: now.toISOString(),
          departure: now.toISOString(),
        },
        {
          id: 2,
          group_name: "Group B",
          arrival: now.toISOString(),
          departure: now.toISOString(),
        },
      ]);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });

    it("should return 500 if database error occurs", async () => {
      mockFindMany.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/groups");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to fetch groups" });
    });
  });

  describe("GET /groups/:id - getGroup", () => {
    it("should return a single group with 200 status", async () => {
      const now = new Date();
      const mockGroup = {
        id: 1,
        group_name: "Group A",
        arrival: now,
        departure: now,
      };
      mockFindUnique.mockResolvedValue(mockGroup);

      const response = await request(app).get("/groups/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        group_name: "Group A",
        arrival: now.toISOString(),
        departure: now.toISOString(),
      });
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return 404 if group not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      const response = await request(app).get("/groups/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Group not found" });
    });

    it("should return 500 if database error occurs", async () => {
      mockFindUnique.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/groups/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to fetch group" });
    });
  });

  describe("POST /groups - createGroup", () => {
    it("should create a new group and return 201 status", async () => {
      const newGroupData = {
        group_name: "New Group",
        arrival: "2024-01-01T10:00:00Z",
        departure: "2024-01-10T10:00:00Z",
      };
      const mockCreatedGroup = {
        id: 1,
        group_name: "New Group",
        arrival: new Date(newGroupData.arrival),
        departure: new Date(newGroupData.departure),
      };
      mockCreate.mockResolvedValue(mockCreatedGroup);

      const response = await request(app).post("/groups").send(newGroupData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        group_name: "New Group",
        arrival: new Date(newGroupData.arrival).toISOString(),
        departure: new Date(newGroupData.departure).toISOString(),
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          group_name: "New Group",
          arrival: new Date(newGroupData.arrival),
          departure: new Date(newGroupData.departure),
        },
      });
    });

    it("should return 500 if database error occurs", async () => {
      mockCreate.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/groups").send({
        group_name: "Test Group",
        arrival: "2024-01-01T10:00:00Z",
        departure: "2024-01-10T10:00:00Z",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to create group" });
    });
  });

  describe("PUT /groups/:id - updateGroup", () => {
    it("should update a group and return 200 status", async () => {
      const updateData = {
        group_name: "Updated Group",
        arrival: "2024-02-01T10:00:00Z",
        departure: "2024-02-10T10:00:00Z",
      };
      const mockUpdatedGroup = {
        id: 1,
        group_name: "Updated Group",
        arrival: new Date(updateData.arrival),
        departure: new Date(updateData.departure),
      };
      mockUpdate.mockResolvedValue(mockUpdatedGroup);

      const response = await request(app).put("/groups/1").send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        group_name: "Updated Group",
        arrival: new Date(updateData.arrival).toISOString(),
        departure: new Date(updateData.departure).toISOString(),
      });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          group_name: "Updated Group",
          arrival: new Date(updateData.arrival),
          departure: new Date(updateData.departure),
        },
      });
    });

    it("should return 500 if database error occurs", async () => {
      mockUpdate.mockRejectedValue(new Error("Database error"));

      const response = await request(app).put("/groups/1").send({
        group_name: "Test",
        arrival: "2024-01-01T10:00:00Z",
        departure: "2024-01-10T10:00:00Z",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to update group" });
    });
  });

  describe("DELETE /groups/:id - deleteGroup", () => {
    it("should delete a group and return success message", async () => {
      mockDelete.mockResolvedValue({ id: 1 });

      const response = await request(app).delete("/groups/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Group deleted" });
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return 500 if database error occurs", async () => {
      mockDelete.mockRejectedValue(new Error("Database error"));

      const response = await request(app).delete("/groups/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to delete group" });
    });
  });
});
