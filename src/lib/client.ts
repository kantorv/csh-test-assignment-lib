import { interpret } from 'xstate'
import { appMgmtMachine, type ApiMachineActorType } from "../machines/appMgmtMachine";
import { getRandomInt } from "../helpers/mathfuncs";
import { Viewport } from './viewport';


export class ApplicationManager {
    public readonly id:number
    private static instance: ApplicationManager;
    public vp = {} as Viewport
    public service = {} as ApiMachineActorType
    private containerId = "csh-app-root"

    private constructor() { 
        const _id = getRandomInt()
        this.id = _id
        console.log("[ApplicationManager] constructor called", _id)

        this.setupViewport()
        this.setupService()
        

        console.log("[ApplicationManager] after setupViewport notify", _id)

        
    }

    private setupService(){
      console.log("ApplicationManager.setupService called")
      const service = interpret(appMgmtMachine.withContext({
        container_id: "csh-app-root"
      }), {
        devTools: true,
        execute: false // do not execute actions on state transitions
      });
      
      service.onTransition((state) => {
        // execute actions on next animation frame
        // instead of immediately
        console.log("ApplicationManager.service.onTransition.state", state.value,state.event)
        requestAnimationFrame(() => service.execute(state));
      });

   
      
      service.start();
      this.service = service
    }

    private setupViewport(){
      this.vp = new Viewport(this.containerId)
    }

    public static getInstance(): ApplicationManager {
       
        if (!ApplicationManager.instance) {
          ApplicationManager.instance = new ApplicationManager();
        }

        console.log("[ApplicationManager] getInstance called",ApplicationManager.instance.id )

        return ApplicationManager.instance;
    }


    





  
  }