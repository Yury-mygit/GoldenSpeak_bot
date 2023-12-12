import express from 'express';
import Validator from "../validator/user_validator";
import controller from "../controller/user_controller"

const user_routers = express.Router();

user_routers.post('/notification', ...Validator.notification(), controller.getAllPays_v2);

export default user_routers

/**
 * @openapi
 * paths:
 *   /user/notification:
 *     post:
 *       tags:
 *         - Payment
 *       summary: Your route summary
 *       description: Your route description
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                 telegram_id:
 *                   type: integer
 *                   description: The ID of the student to update
 *                   default: 1
 *                 note:
 *                   type: string
 *                   description: skip
 *                   default: 0
 *                required:
 *                 - telegram_id
 *                 - note
 *
 *       responses:
 *         '200':
 *           description: Successful operation
 *
 */