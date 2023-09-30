import { createMachine, assign, sendParent,ActorRefFrom } from "xstate";
import { throttleTime, scan, map, mergeMap, takeUntil } from 'rxjs/operators';
import { fromEvent, from, merge  } from 'rxjs';
import { EMPTY } from 'rxjs'
type MachineContext  = { 

    el?:HTMLCanvasElement,
    dx: number,
    dy: number,
    pointerx: number,
    pointery: number,
    nativeEvent: any,
    offsetx:number,
    offsety:number
};
 

type MachineState =
  | { value: "idle"; context:MachineContext  }
  | { value: "dragging"; context:MachineContext  }
  | { value: "dragging.outside"; context:MachineContext  }
  | { value: "dragging.inside"; context:MachineContext  }
  | { value: "dropped"; context:MachineContext  }
 

type CanvasPoint  = {
    x: number,
    y: number
}

type MachineEvent = |  {
    type: "mousedown",
    clientX:number,
    clientY:number
} |  {
    type: "mouseup",
    clientX:number,
    clientY:number
} |  {
    type: "mousemove",
    clientX:number,
    clientY:number,
    offsetx:number,
    offsety:number
} | {
    type: "mouseenter"
} | {
    type :"mouseleave"
}| {
    type :"INC"
} | {
    type: 'EVENTS.DND.UPDATECENTER',
    center: CanvasPoint//{offsetx:number,offsety:number} 
}


const elBody = document.body;


export const dragDropMachine = createMachine<
MachineContext, 
MachineEvent,
MachineState
>({
    id:"canvasdndmachine",
    initial: "idle",
  
    context: {
      dx: 0,
      dy: 0,
      pointerx: 0,
      pointery: 0,
      nativeEvent:null,
      offsetx:0,
      offsety:0,
      el:undefined,
      
    },
    // on:{
    //     INC: { actions:  (context, event)=>console.log("dragDropMachine INC",context,  event) }
    // },
    // invoke:[
    //     {
    //         id: 'incInterval',
    //         src: (context, event) => (callback, onReceive) => {
    //           // This will send the 'INC' event to the parent every second
    //           const id = setInterval(() => callback('INC'), 1000);
        
    //           // Perform cleanup
    //           return () => clearInterval(id);
    //         }
    //       }
    // ],
    invoke:[
        {
            src: (_,e)=>new Promise(resolve=>{
                console.log("dragDropMachine strted", e)
                resolve(true)
            })
        },
        {
            src: (_,e)=>{
                //const _cnv = document.getElementById('cnv_app_mainviewport')
                if(undefined === _.el) {
                    console.log("dragDropMachine el is undefined")
                    return EMPTY
                }
                return  fromEvent( _.el as HTMLCanvasElement, 'mousedown')
            }
        },
        {
            src: (_,e)=>{
                return  fromEvent( elBody, 'mouseup')
            }
        },
        {
            src: (_,e)=>{
                return  fromEvent( elBody, 'mousemove').pipe(
                    throttleTime(50)
                )
            }
        },
    ],
    states: {
      idle: {
        id: "idle",
        entry:   
            [
               
            assign({
                dx: (_,e)=>0,
                dy:(_,e)=>0,
                pointerx: (_,e)=>0,
                pointery:(_,e)=>0,
                nativeEvent:(_,e)=>null,
                offsetx:(_,e)=>_.offsetx,
                offsety:(_,e)=>_.offsety,
                el:(_,e)=>_.el
            }),
            (_, e) => console.log("dragDropMachine.start entry")
         //   (context, event)=>console.log("dragDropMachine idle entry",context,  event),
        ],

       // entry: (_, e) => console.log("apiappmgmtmachineachine.start entry"),
        exit: (_, e) => console.log("appmgmtmachine.start exit", e),
        on: {

            'EVENTS.DND.UPDATECENTER':{

                actions : [
                    
                assign({
                    offsetx: (context, event) => event.center.x ,
                    offsety: (context, event) => event.center.y ,
                }),
                    (_,e)=>{
                    const {x,y} = (e as any).center

                    console.log('EVENTS.DND.UPDATECENTER', e, {x,y})
                }]
            },
          // when this event happens...
          mousedown: {
            // go here...
            target: "dragging",
            // and do this...
            actions:[    

              


                assign({
                    pointerx: (context, event) => event.clientX  ,
                    pointery: (context, event) => event.clientY
                }),

                sendParent((context, event) => ({
                    type: 'EVENTS.CANVAS.DRAGSTART',
                    data: {
                        nativeEvent: event,
                        offsetx:context.offsetx,
                        offsety:context.offsety
                    }
                })),

          //      (context, event)=>console.log("dragDropMachine mousedown entry", context, event)
    
            ]
                
          }
        }
      },
      dragging: {
        on: {
         mouseup: {
            target: "idle",
            actions:     
         [
         
            sendParent((context, event) => ({
                type: 'EVENTS.CANVAS.DROP',
                data: {
                    nativeEvent: event,
                    offsetx:context.offsetx,
                    offsety:context.offsety
                }
            }))
            
        ],
         },
          mousemove: {
                internal: true,
                actions: [
                    assign({
                        dx: (context, event) => event.clientX - context.pointerx,
                        dy: (context, event) => event.clientY - context.pointery
                    }),
                


                    sendParent((context, event) => ({
                        type: 'EVENTS.CANVAS.MOVE',
                        data: {
                            nativeEvent: event,
                            offsetx:context.offsetx,
                            offsety:context.offsety,
                            dx:  event.clientX - context.pointerx,
                            dy: event.clientY - context.pointery
                        }
                    })),
                   // (context, event)=>console.log("mousemove",{dx: event.clientX - context.pointerx, dy: event.clientY - context.pointery} ),
                ]
          }
        }
      },
      dropped: {
        id: "dropped",
        after: {
          1000: "idle"
        }
      }
    }
  });


  export type DragAndDropMachine = ActorRefFrom<typeof dragDropMachine>