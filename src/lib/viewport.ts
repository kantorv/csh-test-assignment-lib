import { elementReady, getViewportSize } from "../helpers/utils"

export class Viewport {
    public width: number = 0
    public height: number = 0
    public readonly containerId:string
    public container:HTMLDivElement = {} as HTMLDivElement

    constructor(containerId:string) { 
        this.containerId = containerId
        console.log("[Viewport] constructor called", this.containerId)

        // elementReady(`#${this.containerId}`)
        //     .then(async (element)=>{
        //         console.log("[Viewport] elementReady resolved", element)
        //         this.container = element as HTMLDivElement
        //         await this.setupContainer()
        //     })
        //     .catch((e)=>{
        //         console.log("[Viewport] elementReady rejected", e)
        //     })

        // const doc = document.getElementById(this.containerId) as HTMLDivElement 
        // if (null === doc){
        //         const errMessage = `Missing content root element with id: ${this.containerId}`
        //         //throw new Error(errMessage);    

        //         setTimeout(() => {
        //             throw new Error(errMessage);
        //         })
        // }


        // this.container = doc
        

    }

    private async setupContainer(){
        
        const _viewport = getViewportSize(this.containerId)
        console.log("[Viewport] setupContainer called", {_viewport})
        this.width = _viewport.width
        this.height = _viewport.height

        const el = document.getElementById(this.containerId)


    }

  
  }