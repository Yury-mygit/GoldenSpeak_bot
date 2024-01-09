/* read me
*  Is responsible for interacting with the database and storing payment data
*/
import { Request, Response, NextFunction } from 'express';
import {bot} from "../../bot"; //grammy

class Payment_Contriller {



    constructor() {

        // this.createPay = this.createPay.bind(this);
    }

    // errorHandler = (err: unknown, res: Response) =>{
    //     console.log(err);
    //     if (err instanceof Error) {
    //         res.status(500).json({ error: err.message });
    //     } else {
    //         res.status(500).json({ error: 'An unknown error occurred' });
    //     }
    // }


    getAllPays_v2 = async (req: Request, res: Response, next: NextFunction) => {
        const { telegram_id, notes } = req.body;

        try {
            // Send a message to the user with the specified telegram_id
            await bot.api.sendMessage(telegram_id, "Your message here.");

            // Respond with success message
            res.json({ "message": "Message sent successfully." });
        } catch (err) {
            this.errorHandler(err, res);
        }
    };

    pay_reminder = async (req: Request, res: Response, next: NextFunction) => {

        const { telegram_id, note } = req.body;

        try {
            // Send a message to the user with the specified telegram_id
            const messageResult = await bot.api.sendMessage(telegram_id, note);

            // Respond with the result of the message sending operation
            res.json({
                status: 'success',
                message: 'Message sent successfully.',
                data: messageResult
            });
        } catch (err) {
            // Call errorHandler to handle the error and respond accordingly
            this.errorHandler(err, res);
        }
    }







// Define the errorHandler method
    errorHandler = (err: any, res: Response) => {
        console.error('Error sending message:', err);

        // Respond with error details
        res.status(500).json({
            status: 'error',
            message: 'Failed to send message.',
            error: err
        });
    }






}



export default new Payment_Contriller()
