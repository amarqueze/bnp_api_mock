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

function getSwift(): string {
  return `
  {1:F01KURAPAPAAXXX0000739856}{2:I998RTGSXXXXXXXXN}{3:{108:2402220000739856}}{4:
    :20:0000126137
    :12:557
    :77E:
    :21:XXXXXXXXXXXXXXXX
    :11S:000
    240222
    :16R:RSN
    :M01:INVFMT
    :M02:The message could not be processed because its format is unsupported
    :16S:RSN
    -}
  `
}

function getNoColas(): string {
  return `No existen colas en el ATS `
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
        const sendPost = () => {
          if( req.get('status-response') === 'ACCEPTED' ) {
            res.status(202).send(getStatusAccepted());
        } else if(req.get('status-response') === 'REJECTED') {
            res.status(400).send(getStatusRejected());
        } else {
            const statusNumber = !isNaN(req.get('status-response')) ? Number(req.get('status-response')) : 500;
            res.status(statusNumber).send("ERROR");
        }
        }

        setTimeout(sendPost, 180000)
    }

    /**
     * GET command to micro app
     */
    public getCommand(req: Request, res: Response, _next: NextFunction) {
        console.log("GET Request: /api/message");
        res.set('Content-Type', 'text/plain');
        const sendResponse = () => {
          if (req.get('status-response') === 'ACCEPTED') {
              res.status(202).send(getSwift());
          } else if (req.get('status-response') === 'REJECTED') {
              res.status(202).send(getNoColas());
          } else {
              const statusNumber = !isNaN(req.get('status-response')) ? Number(req.get('status-response')) : 500;
              res.status(statusNumber).send("ERROR");
          }
      };

      setTimeout(sendResponse, 180000);
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
        this.router.post('/api/participants/Message', this.postCommand);
        this.router.get('/api/participants/Message', this.getCommand);
        this.router.get('/health-check', this.getHealthCheck);
        
    }
}

// Create the Router, and export its configured Express.Router
const bnpRouter = new BNPRouter();
bnpRouter.init();

export default bnpRouter.router;
