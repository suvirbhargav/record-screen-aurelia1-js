//import { inject } from "aurelia-framework";

import * as RecordRTC from "recordrtc";

var recorder;
var theVideo;
var stopButtonStatus = true;

//@inject(Element)
export class App {
  //public clock: HTMLCanvasElement;

  //sourceObject = HTMLMediaElement.srcObject;
  //var stopButtonStatus = new Boolean(true);
  //HTMLVideoElement theVideo;

  constructor(element) {
    this.element = element;
    this.stopButtonStatus = true;
  }

  /*   constructor() {
      //var recorder; // globally accessible

      this.handleBodyClick = e => {
        console.log("clicked");
        console.log(e.target);
      };
    } */

  attached() {
    //const theVideo = this.element.querySelector("video");
    theVideo = this.theVideo; // same with the ref name

    //document.addEventListener('click', this.handleBodyClick);

    if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
      var error = "Your browser does NOT support the getDisplayMedia API.";
      //document.querySelector('h1').innerHTML = error;
      this.headerRef.innerHTML = error;
      this.video.style.display = "none";
      //document.getElementById('btn-start-recording').style.display = 'none';
      this.btnStartRecording.style.display = "none";
      //document.getElementById('btn-stop-recording').style.display = 'none';
      this.btnStopRecording.style.display = "none";
      throw new Error(error);
    }
  }

  addStreamStopListener(stream, callback) {
    stream.addEventListener(
      "ended",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.addEventListener(
      "inactive",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.getTracks().forEach(function (track) {
      track.addEventListener(
        "ended",
        function () {
          callback();
          callback = function () {};
        },
        false
      );
      track.addEventListener(
        "inactive",
        function () {
          callback();
          callback = function () {};
        },
        false
      );
    });
  }

  detached() {
    document.removeEventListener("click", this.handleBodyClick);
  }

  invokeGetDisplayMedia(success, error) {
    var displaymediastreamconstraints = {
      video: {
        displaySurface: "monitor", // monitor, window, application, browser
        logicalSurface: true,
        cursor: "always", // never, always, motion
      },
    };

    // above constraints are NOT supported YET
    // that's why overriding them
    displaymediastreamconstraints = {
      video: true,
    };

    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error);
    } else {
      navigator
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error);
    }
  }

  captureScreen(callback) {
    this.invokeGetDisplayMedia(
      function (screen) {
        /* this.addStreamStopListener(screen, function () {
        //this.btnStopRecording.click;
      }); */
        callback(screen);
      },
      function (error) {
        console.error(error);
        alert(
          "Unable to capture your screen. Please check console logs.\n" + error
        );
      }
    );
  }

  startRecording = () => {
    console.log("clicked start");
    //this.disabled = true;

    this.btnStartRecording.disabled = true;

    var localthis = this;

    this.captureScreen((screen) => {
      //var video = document.theVideo;
      //var video = this.theVideo; // this should have worked
      //const theVideo = this.element.querySelector('video');
      theVideo.srcObject = screen;
      //document.theVideo.HTMLMediaElement.srcObject = screen;

      recorder = RecordRTC(screen, {
        type: "video",
      });

      recorder.startRecording();

      // release screen on stopRecording
      recorder.screen = screen;

      //this.document.getElementById("btnStopRecording").stopButtonStatus = false;

      //this.stopButtonStatus = false;
      console.log("capture ...");
      //this.btnStopRecording.stopButtonStatus = true;

      localthis.stopButtonStatus = false;

      //this.btnStopRecording.disabled = false;
      //this.element.querySelector("#searchInput") = "";
      //this.stopButtonStatusCChanged();
    });
  };

  /*   get stopButtonStatusCChanged() {
    console.log("stopButtonStatusCChanged");
    return true;
  } */

  /*   startRecording() {
     
    } */

  stopRecording = () => {
    console.log("clicked stop");
    //this.disabled = true;
    this.stopButtonStatus = true;
    recorder.stopRecording(this.stopRecordingCallback);
  };

  stopRecordingCallback() {
    theVideo.src = theVideo.srcObject = null;
    theVideo.src = URL.createObjectURL(recorder.getBlob());

    recorder.screen.stop();
    recorder.destroy();
    recorder = null;

    //document.getElementById("btn-start-recording").disabled = false;
    document.getElementById("btnStartRecording").disabled = false;

    //this.btnStartRecording.disabled = false;
  }
}
