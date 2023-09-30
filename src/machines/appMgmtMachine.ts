import { createMachine, assign,ActorRefFrom } from "xstate";
import { elementReady, getViewportSize } from "../helpers/utils";
import {dragDropMachine} from './dragmachine'

export type MachineContext = {
    container_id: string
};


export type MachineState =
    | { value: "loading"; context: MachineContext }
    | { value: "loading.wait_for_root"; context: MachineContext }
    | { value: "loading.setup_viewport"; context: MachineContext }
    | { value: "loading.attach_events"; context: MachineContext }
    | { value: "idle"; context: MachineContext }
    | { value: "start"; context: MachineContext }



export type MachineEvent =
    | {
        type: 'EVENTS.APP.RELOAD'
    }







export const appMgmtMachine = createMachine<
    MachineContext,
    MachineEvent,
    MachineState
>({
    predictableActionArguments: true,
    initial: "loading",
    id: "appmgmtmachine",
    context: {
        container_id: ""

    },

    states: {
        loading:{
            initial:"wait_for_root",
            states:{
                wait_for_root:{
                    invoke:{
                        id: "wait_for_root_observer",
                        src:(_,e)=>elementReady(`#${_.container_id}`),
                        onDone:{
                            target: "setup_viewport",
                            actions:[
                                (_,e)=>console.log("appmgmtmachine.locading.wait_for_root finished")
                            ]
                        },
                        onError:{
                            actions:[
                                (_,e)=>console.log("appmgmtmachine.locading.wait_for_root error",e )
                            ],
                            target: "#error"
                        }
                        
                    },
                    entry: (_, e) => console.log("appmgmtmachine.loading.wait_for_root entry"),
                    exit: (_, e) => console.log("appmgmtmachine.loading.wait_for_root exit", e),
                },
                setup_viewport: {

                    entry: (_, e) => console.log("appmgmtmachine.loading.setup_viewport entry"),
                    exit: (_, e) => console.log("appmgmtmachine.loading.setup_viewport exit", e),
                    invoke:{
                        src: (_,e)=>new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(true)
                            },1000)
                        }),
                        onDone:{
                            target:"#start"
                        }
                    }
                },
                attach_events: {
                    entry: (_, e) => console.log("appmgmtmachine.loading.attach_events entry"),
                    exit: (_, e) => console.log("appmgmtmachine.loading.attach_events exit", e),
                }

            },
            entry: (_, e) => console.log("appmgmtmachine.loading entry"),
            exit: (_, e) => console.log("appmgmtmachine.loading exit", e),
        },


        start: {
            id: "start",
            entry: (_, e) => console.log("appmgmtmachine.start entry"),
            exit: (_, e) => console.log("appmgmtmachine.start exit", e),
            // invoke:[
            //     {

            //         id: "dragDropMachine",
            //         src: dragDropMachine,
            //         data: (context, event) => {
            //           const el = document.getElementById(context.container_id)
            //           const {width, height} = getViewportSize(context.container_id)
            //           const x = width/2, y = height/2
                      
          
            //           const payload = {
            //             el: el,
            //             offsetx: x,
            //             offsety: y,
            //           }
            //           console.log("invoking dragDropMachine", { x, y }, event)
          
            //           return payload
            //         }
            //       },
            // ]

        },

        error: {
            id: "error",
            entry: (_, e) => console.log("appmgmtmachine.error entry"),
            exit: (_, e) => console.log("appmgmtmachine.error exit", e),
            on:{
                'EVENTS.APP.RELOAD':{
                    target:"loading"
                }
            }
        }

    }
}, {
    actions: {

    },
    // services:{
    //   crop: cropWidgetMachine
    // }
});


export type ApiMachineActorType = ActorRefFrom<typeof appMgmtMachine>
