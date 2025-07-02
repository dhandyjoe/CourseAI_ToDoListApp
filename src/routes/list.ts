import { Router } from "express";

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: List (ToDo) management
 */
import { createList, getAllLists, getListById, updateList, deleteList } from "../controllers/listController";
import { authMiddleware } from "../middlewares/authMiddleware";
// import { authMiddleware } from "../middlewares/authMiddleware"; // TODO: implement JWT middleware

const router = Router();


/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: List created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/lists", authMiddleware, createList);
/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Get all lists for the user
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lists
 *       401:
 *         description: Unauthorized
 */
router.get("/lists", authMiddleware, getAllLists);
/**
 * @swagger
 * /api/lists/{id}:
 *   get:
 *     summary: Get a single list by id
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: List id
 *     responses:
 *       200:
 *         description: List found
 *       404:
 *         description: List not found
 *       401:
 *         description: Unauthorized
 */
router.get("/lists/:id", authMiddleware, getListById);
/**
 * @swagger
 * /api/lists/{id}:
 *   put:
 *     summary: Update a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: List id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: List updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: List not found
 *       401:
 *         description: Unauthorized
 */
router.put("/lists/:id", authMiddleware, updateList);
/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Delete a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: List id
 *     responses:
 *       200:
 *         description: List deleted
 *       404:
 *         description: List not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/lists/:id", authMiddleware, deleteList);

export default router;
