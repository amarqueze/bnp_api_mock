import {Router, Request, Response, NextFunction} from 'express';
 

function getStatusAccepted(): string {
    return `<document>
    <header>
      <sender>KRA</sender>
      <message_type>103</message_type>
    </header>
    <responseDetails>
      <OrgMsgId>referencial</OrgMsgId>
      <respStatus>ACCEPTED</respStatus>
    </responseDetails>
  </document>`;
}

function getStatusRejected(): string {
    return `<document>
    <header>
      <sender>KRA</sender>
      <message_type>103</message_type>
    </header>
    <responseDetails>
      <OrgMsgId>referencial</OrgMsgId>
      <respStatus>REJECTED</respStatus>
      <respReason>Validar Credenciales para conexión con las colas del participante</respReason>
    </responseDetails>
  </document>`;
}

export class BNPRouter {
    router: Router;

    /**
     * Initialize the Router
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * POST command to micro app
     */
    public postCommand(req: Request, res: Response, _next: NextFunction) {
        console.log("POST Request: /api/message");
        res.set('Content-Type', 'text/xml');
        if( req.get('status-response') === 'ACCEPTED' ) {
            res.status(202).send(getStatusAccepted());
        } else if(req.get('status-response') === 'REJECTED') {
            res.status(400).send(getStatusRejected());
        } else {
            const statusNumber = !isNaN(req.get('status-response')) ? Number(req.get('status-response')) : 500;
            res.status(statusNumber).send("ERROR");
        }
    }

    /**
     * GET command to micro app
     */
    public getCommand(req: Request, res: Response, _next: NextFunction) {
        console.log("GET Request: /api/message");
        res.status(202).send("No hay mensajes en la cola de salida");
    }

    public getHealthCheck(req: Request, res: Response, _next: NextFunction) {
        console.log("HealthCheck: OK");
        res.status(200).send("OK");
    }
     
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.post('/message', this.postCommand);
        this.router.get('/message', this.getCommand);
        this.router.get('/health-check', this.getHealthCheck);
        
    }
}

// Create the Router, and export its configured Express.Router
const bnpRouter = new BNPRouter();
bnpRouter.init();

export default bnpRouter.router;
