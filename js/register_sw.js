document.addEventListener("DOMContentLoaded",function(evt) {
  console.log("register sw");
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register('serviceworker.js').then(function(reg) {
      console.log("serviceworker registerd",reg);
    }).catch(function(err) {
      console.log("serviceworker register failed",err);
    })
  }else{
    console.log("navigator does not support serviceworker");
  }
})
