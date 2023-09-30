
  export const getViewportSize = ( containerId:string)=>{

      const el= document.getElementById(containerId) 
      if(null === el){
        const errMessage = `Missing content root element with id: ${containerId}`
        throw new Error(errMessage);
      }
  
      // const parent  = el.parentElement as HTMLDivElement
  
      const {width=0, height=0} =   window.getComputedStyle(el) 
  
      const _w = Number(String(width).replace('px', '')).toFixed(0)
      const _h =  Number(String(height).replace('px', '')).toFixed(0)
  
  
  
  
      const  viewport =  {
          width:Number(_w),
          height:Number(_h)
      }
  
  
      console.log('[getViewportSize] viewport!',viewport);
      return viewport
  
  }



   


export function elementReady(selector:string) {
  console.log('[elementReady] called!',selector);
    return new Promise((resolve, reject) => {
      let el = document.querySelector(selector);
      if (el) {resolve(el);}
      new MutationObserver((mutationRecords, observer) => {
        // Query for element matching the specified selector
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          //Once we have resolved we don't need the observer anymore.
          observer.disconnect();
        }
      })
        .observe(document.documentElement, {
          childList: true,
          subtree: true
        });
    });
  }

