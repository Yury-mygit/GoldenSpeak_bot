import { body, validationResult } from 'express-validator';
class Validator {

    static messegeBylder = (s:string) => {
        return `Validator error: ${s}`
    }

    static notification() {
        return [
            // body('user_id').exists().withMessage(this.messegeBylder('user_id is required')),
            body('telegram_id').optional().isNumeric().toInt().withMessage(this.messegeBylder(' user_id must be a number')),
            // body('telegram_id').optional().custom((value:number) => value > 0 && value < 10000000000).withMessage('Validator: user_id must be greater than 0 and less than 1000'),
            // body('skip').optional({ nullable: true, checkFalsy: true }).isNumeric().toInt().withMessage('Validator: skip must be a number'),
            // body('note').optional({ nullable: true, checkFalsy: true }).isString().withMessage('Validator: limit must be a number'),
            (req: any, res: any, next: any) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                next();
            },
            (req: any, res: any, next: any) => {
                const validProperties = ['telegram_id', 'note'];
                const extraProperties = Object.keys(req.body).filter(prop => !validProperties.includes(prop));
                if (extraProperties.length) {
                    return res.status(400).json({ errors: `Validator: Invalid properties in request: ${extraProperties.join(', ')}` });
                }
                next();
            },
            (req: any, res: any, next: any) => {
                next();
            }
        ];
    }


}

export default Validator