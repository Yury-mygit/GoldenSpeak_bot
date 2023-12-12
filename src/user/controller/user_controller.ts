/* read me
*  Is responsible for interacting with the database and storing payment data
*/
import { Request, Response, NextFunction } from 'express';
import {bot} from "../../bot"; //grammy

class Payment_Contriller {



    constructor() {

        // this.createPay = this.createPay.bind(this);
    }

    errorHandler = (err: unknown, res: Response) =>{
        console.log(err);
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }


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






}



export default new Payment_Contriller()
