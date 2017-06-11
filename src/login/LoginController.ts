import { Router, Request, Response } from 'express';
import { LoginService } from './LoginService';
import { User } from './../schemas/User';

// Dependencies
const loginSrv: LoginService = new LoginService();

// Assign router to the express.Router() instance
const loginRouter: Router = Router();

/**
 * Method:
 * Verb:
 * Route: 
 */
loginRouter.post('/', async(req: Request, res: Response) => {
    await loginSrv.standardLogin(req.body.user, req.body.password)
        .then((user: User) => {
            //let session = req.session;
            //session.username = req.body.user;
            //session.email = req.body.email;
            //session.event = req.body.event;
            //user.event = req.body.event;
            res.status(200).send({ user: user });
        })
        .catch(err => {
            console.log('LOGIN ERROR: ', err);
            res.status(401).send();
        });
});

/**
 * Method:
 * Verb:
 * Route: 
 */
loginRouter.get('/', async(req: Request, res: Response) => {
    
});

/**
 * Method:
 * Verb:
 * Route: 
 */
loginRouter.get('/', async(req: Request, res: Response) => {
    
});

// Export the express.Router() instance
export const LoginController: Router = loginRouter;