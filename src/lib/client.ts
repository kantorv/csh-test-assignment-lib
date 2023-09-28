import { getRandomInt } from "../helpers/mathfuncs";


export class ApplicationManager {
    readonly id:number
    private static instance: ApplicationManager;

    private constructor() { 
        const _id = getRandomInt()
        this.id = _id
        console.log("[ApplicationManager] constructor called", _id)
    }

    /**
    * Returns the average of two numbers.
    *
    * @remarks
    * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
    *
    * @param x - The first input number
    * @param y - The second input number
    * @returns The arithmetic mean of `x` and `y`
    *
    * @beta
    */

    public static getInstance(): ApplicationManager {
       
        if (!ApplicationManager.instance) {
          ApplicationManager.instance = new ApplicationManager();
        }

        console.log("[ApplicationManager] getInstance called111",ApplicationManager.instance.id )

        return ApplicationManager.instance;
    }


    





  
  }