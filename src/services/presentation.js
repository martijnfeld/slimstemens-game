let PresentationService = {};

let callbacks = {
    availabilityChange: [],
    connected: []
};

let presentationRequest = undefined;
let presentation = undefined;

function subscribeCallback(name, callback){
    callbacks[name].push(callback);
}
function triggerCallbacks(name, ...params){
    callbacks[name].forEach(callback => {
        callback(...params)
    });
}

// Bereid de verbinding voor
export const setup = () => {
    return new Promise((resolve, reject) => {
        presentationRequest = new PresentationRequest(["/receiver"]);
        navigator.presentation.defaultRequest = presentationRequest;
        presentationRequest.getAvailability().then((availability) => {
            availability.onchange = function () {
                triggerCallbacks('availabilityChange', this.availability)
            };
            resolve(this.availability);
        }).catch(function (err) {
            // Availability monitoring is not supported by the platform, so discovery of
            // presentation displays will happen only after request.start() is called.
            // Pretend the devices are available for simplicity; or, one could implement
            // a third state for the button.
            resolve(true);
        });
    })
}

export const onConnected = (callback) => {
    subscribeCallback('connected', callback)
};
export const connect = () => {
    return new Promise((resolve, reject)=>{
        presentationRequest.start().then(presentationObj => { 
            presentation = presentationObj;
            console.log(presentationObj)
            triggerCallbacks('connected', presentation)
            resolve();
        }).catch(reject);
    });;
}

export default {
    setup,
    onConnected,
    connect
};