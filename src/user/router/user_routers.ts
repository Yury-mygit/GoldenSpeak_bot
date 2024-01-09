import express from 'express';
import Validator from "../validator/user_validator";
import controller from "../controller/user_controller"

const user_routers = express.Router();

user_routers.post('/pay/reminder', ...Validator.notification(), controller.pay_reminder);

export default user_routers

/**
 * @openapi
 * paths:
 *   /user/pay/reminder:
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
 *                   default: 565047052
 *                 note:
 *                   type: string
 *                   description: skip
 *                   default: Пожалуйса, не забудте оплатить занятие
 *                required:
 *                 - telegram_id
 *                 - note
 *
 *       responses:
 *         '200':
 *           description: Successful operation
 *
 */